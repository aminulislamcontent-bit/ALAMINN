import type { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { env } from "@/lib/env";
import { sendEmail } from "@/lib/email/transport";
import { kitAction, kitRead, kitOk, kitError, kitAudit } from "@/lib/kits/api";
import { queueCampaign, renderCampaignEmail } from "@/lib/kits/email";
export const dynamic = "force-dynamic";
export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) { return kitRead(req, "newsletter.view", async () => { const { id } = await ctx.params; const campaign = await db.emailCampaign.findUnique({ where: { id }, include: { deliveries: { select: { id: true, status: true, attempts: true, error: true, sentAt: true }, take: 5000 } } }); return campaign ? kitOk(campaign) : kitError("Campaign not found.", 404); }); }
export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) { return kitAction(req, "newsletter.send", z.object({ action: z.enum(["queue", "test"]) }), async (data, session) => {
  const { id } = await ctx.params; const c = await db.emailCampaign.findUnique({ where: { id } }); if (!c) return kitError("Campaign not found.", 404);
  if (!env().emailConfigured) return kitError("Email transport is not configured. Set SMTP or Resend in the server environment first.", 503);
  if (data.action === "test") { const test = renderCampaignEmail(JSON.parse(c.content), session.name); const r = await sendEmail({ to: session.email, subject: `[TEST] ${c.subject}`, html: test.html, text: test.text }); if (!r.success || r.provider === "console") return kitError(r.error || "Test was not sent.", 502); await kitAudit(session, "email.campaign.test", "EmailCampaign", id); return kitOk({ provider: r.provider }, "Test sent to your signed-in account email."); }
  try { const count = await queueCampaign(id); await kitAudit(session, "email.campaign.queue", "EmailCampaign", id, { recipients: count }); return kitOk({ recipients: count }, `${count} consented recipients queued. The email cron must be running to deliver them.`); } catch (e) { return kitError((e as Error).message, 409); }
}); }

import type { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { kitAction, kitOk, kitError, kitAudit } from "@/lib/kits/api";
export const dynamic = "force-dynamic";
export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) { return kitAction(req, "social.content.manage", z.object({ action: z.literal("cancel") }), async (_, session) => { const { id } = await ctx.params; const result = await db.socialContent.updateMany({ where: { id, status: { in: ["draft", "scheduled", "approved", "review"] } }, data: { status: "draft", scheduledAt: null, approvedById: null } }); if (!result.count) return kitError("Only an unpublished post can be cancelled.", 409); await kitAudit(session, "social.scheduler.cancel", "SocialContent", id); return kitOk({ id }, "Schedule cancelled. Post returned to drafts."); }); }

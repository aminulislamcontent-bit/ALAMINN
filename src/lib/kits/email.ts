import { randomBytes } from "node:crypto";
import { db } from "@/lib/db";
import { env } from "@/lib/env";
import { sendEmail } from "@/lib/email/transport";
import type { EmailContent } from "./contracts";
export const escapeHtml = (s: string) => s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
export function renderCampaignEmail(content: EmailContent, name = "there", unsubscribeUrl = "") {
  const color = content.accent === "orange" ? "#F26113" : "#0B63CE";
  const body = content.bodyText.split(/\n\s*\n/).map(p => `<p style="font-size:16px;line-height:1.7;color:#344054;margin:0 0 20px">${escapeHtml(p).replace(/\n/g, "<br>")}</p>`).join("");
  const cta = content.ctaUrl && content.ctaLabel ? `<p style="margin:28px 0"><a href="${escapeHtml(content.ctaUrl)}" style="display:inline-block;background:${color};color:white;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:600">${escapeHtml(content.ctaLabel)}</a></p>` : "";
  const footer = unsubscribeUrl ? `<p style="font-size:12px;color:#667085;margin-top:28px">You received this because you confirmed a subscription to Al Aminn. <a href="${escapeHtml(unsubscribeUrl)}" style="color:#667085">Unsubscribe</a>.</p>` : "";
  const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(content.subject)}</title></head><body style="margin:0;background:#f2f4f7;font-family:Arial,sans-serif"><div style="display:none;max-height:0;overflow:hidden">${escapeHtml(content.preheader)}</div><div style="max-width:600px;margin:24px auto;background:white;border-radius:12px;overflow:hidden"><div style="padding:24px 32px;border-top:4px solid ${color};font-size:22px;font-weight:bold;color:#101828">Al Aminn<span style="color:${color}">.</span></div><div style="padding:8px 32px 32px"><p style="color:#344054">Hi ${escapeHtml(name)},</p>${body}${cta}<p style="color:#344054">Best regards,<br>Al Aminn</p>${footer}<p style="font-size:12px;color:#98a2b3">Alaminn.info · Dhaka, Bangladesh</p></div></div></body></html>`;
  const text = `Hi ${name},\n\n${content.bodyText}\n\n${content.ctaLabel ? `${content.ctaLabel}: ${content.ctaUrl}\n\n` : ""}Best regards,\nAl Aminn${unsubscribeUrl ? `\n\nYou confirmed a subscription to Al Aminn. Unsubscribe: ${unsubscribeUrl}` : ""}`;
  return { html, text };
}
export async function queueCampaign(id: string) {
  const campaign = await db.emailCampaign.findUnique({ where: { id } });
  if (!campaign || !["draft", "failed"].includes(campaign.status)) throw new Error("Only a draft or failed campaign can be queued.");
  if (!env().emailConfigured) throw new Error("Configure SMTP or Resend before sending. No messages have been queued.");
  const subscribers = await db.newsletterSubscriber.findMany({ where: { status: "confirmed", consent: true, ...(campaign.audience !== "all" ? { interest: campaign.audience } : {}) }, take: 5000 });
  if (!subscribers.length) throw new Error("No confirmed, consenting subscribers match this audience.");
  const existing = await db.emailDelivery.findMany({ where: { campaignId: id }, select: { subscriberId: true } });
  const existingIds = new Set(existing.map(d => d.subscriberId));
  const fresh = subscribers.filter(s => !existingIds.has(s.id));
  await db.$transaction(async tx => {
    const claim = await tx.emailCampaign.updateMany({ where: { id, status: { in: ["draft", "failed"] } }, data: { status: "queued" } });
    if (!claim.count) throw new Error("Campaign was already queued by another request.");
    for (let i = 0; i < fresh.length; i += 500) await tx.emailDelivery.createMany({ data: fresh.slice(i, i + 500).map(s => ({ campaignId: id, subscriberId: s.id, email: s.email })) });
    await tx.emailDelivery.updateMany({ where: { campaignId: id, status: { in: ["failed", "skipped"] } }, data: { status: "pending", attempts: 0, error: null } });
    for (const s of subscribers.filter(s => !s.token)) await tx.newsletterSubscriber.update({ where: { id: s.id }, data: { token: randomBytes(32).toString("hex") } });
  });
  return subscribers.length;
}
/** Bounded, persistent and retryable. Cron callers must be authenticated. */
export async function processEmailQueue(limit = 20) {
  if (!env().emailConfigured) return { sent: 0, failed: 0, skipped: 0, configured: false };
  const now = new Date();
  await db.emailDelivery.updateMany({ where: { status: "sending", updatedAt: { lt: new Date(Date.now() - 10 * 60000) }, attempts: { lt: 3 } }, data: { status: "pending" } });
  await db.emailDelivery.updateMany({ where: { status: "sending", updatedAt: { lt: new Date(Date.now() - 10 * 60000) }, attempts: { gte: 3 } }, data: { status: "failed", error: "Delivery timed out after three attempts." } });
  const due = await db.emailDelivery.findMany({ where: { status: "pending", attempts: { lt: 3 }, campaign: { status: { in: ["queued", "sending"] }, OR: [{ scheduledAt: null }, { scheduledAt: { lte: now } }] } }, include: { campaign: true }, orderBy: { createdAt: "asc" }, take: Math.min(limit, 50) });
  let sent = 0, failed = 0, skipped = 0;
  for (const delivery of due) {
    const claim = await db.emailDelivery.updateMany({ where: { id: delivery.id, status: "pending" }, data: { status: "sending", attempts: { increment: 1 } } });
    if (!claim.count) continue;
    await db.emailCampaign.updateMany({ where: { id: delivery.campaignId, status: "queued" }, data: { status: "sending" } });
    const subscriber = await db.newsletterSubscriber.findUnique({ where: { id: delivery.subscriberId } });
    if (!subscriber || subscriber.status !== "confirmed" || !subscriber.consent) { await db.emailDelivery.update({ where: { id: delivery.id }, data: { status: "skipped", error: "Consent withdrawn or subscription no longer confirmed." } }); skipped++; continue; }
    const c = delivery.campaign;
    const content = JSON.parse(c.content) as EmailContent;
    const unsubscribeUrl = `${env().siteUrl}/newsletter/unsubscribe?token=${subscriber.token}`;
    const rendered = renderCampaignEmail(content, subscriber.name || "there", unsubscribeUrl);
    const result = await sendEmail({ to: subscriber.email, subject: c.subject, html: rendered.html, text: rendered.text, headers: { "List-Unsubscribe": `<${unsubscribeUrl}>` } });
    if (result.success && result.provider !== "console") { await db.emailDelivery.update({ where: { id: delivery.id }, data: { status: "sent", providerId: result.messageId, sentAt: new Date(), error: null } }); sent++; }
    else { const attempts = delivery.attempts + 1; await db.emailDelivery.update({ where: { id: delivery.id }, data: { status: attempts >= 3 ? "failed" : "pending", error: (result.error || "No real transport available").slice(0, 500) } }); if (attempts >= 3) failed++; }
  }
  const campaigns = await db.emailCampaign.findMany({ where: { status: { in: ["queued", "sending"] } }, select: { id: true } });
  for (const c of campaigns) { const pending = await db.emailDelivery.count({ where: { campaignId: c.id, status: { in: ["pending", "sending"] } } }); if (!pending) { const delivered = await db.emailDelivery.count({ where: { campaignId: c.id, status: "sent" } }); await db.emailCampaign.update({ where: { id: c.id }, data: { status: delivered ? "sent" : "failed", sentAt: delivered ? new Date() : null } }); } }
  return { sent, failed, skipped, configured: true };
}

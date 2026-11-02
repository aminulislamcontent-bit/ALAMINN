import { db } from "@/lib/db";
import { getAdapter } from "./adapters";
import { getGlobalState } from "./policy-server";
import { decryptToken } from "./crypto";

/** Publish approved, due posts. Never equate a dev/no-token result with delivery.
 * Atomic content/target claims prevent overlapping cron runs from double-sending.
 * Failed targets are left failed for explicit operator review, not blindly retried.
 */
export async function publishDueContent(): Promise<{ published: number; failed: number; suppressed: number }> {
  const state = await getGlobalState();
  if (!state?.publishingEnabled) return { published: 0, failed: 0, suppressed: 0 };
  const due = await db.socialContent.findMany({ where: { status: "scheduled", scheduledAt: { lte: new Date() }, approvedById: { not: null } }, select: { id: true }, take: 25 });
  let published = 0, failed = 0, suppressed = 0;
  for (const entry of due) {
    const claim = await db.socialContent.updateMany({ where: { id: entry.id, status: "scheduled", scheduledAt: { lte: new Date() }, approvedById: { not: null } }, data: { status: "publishing" } });
    if (!claim.count) continue;
    const content = await db.socialContent.findUnique({ where: { id: entry.id }, include: { targets: { include: { account: true } } } });
    if (!content) continue;
    if (!content.targets.length) { await db.socialContent.update({ where: { id: content.id }, data: { status: "failed" } }); failed++; continue; }
    let anySent = false, anyFailed = false;
    for (const target of content.targets) {
      if (target.status !== "pending") { if (target.status === "published") anySent = true; else anyFailed = true; continue; }
      const targetClaim = await db.socialContentTarget.updateMany({ where: { id: target.id, status: "pending" }, data: { status: "publishing", attempts: { increment: 1 } } });
      if (!targetClaim.count) continue;
      const current = await getGlobalState(); const a = target.account;
      const capabilities = (() => { try { return JSON.parse(a.capabilities || "[]") as string[]; } catch { return []; } })();
      if (!current?.publishingEnabled || !a.tokenEncrypted || !decryptToken(a.tokenEncrypted) || a.status !== "connected" || !capabilities.includes("publish") || (a.tokenExpiresAt && a.tokenExpiresAt <= new Date())) {
        await db.socialContentTarget.update({ where: { id: target.id }, data: { status: "suppressed", error: "Publishing disabled, account disconnected, token unavailable/expired, or capability missing." } }); suppressed++; anyFailed = true; continue;
      }
      try {
        let variants: Record<string, string> = {}; let media: string[] = [];
        try { variants = JSON.parse(content.variants || "{}"); media = JSON.parse(content.mediaUrls || "[]"); } catch { /* default body */ }
        if (!Array.isArray(media)) media = [];
        const result = await getAdapter(a.platform).publish(a, variants[a.platform] || content.body, media);
        const sent = result.actuallySent && result.status === "sent" && !!result.providerId;
        await db.socialContentTarget.update({ where: { id: target.id }, data: { status: sent ? "published" : "failed", providerPostId: sent ? result.providerId : null, error: sent ? null : result.error || "Provider did not confirm publication.", publishedAt: sent ? new Date() : null } });
        if (sent) { published++; anySent = true; } else { failed++; anyFailed = true; }
      } catch {
        // Do not strand a claimed target or blindly retry an ambiguous send.
        await db.socialContentTarget.update({ where: { id: target.id }, data: { status: "failed", error: "Publishing interrupted. Verify the provider before retrying." } }).catch(() => null);
        failed++; anyFailed = true;
      }
    }
    await db.socialContent.update({ where: { id: content.id }, data: { status: anySent && !anyFailed ? "published" : "failed" } });
  }
  return { published, failed, suppressed };
}

import { z } from "zod";
import { db } from "@/lib/db";
export const postSchema = z.object({ title: z.string().trim().min(1).max(160), body: z.string().trim().min(1).max(5000), campaignId: z.string().max(80).nullable().default(null), accountIds: z.array(z.string().max(80)).max(10).default([]), scheduledAt: z.string().datetime().nullable().default(null), status: z.enum(["draft", "scheduled"]).default("draft"), mediaUrls: z.array(z.string().url().max(1500).refine(s => s.startsWith("https://"))).max(4).default([]) });
export async function validateTargets(ids: string[], mediaUrls: string[], requireScheduled = true) {
  if (!ids.length) return "Select at least one connected publishing account.";
  const accounts = await db.socialAccount.findMany({ where: { id: { in: ids } } });
  if (accounts.length !== new Set(ids).size) return "One or more selected accounts do not exist.";
  if (!requireScheduled) return null;
  for (const a of accounts) {
    if (a.status !== "connected" || !a.tokenEncrypted) return `${a.displayName} is not connected with a valid token.`;
    if (!["facebook", "instagram"].includes(a.platform)) return `${a.displayName}: publishing is not supported for this platform yet.`;
    if (a.platform === "instagram" && !mediaUrls.length) return `${a.displayName}: Instagram requires at least one public HTTPS image.`;
  }
  return null;
}

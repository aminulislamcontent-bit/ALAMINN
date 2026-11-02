import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
export const hashSupportToken = (token: string) => createHash("sha256").update(token).digest("hex");
export const newSupportToken = () => randomBytes(32).toString("hex");
export async function visitorConversation(req: NextRequest, id: string) {
  const token = req.headers.get("authorization")?.replace(/^Bearer /, "") || "";
  if (!/^[a-f0-9]{64}$/.test(token) || !/^[a-z0-9_-]{1,80}$/i.test(id)) return null;
  const row = await db.supportConversation.findUnique({ where: { id } });
  if (!row) return null;
  const a = Buffer.from(row.tokenHash); const b = Buffer.from(hashSupportToken(token));
  return a.length === b.length && timingSafeEqual(a, b) ? row : null;
}
export function supportRateKey(req: NextRequest) { return `support:${hashSupportToken(req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local")}`; }
export function sameOrigin(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (!origin) return true; // Non-browser clients still need the session/token.
  try {
    const source = new URL(origin);
    const hosts = new Set([req.headers.get("host"), req.headers.get("x-forwarded-host"), req.nextUrl.host]);
    if (process.env.NEXT_PUBLIC_SITE_URL) hosts.add(new URL(process.env.NEXT_PUBLIC_SITE_URL).host);
    return ["https:", "http:"].includes(source.protocol) && hosts.has(source.host);
  } catch { return false; }
}

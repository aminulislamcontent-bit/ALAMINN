import type { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { env } from "@/lib/env";
import { kitAction, kitRead, kitOk, kitError, kitAudit } from "@/lib/kits/api";
import { auditHtml, safeSitePath } from "@/lib/kits/seo";
export const dynamic = "force-dynamic";
export async function GET(req: NextRequest) { return kitRead(req, "articles.view", async () => { const [history, articles] = await Promise.all([db.seoAudit.findMany({ orderBy: { createdAt: "desc" }, take: 30 }), db.article.findMany({ select: { id: true, title: true, slug: true, summary: true, status: true, coverMedia: true }, take: 200, orderBy: { updatedAt: "desc" } })]); return kitOk({ history, articles, siteUrl: env().siteUrl }); }); }
export async function POST(req: NextRequest) { return kitAction(req, "articles.update", z.object({ path: z.string().max(500) }), async (data, session) => {
  let path: string; try { path = safeSitePath(data.path); } catch (e) { return kitError((e as Error).message); }
  const url = new URL(path, env().siteUrl);
  try {
    const start = Date.now();
    const response = await fetch(url, { redirect: "error", signal: AbortSignal.timeout(12000), headers: { "User-Agent": "Alaminn-SEO-Audit/1.0", Accept: "text/html" }, cache: "no-store" });
    if (!response.ok) return kitError(`Page returned HTTP ${response.status}. No audit was saved.`, 502);
    if (!response.headers.get("content-type")?.includes("text/html")) return kitError("The URL did not return an HTML page.", 422);
    const reader = response.body?.getReader(); if (!reader) return kitError("Empty response.", 502);
    const chunks: Uint8Array[] = []; let size = 0;
    while (true) { const { done, value } = await reader.read(); if (done) break; size += value.length; if (size > 2000000) { await reader.cancel(); return kitError("Page exceeds the 2 MB audit limit.", 413); } chunks.push(value); }
    const html = new TextDecoder().decode(Buffer.concat(chunks));
    const result = auditHtml(html, url.toString(), Date.now() - start);
    const row = await db.seoAudit.create({ data: { url: url.toString(), score: result.score, checks: JSON.stringify(result.checks), summary: result.summary, createdById: session.userId } });
    await kitAudit(session, "seo.audit", "SeoAudit", row.id, { path, score: row.score }); return kitOk(row, "Page audit complete.", 201);
  } catch (e) { if (e instanceof Error && (e.name === "TimeoutError" || e.name === "AbortError")) return kitError("The page timed out after 12 seconds.", 504); return kitError("Could not fetch this page. Check the configured site URL and make sure the server can reach it. Redirects are blocked for safety.", 502); }
}); }

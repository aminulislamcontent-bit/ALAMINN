export type SeoCheck = { id: string; label: string; status: "pass" | "warn" | "fail"; detail: string; weight: number };
export function auditHtml(html: string, url: string, responseMs: number): { checks: SeoCheck[]; score: number; summary: string } {
  const decode = (s: string) => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
  const title = decode(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() || "");
  const descriptionTag = (html.match(/<meta\b[^>]*>/gi) || []).find(t => /\bname\s*=\s*["']description["']/i.test(t));
  const description = decode(descriptionTag?.match(/\bcontent\s*=\s*["']([^"']*)["']/i)?.[1] || "");
  const viewport = /<meta\b[^>]*name=["']viewport["']/i.test(html);
  const h1s = html.match(/<h1\b[^>]*>/gi) || [];
  const images = html.match(/<img\b[^>]*>/gi) || [];
  const missingAlt = images.filter(t => !/\balt=["'][^"']+["']/i.test(t)).length;
  const canonicalTag = (html.match(/<link\b[^>]*>/gi) || []).find(t => /\brel\s*=\s*["']canonical["']/i.test(t));
  const canonical = canonicalTag?.match(/\bhref\s*=\s*["']([^"']*)["']/i)?.[1];
  const noindex = /<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html);
  const structured = /<script\b[^>]*type=["']application\/ld\+json["']/i.test(html);
  const check = (id: string, label: string, pass: boolean, detail: string, weight = 1, warn = false): SeoCheck => ({ id, label, status: pass ? "pass" : warn ? "warn" : "fail", detail, weight });
  const checks = [
    check("title", "Page title", title.length >= 20 && title.length <= 65, title ? `${title.length} characters: ${title}` : "Missing title tag.", 3),
    check("description", "Meta description", description.length >= 70 && description.length <= 165, description ? `${description.length} characters.` : "Missing meta description.", 3),
    check("h1", "One main heading", h1s.length === 1, `${h1s.length} H1 headings found.`, 2),
    check("canonical", "Canonical URL", !!canonical, canonical || "No canonical link found.", 2),
    check("indexable", "Search indexing", !noindex, noindex ? "This page explicitly requests noindex." : "No noindex directive found.", 3),
    check("viewport", "Mobile viewport", viewport, viewport ? "Responsive viewport is configured." : "Add a responsive viewport meta tag.", 2),
    check("https", "Secure URL", new URL(url).protocol === "https:", "Production URLs should use HTTPS. Local previews may use HTTP.", 1, true),
    check("alt", "Image descriptions", missingAlt === 0, `${missingAlt} of ${images.length} image tags lack descriptive alt text. Decorative images may legitimately use empty alt.`, 1, true),
    check("structured", "Structured data", structured, structured ? "JSON-LD is present; validate its claims separately." : "No JSON-LD script found.", 1, true),
    check("response", "Server response", responseMs < 1500, `${responseMs} ms HTML response. This is not a Core Web Vitals or Lighthouse measurement.`, 1, true),
  ];
  const total = checks.reduce((a, c) => a + c.weight, 0);
  const score = Math.round(checks.reduce((a, c) => a + (c.status === "pass" ? c.weight : c.status === "warn" ? c.weight * 0.5 : 0), 0) / total * 100);
  return { checks, score, summary: `${checks.filter(c => c.status === "pass").length}/${checks.length} checks passed. On-page HTML audit only; rankings and field performance are not measured.` };
}
export function safeSitePath(input: string): string {
  if (!input.startsWith("/") || input.startsWith("//") || input.includes("\\") || /[\r\n]/.test(input)) throw new Error("Enter a relative public page path, such as /about.");
  const u = new URL(input, "https://example.com");
  if (/^\/(admin|api)(\/|$)/.test(u.pathname)) throw new Error("Private admin and API routes cannot be audited.");
  return u.pathname + u.search;
}

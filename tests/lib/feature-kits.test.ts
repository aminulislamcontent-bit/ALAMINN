import { describe, it, expect } from "vitest";
import { diagramSchema, storyboardSchema, emailContentSchema, campaignSchema, documentSchema, stageGroup } from "@/lib/kits/contracts";
import { escapeHtml, renderCampaignEmail } from "@/lib/kits/email";
import { hashSupportToken } from "@/lib/kits/support";
import { auditHtml } from "@/lib/kits/seo";
import { FEATURE_KITS } from "@/lib/kits/catalog";

describe("feature kit contracts", () => {
  it("exposes all ten requested routes without duplicates", () => { expect(FEATURE_KITS).toHaveLength(10); expect(new Set(FEATURE_KITS.map(k => k.href)).size).toBe(10); });
  it("rejects dangling, self-referencing and duplicate diagram nodes", () => {
    const nodes = [{ id: "a", label: "Visitor", x: 0, y: 0, color: "blue" }];
    expect(diagramSchema.safeParse({ nodes, edges: [] }).success).toBe(true);
    for (const edges of [[{ from: "a", to: "missing" }], [{ from: "a", to: "a" }]]) expect(diagramSchema.safeParse({ nodes, edges }).success).toBe(false);
    expect(diagramSchema.safeParse({ nodes: [...nodes, ...nodes], edges: [] }).success).toBe(false);
  });
  it("validates storyboard durations and unique scenes", () => {
    const scene = { id: "1", title: "Hook", description: "Show the problem", dialogue: "", durationSeconds: 5, shot: "Wide" };
    expect(storyboardSchema.safeParse({ scenes: [scene] }).success).toBe(true);
    expect(storyboardSchema.safeParse({ scenes: [scene, scene] }).success).toBe(false);
    expect(storyboardSchema.safeParse({ scenes: [{ ...scene, durationSeconds: 0 }] }).success).toBe(false);
  });
  it("rejects unsafe CTA protocols and incomplete CTAs", () => {
    const base = { subject: "Hello", preheader: "", bodyText: "A useful update", ctaLabel: "Read", ctaUrl: "https://alaminn.info", accent: "blue" };
    expect(emailContentSchema.safeParse(base).success).toBe(true);
    expect(emailContentSchema.safeParse({ ...base, ctaUrl: "javascript:alert(1)" }).success).toBe(false);
    expect(emailContentSchema.safeParse({ ...base, ctaLabel: "" }).success).toBe(false);
  });
  it("validates document JSON, campaign dates and UTM values", () => {
    expect(documentSchema.safeParse({ kind: "diagram", title: "Test", content: "not json" }).success).toBe(false);
    expect(campaignSchema.safeParse({ name: "Launch", startsAt: "2026-11-03T00:00:00.000Z", endsAt: "2026-11-02T00:00:00.000Z" }).success).toBe(false);
    expect(campaignSchema.safeParse({ name: "Launch", utmCampaign: "bad value" }).success).toBe(false);
  });
  it("maps existing inquiries into the six pipeline columns", () => { expect(stageGroup("scope-required")).toBe("qualified"); expect(stageGroup("in-progress")).toBe("negotiation"); expect(stageGroup("unknown")).toBe("new"); });
});
describe("safe email rendering", () => {
  it("escapes subscriber content and includes a real unsubscribe URL in both formats", () => {
    const content = { subject: "Update", preheader: "", bodyText: '<script>alert("x")</script>', ctaLabel: "Read", ctaUrl: "https://alaminn.info", accent: "blue" as const };
    const result = renderCampaignEmail(content, "<b>Visitor</b>", "https://alaminn.info/newsletter/unsubscribe?token=abc");
    expect(result.html).not.toContain("<script>"); expect(result.html).toContain("&lt;script&gt;"); expect(result.html).toContain("&lt;b&gt;Visitor&lt;/b&gt;");
    expect(result.html).toContain("token=abc"); expect(result.text).toContain("token=abc"); expect(escapeHtml('&"')).toBe("&amp;&quot;");
  });
});
describe("support privacy", () => {
  it("hashes tokens deterministically without retaining the bearer secret", () => { const hash = hashSupportToken("a-secret-visitor-token"); expect(hash).toMatch(/^[a-f0-9]{64}$/); expect(hash).toBe(hashSupportToken("a-secret-visitor-token")); expect(hash).not.toContain("secret"); expect(hash).not.toBe(hashSupportToken("another-token")); });
});
describe("SEO audit", () => {
  it("detects metadata regardless of attribute order and does not invent a passing score", () => {
    const html = '<html><head><title>A useful page title</title><meta content="A useful, informative description for search visitors who want to understand our work." name="description"><link href="https://alaminn.info/page" rel="canonical"></head><body><h1>Main heading</h1><img src="/a.jpg" alt="A description"><a href="/about">About our work</a></body></html>';
    const result = auditHtml(html, "https://alaminn.info/page", 120);
    expect(result.checks.find(c => c.id === "description")?.status).toBe("pass");
    expect(result.checks.find(c => c.id === "canonical")?.status).toBe("pass");
    expect(result.score).toBeGreaterThan(0);
  });
});

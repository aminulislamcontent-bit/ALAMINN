import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { INTEGRATIONS, INTEGRATION_BY_ID, INTEGRATION_CATEGORIES, isConnectable } from "@/lib/integrations/registry";
import { testIntegration } from "@/lib/integrations/connectors";

describe("integration registry", () => {
  it("has unique ids and valid categories for every entry", () => {
    const ids = new Set(INTEGRATIONS.map(i => i.id));
    expect(ids.size).toBe(INTEGRATIONS.length);
    for (const i of INTEGRATIONS) {
      expect(INTEGRATION_BY_ID[i.id]).toBe(i);
      expect(INTEGRATION_CATEGORIES).toContain(i.category);
      expect(i.url).toMatch(/^https:\/\//);
      expect(i.integrationNote.length).toBeGreaterThan(10);
    }
  });
  it("only adapter/service modes are connectable and expose fields", () => {
    for (const i of INTEGRATIONS) {
      if (isConnectable(i.mode)) { expect(i.fields?.length).toBeGreaterThan(0); expect(i.connector).toBeTruthy(); }
      else { expect(i.connector).toBeUndefined(); }
    }
  });
  it("excludes offensive tooling and flags the dead link", () => {
    expect(INTEGRATION_BY_ID["wifi-cracker"].mode).toBe("excluded");
    expect(INTEGRATION_BY_ID["ai-marketing-crm"].mode).toBe("unavailable");
  });
  it("documents the licensing boundary for every copyleft project (no silent vendoring)", () => {
    // We never copy GPL/AGPL code. An HTTP adapter that talks to a copyleft
    // *service* is fine, but the note must make the boundary explicit.
    for (const i of INTEGRATIONS) {
      if (/GPL|AGPL/.test(i.license)) {
        expect(i.integrationNote).toMatch(/self-host|separately|not vendored|not copied|no agpl|no gpl|api contract|external|not embedded|workstation|mobile client|desktop/i);
      }
    }
  });
});

describe("connection connectors", () => {
  beforeEach(() => { vi.stubGlobal("fetch", vi.fn()); });
  afterEach(() => { vi.unstubAllGlobals(); });

  it("fails closed without credentials", async () => {
    const r = await testIntegration(INTEGRATION_BY_ID["httpsms"], {});
    expect(r.ok).toBe(false); expect(fetch).not.toHaveBeenCalled();
  });
  it("reports a valid httpSMS key", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(new Response("{}", { status: 200 }));
    const r = await testIntegration(INTEGRATION_BY_ID["httpsms"], { apiKey: "xsms-test" });
    expect(r.ok).toBe(true);
    const [url, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(String(url)).toContain("/v1/users/me");
    expect((init as RequestInit).redirect).toBe("manual");
  });
  it("treats unauthorized as a failed test", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(new Response("{}", { status: 401 }));
    const r = await testIntegration(INTEGRATION_BY_ID["openrouter"], { apiKey: "sk-or-bad" });
    expect(r.ok).toBe(false); expect(r.status).toBe(401);
  });
  it("blocks the cloud metadata endpoint", async () => {
    const r = await testIntegration(INTEGRATION_BY_ID["opensms"], { baseUrl: "http://169.254.169.254" });
    expect(r.ok).toBe(false); expect(fetch).not.toHaveBeenCalled();
  });
  it("rejects non-http protocols", async () => {
    const r = await testIntegration(INTEGRATION_BY_ID["opensms"], { baseUrl: "file:///etc/passwd" });
    expect(r.ok).toBe(false); expect(fetch).not.toHaveBeenCalled();
  });
  it("confirms a reachable generic self-hosted service", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(new Response("ok", { status: 200 }));
    const r = await testIntegration(INTEGRATION_BY_ID["dify"], { baseUrl: "https://dify.example.com/" });
    expect(r.ok).toBe(true);
    expect(String((fetch as ReturnType<typeof vi.fn>).mock.calls[0][0])).toBe("https://dify.example.com/health");
  });
  it("returns a clear failure for reference/desktop integrations", async () => {
    const r = await testIntegration(INTEGRATION_BY_ID["kdenlive"], {});
    expect(r.ok).toBe(false); expect(fetch).not.toHaveBeenCalled();
  });
});

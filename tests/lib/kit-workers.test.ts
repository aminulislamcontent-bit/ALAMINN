import { describe, it, expect, vi, beforeEach } from "vitest";
const m = vi.hoisted(() => ({ db: { emailDelivery: { updateMany: vi.fn(), findMany: vi.fn(), update: vi.fn(), count: vi.fn() }, emailCampaign: { updateMany: vi.fn(), findMany: vi.fn(), update: vi.fn() }, newsletterSubscriber: { findUnique: vi.fn() } }, sendEmail: vi.fn(), emailConfigured: true }));
vi.mock("@/lib/db", () => ({ db: m.db }));
vi.mock("@/lib/env", () => ({ env: () => ({ emailConfigured: m.emailConfigured, siteUrl: "https://alaminn.info" }) }));
vi.mock("@/lib/email/transport", () => ({ sendEmail: m.sendEmail }));
import { processEmailQueue } from "@/lib/kits/email";
const campaign = { id: "c1", subject: "Update", content: JSON.stringify({ subject: "Update", preheader: "", bodyText: "Hello", ctaLabel: "", ctaUrl: "", accent: "blue" }), status: "queued", scheduledAt: null };
const delivery = { id: "d1", campaignId: "c1", subscriberId: "s1", attempts: 0, campaign };
beforeEach(() => {
  vi.resetAllMocks(); m.emailConfigured = true;
  m.db.emailDelivery.updateMany.mockResolvedValue({ count: 0 }); m.db.emailDelivery.findMany.mockResolvedValue([delivery]); m.db.emailDelivery.update.mockResolvedValue({}); m.db.emailDelivery.count.mockResolvedValue(0);
  m.db.emailCampaign.updateMany.mockResolvedValue({ count: 1 }); m.db.emailCampaign.findMany.mockResolvedValue([{ id: "c1" }]); m.db.emailCampaign.update.mockResolvedValue({});
  m.db.newsletterSubscriber.findUnique.mockResolvedValue({ id: "s1", email: "reader@example.com", name: "Reader", token: "a".repeat(64), status: "confirmed", consent: true });
});
describe("email delivery worker", () => {
  it("does no work without a real transport", async () => { m.emailConfigured = false; expect(await processEmailQueue()).toEqual({ sent: 0, failed: 0, skipped: 0, configured: false }); expect(m.db.emailDelivery.findMany).not.toHaveBeenCalled(); });
  it("atomically claims a pending delivery and records the provider id", async () => {
    m.db.emailDelivery.updateMany.mockResolvedValueOnce({ count: 0 }).mockResolvedValueOnce({ count: 0 }).mockResolvedValueOnce({ count: 1 });
    m.sendEmail.mockResolvedValue({ success: true, provider: "smtp", messageId: "provider-1" });
    expect((await processEmailQueue()).sent).toBe(1);
    expect(m.db.emailDelivery.update).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ status: "sent", providerId: "provider-1" }) }));
    expect(m.sendEmail.mock.calls[0][0].headers["List-Unsubscribe"]).toContain("token=");
  });
  it("never treats a console/dev response as a real send", async () => {
    m.db.emailDelivery.updateMany.mockResolvedValueOnce({ count: 0 }).mockResolvedValueOnce({ count: 0 }).mockResolvedValueOnce({ count: 1 });
    m.sendEmail.mockResolvedValue({ success: true, provider: "console", messageId: "dev-1" });
    expect((await processEmailQueue()).sent).toBe(0);
    expect(m.db.emailDelivery.update).toHaveBeenLastCalledWith(expect.objectContaining({ data: expect.objectContaining({ status: "pending" }) }));
  });
  it("skips withdrawn consent before contacting the transport", async () => {
    m.db.emailDelivery.updateMany.mockResolvedValueOnce({ count: 0 }).mockResolvedValueOnce({ count: 0 }).mockResolvedValueOnce({ count: 1 });
    m.db.newsletterSubscriber.findUnique.mockResolvedValue({ id: "s1", consent: false, status: "unsubscribed" });
    expect((await processEmailQueue()).skipped).toBe(1); expect(m.sendEmail).not.toHaveBeenCalled();
  });
  it("does not send a delivery claimed by another worker", async () => { await processEmailQueue(); expect(m.sendEmail).not.toHaveBeenCalled(); });
});

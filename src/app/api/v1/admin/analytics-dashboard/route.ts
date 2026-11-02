import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { env } from "@/lib/env";
import { hasPermission } from "@/lib/rbac";
import { kitRead, kitOk } from "@/lib/kits/api";
export const dynamic = "force-dynamic";
export async function GET(req: NextRequest) { return kitRead(req, "dashboard.view", async session => {
  const days = [7, 30, 90].includes(Number(new URL(req.url).searchParams.get("days"))) ? Number(new URL(req.url).searchParams.get("days")) : 30;
  const since = new Date(Date.now() - days * 86400000); const where = { createdAt: { gte: since } };
  const [events, viewsCount, sessionGroups, byEvent, bySource, byPage, inquiries, meetings, subscribers, scheduled, failedEmails, openChats, health, automation, recentJobs] = await Promise.all([
    db.analyticsEvent.findMany({ where, select: { createdAt: true, eventName: true, sessionId: true }, orderBy: { createdAt: "asc" }, take: 50000 }),
    db.analyticsEvent.count({ where: { ...where, eventName: "page_view" } }),
    db.analyticsEvent.groupBy({ by: ["sessionId"], where }),
    db.analyticsEvent.groupBy({ by: ["eventName"], where, _count: { id: true }, orderBy: { _count: { id: "desc" } } }),
    db.analyticsEvent.groupBy({ by: ["utmSource"], where: { ...where, eventName: "page_view" }, _count: { id: true }, orderBy: { _count: { id: "desc" } }, take: 8 }),
    db.analyticsEvent.groupBy({ by: ["page"], where: { ...where, eventName: "page_view" }, _count: { id: true }, orderBy: { _count: { id: "desc" } }, take: 8 }),
    db.inquiry.count({ where }), db.meetingRequest.count({ where }), db.newsletterSubscriber.count({ where: { status: "confirmed", consent: true } }),
    db.socialContent.count({ where: { status: "scheduled" } }), db.emailDelivery.count({ where: { status: "failed" } }), db.supportConversation.count({ where: { status: { not: "resolved" } } }),
    db.$queryRaw`SELECT 1`.then(() => true).catch(() => false),
    db.socialAutomationState.findUnique({ where: { id: "global" } }),
    db.auditLog.findMany({ where: { action: { startsWith: "cron." } }, orderBy: { createdAt: "desc" }, take: 5, select: { id: true, action: true, createdAt: true } }),
  ]);
  const chartStart = new Date(); chartStart.setUTCHours(0, 0, 0, 0); chartStart.setUTCDate(chartStart.getUTCDate() - days + 1);
  const daily = Array.from({ length: days }, (_, i) => { const date = new Date(chartStart.getTime() + i * 86400000).toISOString().slice(0, 10); const rows = events.filter(e => e.createdAt.toISOString().slice(0, 10) === date); return { date: date.slice(5), views: rows.filter(e => e.eventName === "page_view").length, sessions: new Set(rows.map(e => e.sessionId).filter(Boolean)).size }; });
  const canSeeSystem = hasPermission(session.role, "security_settings.view");
  return kitOk({ days, truncated: events.length >= 50000, kpis: { views: viewsCount, sessions: sessionGroups.filter(g => g.sessionId).length, inquiries, meetings, subscribers }, daily, byEvent: byEvent.map(e => ({ name: e.eventName, count: e._count.id })), sources: bySource.map(e => ({ name: e.utmSource || "Direct / unknown", count: e._count.id })), pages: byPage.map(e => ({ name: e.page || "Unknown", count: e._count.id })), system: canSeeSystem ? { database: health, emailConfigured: env().emailConfigured, cronConfigured: !!process.env.CRON_SECRET, publishingEnabled: automation?.publishingEnabled || false, engagementEnabled: automation?.engagementEnabled || false, scheduled, failedEmails, openChats, uptimeSeconds: Math.round(process.uptime()), heapMb: Math.round(process.memoryUsage().heapUsed / 1048576), recentJobs } : null });
}); }

import type { NextRequest } from "next/server";
import { z } from "zod";
import { requirePermission } from "@/lib/auth";
import { db } from "@/lib/db";
import { kitAction, kitOk, kitAudit } from "@/lib/kits/api";
export const dynamic = "force-dynamic";
export async function PUT(req: NextRequest) { return kitAction(req, "social.automation.manage", z.object({ enabled: z.boolean() }), async (data, session) => { const guard = await requirePermission(req, "social.content.publish"); if (guard.denied) return guard.response; const state = await db.socialAutomationState.upsert({ where: { id: "global" }, create: { id: "global", publishingEnabled: data.enabled, changedById: session.userId, changedByName: session.name }, update: { publishingEnabled: data.enabled, changedById: session.userId, changedByName: session.name, version: { increment: 1 } } }); await kitAudit(session, "social.publishing.switch", "SocialAutomationState", state.id, { enabled: data.enabled }); return kitOk(state, data.enabled ? "Publishing enabled. Approved due posts can now be delivered by cron." : "Publishing disabled. No scheduled posts will be sent."); }); }

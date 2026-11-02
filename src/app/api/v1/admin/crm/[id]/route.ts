import type { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { kitAction, kitOk, kitError, kitAudit } from "@/lib/kits/api";
import { PIPELINE_STAGES } from "@/lib/kits/contracts";
export const dynamic = "force-dynamic";
export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) { return kitAction(req, "opportunities.update", z.object({ stage: z.enum(PIPELINE_STAGES) }), async (data, session) => { const { id } = await ctx.params; const r = await db.opportunity.updateMany({ where: { id }, data: { stage: data.stage } }); if (!r.count) return kitError("Opportunity not found.", 404); await kitAudit(session, "crm.deal.stage", "Opportunity", id, data); return kitOk({ id, ...data }, "Pipeline updated."); }); }

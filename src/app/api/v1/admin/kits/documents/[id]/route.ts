import type { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { kitAction, kitAudit, kitOk, kitError } from "@/lib/kits/api";
import { documentSchema } from "@/lib/kits/contracts";
export const dynamic = "force-dynamic";
type Ctx = { params: Promise<{ id: string }> };
export async function PUT(req: NextRequest, ctx: Ctx) { return kitAction(req, "ai_tasks.update", documentSchema, async (data, session) => { const { id } = await ctx.params; const result = await db.kitDocument.updateMany({ where: { id }, data }); if (!result.count) return kitError("Document not found.", 404); await kitAudit(session, "kit.document.update", "KitDocument", id, { kind: data.kind }); return kitOk(await db.kitDocument.findUnique({ where: { id } })); }); }
export async function DELETE(req: NextRequest, ctx: Ctx) { return kitAction(req, "ai_tasks.delete", z.object({}), async (_, session) => { const { id } = await ctx.params; const result = await db.kitDocument.deleteMany({ where: { id } }); if (!result.count) return kitError("Document not found.", 404); await kitAudit(session, "kit.document.delete", "KitDocument", id); return kitOk({ id }, "Document deleted."); }); }

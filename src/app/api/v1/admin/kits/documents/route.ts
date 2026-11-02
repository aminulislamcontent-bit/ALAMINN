import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { kitAction, kitRead, kitOk, kitAudit } from "@/lib/kits/api";
import { documentSchema } from "@/lib/kits/contracts";
export const dynamic = "force-dynamic";
export async function GET(req: NextRequest) { return kitRead(req, "ai_tasks.view", async () => { const kind = new URL(req.url).searchParams.get("kind"); return kitOk(await db.kitDocument.findMany({ where: kind ? { kind } : {}, orderBy: { updatedAt: "desc" }, take: 100 })); }); }
export async function POST(req: NextRequest) { return kitAction(req, "ai_tasks.create", documentSchema, async (data, session) => { const row = await db.kitDocument.create({ data: { ...data, createdById: session.userId } }); await kitAudit(session, "kit.document.create", "KitDocument", row.id, { kind: row.kind }); return kitOk(row, "Document saved.", 201); }); }

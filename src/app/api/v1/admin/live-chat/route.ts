import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { kitRead, kitOk } from "@/lib/kits/api";
export const dynamic = "force-dynamic";
export async function GET(req: NextRequest) { return kitRead(req, "social.view", async () => kitOk(await db.supportConversation.findMany({ select: { id: true, visitorName: true, visitorEmail: true, status: true, assignedTo: true, lastMessageAt: true, createdAt: true, messages: { orderBy: { createdAt: "desc" }, take: 1, select: { body: true, sender: true } } }, orderBy: { lastMessageAt: "desc" }, take: 100 }))); }

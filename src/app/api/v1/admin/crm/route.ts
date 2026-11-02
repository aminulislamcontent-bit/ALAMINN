import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { kitAction, kitRead, kitOk, kitError, kitAudit } from "@/lib/kits/api";
import { dealSchema } from "@/lib/kits/contracts";
export const dynamic = "force-dynamic";
export async function GET(req: NextRequest) { return kitRead(req, "opportunities.view", async () => { const [opportunities, contacts] = await Promise.all([db.opportunity.findMany({ include: { contact: { select: { id: true, fullName: true, email: true, organization: true } } }, orderBy: { updatedAt: "desc" }, take: 500 }), db.contact.findMany({ select: { id: true, fullName: true, email: true }, orderBy: { fullName: "asc" }, take: 500 })]); return kitOk({ opportunities, contacts }); }); }
export async function POST(req: NextRequest) { return kitAction(req, "opportunities.create", dealSchema, async (data, session) => {
  let contactId = data.contactId;
  if (!contactId) {
    if (!data.contactName || !data.contactEmail) return kitError("Choose a contact or provide a name and email.");
    const existing = await db.contact.findUnique({ where: { email: data.contactEmail.toLowerCase() } });
    if (existing) contactId = existing.id;
    else { const contact = await db.contact.create({ data: { fullName: data.contactName, email: data.contactEmail.toLowerCase(), source: "crm-pipeline" } }); contactId = contact.id; }
  }
  if (!await db.contact.findUnique({ where: { id: contactId } })) return kitError("Contact not found.", 404);
  const deal = await db.opportunity.create({ data: { title: data.title, contactId, value: data.value, currency: data.currency, stage: data.stage, closeDate: data.closeDate ? new Date(data.closeDate) : null }, include: { contact: true } });
  await kitAudit(session, "crm.deal.create", "Opportunity", deal.id, { stage: deal.stage }); return kitOk(deal, "Opportunity created.", 201);
}); }

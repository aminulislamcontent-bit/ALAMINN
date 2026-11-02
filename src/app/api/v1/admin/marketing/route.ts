import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { kitAction, kitRead, kitOk, kitAudit } from "@/lib/kits/api";
import { campaignSchema } from "@/lib/kits/contracts";
export const dynamic = "force-dynamic";
export async function GET(req: NextRequest) { return kitRead(req, "social.view", async () => { const [campaigns, inquiries] = await Promise.all([db.socialCampaign.findMany({ include: { _count: { select: { contents: true, emailCampaigns: true } } }, orderBy: { createdAt: "desc" }, take: 100 }), db.inquiry.findMany({ where: { utmCampaign: { not: null } }, select: { utmCampaign: true, createdAt: true }, take: 5000 })]); return kitOk({ campaigns, attribution: inquiries }); }); }
export async function POST(req: NextRequest) { return kitAction(req, "social.content.manage", campaignSchema, async (data, session) => { const row = await db.socialCampaign.create({ data: { ...data, channels: JSON.stringify(data.channels), startsAt: data.startsAt ? new Date(data.startsAt) : null, endsAt: data.endsAt ? new Date(data.endsAt) : null, utmCampaign: data.utmCampaign || data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 100) } }); await kitAudit(session, "marketing.campaign.create", "SocialCampaign", row.id); return kitOk(row, "Campaign created.", 201); }); }

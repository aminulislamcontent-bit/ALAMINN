-- CreateTable
CREATE TABLE "KitDocument" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "kind" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" TEXT,
    "createdById" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SeoAudit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "checks" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "createdById" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "EmailCampaign" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "preheader" TEXT,
    "bodyHtml" TEXT NOT NULL,
    "bodyText" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "audience" TEXT NOT NULL DEFAULT 'all',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "scheduledAt" DATETIME,
    "sentAt" DATETIME,
    "createdById" TEXT,
    "campaignId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "EmailCampaign_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "SocialCampaign" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EmailDelivery" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaignId" TEXT NOT NULL,
    "subscriberId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "providerId" TEXT,
    "error" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "sentAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "EmailDelivery_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "EmailCampaign" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SupportConversation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "visitorName" TEXT NOT NULL,
    "visitorEmail" TEXT,
    "tokenHash" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "assignedTo" TEXT,
    "lastMessageAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SupportMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "conversationId" TEXT NOT NULL,
    "sender" TEXT NOT NULL,
    "senderName" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SupportMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "SupportConversation" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SocialCampaign" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "objective" TEXT,
    "pillar" TEXT,
    "audience" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "startsAt" DATETIME,
    "endsAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "budget" INTEGER NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "channels" TEXT NOT NULL DEFAULT '[]',
    "brief" TEXT,
    "utmCampaign" TEXT
);
INSERT INTO "new_SocialCampaign" ("audience", "createdAt", "endsAt", "id", "name", "objective", "pillar", "startsAt", "status", "updatedAt") SELECT "audience", "createdAt", "endsAt", "id", "name", "objective", "pillar", "startsAt", "status", "updatedAt" FROM "SocialCampaign";
DROP TABLE "SocialCampaign";
ALTER TABLE "new_SocialCampaign" RENAME TO "SocialCampaign";
CREATE INDEX "SocialCampaign_status_idx" ON "SocialCampaign"("status");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "KitDocument_kind_updatedAt_idx" ON "KitDocument"("kind", "updatedAt");

-- CreateIndex
CREATE INDEX "KitDocument_createdById_idx" ON "KitDocument"("createdById");

-- CreateIndex
CREATE INDEX "SeoAudit_createdAt_idx" ON "SeoAudit"("createdAt");

-- CreateIndex
CREATE INDEX "EmailCampaign_status_scheduledAt_idx" ON "EmailCampaign"("status", "scheduledAt");

-- CreateIndex
CREATE INDEX "EmailDelivery_status_updatedAt_idx" ON "EmailDelivery"("status", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "EmailDelivery_campaignId_subscriberId_key" ON "EmailDelivery"("campaignId", "subscriberId");

-- CreateIndex
CREATE UNIQUE INDEX "SupportConversation_tokenHash_key" ON "SupportConversation"("tokenHash");

-- CreateIndex
CREATE INDEX "SupportConversation_status_lastMessageAt_idx" ON "SupportConversation"("status", "lastMessageAt");

-- CreateIndex
CREATE INDEX "SupportMessage_conversationId_createdAt_idx" ON "SupportMessage"("conversationId", "createdAt");

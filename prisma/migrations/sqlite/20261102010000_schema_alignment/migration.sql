-- Add columns/tables present in the Prisma model but missing from older db-push databases.
PRAGMA foreign_keys=OFF;
ALTER TABLE "User" ADD COLUMN "passwordResetToken" TEXT;
ALTER TABLE "User" ADD COLUMN "passwordResetExpiresAt" DATETIME;
CREATE TABLE "KnowledgeChunk" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "documentId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "embedding" JSONB,
    "chunkIndex" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'indexed',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
CREATE INDEX "User_passwordResetToken_idx" ON "User"("passwordResetToken");
CREATE INDEX "KnowledgeChunk_documentId_idx" ON "KnowledgeChunk"("documentId");
CREATE INDEX "KnowledgeChunk_chunkIndex_idx" ON "KnowledgeChunk"("chunkIndex");
CREATE INDEX "KnowledgeChunk_status_idx" ON "KnowledgeChunk"("status");

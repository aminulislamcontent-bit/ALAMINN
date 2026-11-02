-- Additive experimental AgentOS tables. Do not apply to existing databases without approval.
CREATE TABLE "AgentOsTask" (
 "id" TEXT NOT NULL PRIMARY KEY, "project" TEXT NOT NULL, "agent" TEXT NOT NULL,
 "objective" TEXT NOT NULL, "inputs" TEXT NOT NULL, "permissions" TEXT NOT NULL,
 "outputs" TEXT, "deadline" DATETIME NOT NULL, "maxAttempts" INTEGER NOT NULL,
 "attempts" INTEGER NOT NULL DEFAULT 0, "status" TEXT NOT NULL DEFAULT 'queued',
 "leaseToken" TEXT, "leaseUntil" DATETIME, "createdBy" TEXT NOT NULL,
 "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL
);
CREATE INDEX "AgentOsTask_status_leaseUntil_idx" ON "AgentOsTask"("status", "leaseUntil");
CREATE TABLE "AgentOsApproval" (
 "id" TEXT NOT NULL PRIMARY KEY, "taskId" TEXT NOT NULL, "action" TEXT NOT NULL,
 "decision" TEXT NOT NULL, "decidedBy" TEXT, "expiresAt" DATETIME NOT NULL,
 "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "AgentOsApproval_taskId_idx" ON "AgentOsApproval"("taskId");
CREATE TABLE "AgentOsAudit" (
 "sequence" INTEGER NOT NULL PRIMARY KEY, "event" TEXT NOT NULL,
 "previousHash" TEXT NOT NULL, "hash" TEXT NOT NULL,
 "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

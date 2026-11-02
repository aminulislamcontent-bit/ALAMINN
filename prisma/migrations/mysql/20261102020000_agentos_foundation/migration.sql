-- Additive only. Unexecuted; production use requires review and separate approval.
CREATE TABLE `AgentOsTask` (
 `id` VARCHAR(191) NOT NULL, `project` VARCHAR(191) NOT NULL, `agent` VARCHAR(191) NOT NULL,
 `objective` LONGTEXT NOT NULL, `inputs` LONGTEXT NOT NULL, `permissions` LONGTEXT NOT NULL,
 `outputs` LONGTEXT NULL, `deadline` DATETIME(3) NOT NULL, `maxAttempts` INTEGER NOT NULL,
 `attempts` INTEGER NOT NULL DEFAULT 0, `status` VARCHAR(191) NOT NULL DEFAULT 'queued',
 `leaseToken` VARCHAR(191) NULL, `leaseUntil` DATETIME(3) NULL, `createdBy` VARCHAR(191) NOT NULL,
 `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), `updatedAt` DATETIME(3) NOT NULL,
 PRIMARY KEY (`id`), INDEX `AgentOsTask_status_leaseUntil_idx` (`status`,`leaseUntil`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE TABLE `AgentOsApproval` (
 `id` VARCHAR(191) NOT NULL, `taskId` VARCHAR(191) NOT NULL, `action` VARCHAR(191) NOT NULL,
 `decision` VARCHAR(191) NOT NULL, `decidedBy` VARCHAR(191) NULL, `expiresAt` DATETIME(3) NOT NULL,
 `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), PRIMARY KEY (`id`),
 INDEX `AgentOsApproval_taskId_idx` (`taskId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE TABLE `AgentOsAudit` (
 `sequence` INTEGER NOT NULL, `event` LONGTEXT NOT NULL, `previousHash` VARCHAR(191) NOT NULL,
 `hash` VARCHAR(191) NOT NULL, `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
 PRIMARY KEY (`sequence`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

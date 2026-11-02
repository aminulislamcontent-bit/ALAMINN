-- Additive feature-kit and previously db-pushed module alignment.

-- Review against a production backup before applying; never baseline an existing DB blindly.

CREATE TABLE `KnowledgeChunk` (
  `id` VARCHAR(191) NOT NULL,
  `documentId` VARCHAR(191) NOT NULL,
  `content` LONGTEXT NOT NULL,
  `embedding` JSON NULL,
  `chunkIndex` INTEGER NOT NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'indexed',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `KnowledgeChunk_documentId_idx`(`documentId`),
  INDEX `KnowledgeChunk_chunkIndex_idx`(`chunkIndex`),
  INDEX `KnowledgeChunk_status_idx`(`status`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `SocialAccount` (
  `id` VARCHAR(191) NOT NULL,
  `platform` VARCHAR(191) NOT NULL,
  `externalId` VARCHAR(191) NOT NULL,
  `displayName` VARCHAR(500) NOT NULL,
  `username` VARCHAR(500) NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'disconnected',
  `capabilities` LONGTEXT NULL,
  `tokenEncrypted` VARCHAR(500) NULL,
  `tokenExpiresAt` DATETIME(3) NULL,
  `webhookVerified` BOOLEAN NOT NULL DEFAULT FALSE,
  `automationEnabled` BOOLEAN NOT NULL DEFAULT FALSE,
  `responseMode` VARCHAR(500) NOT NULL DEFAULT 'approval',
  `aiProfileId` VARCHAR(191) NULL,
  `assignedUserId` VARCHAR(191) NULL,
  `lastHealthAt` DATETIME(3) NULL,
  `healthError` VARCHAR(500) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `SocialAccount_platform_externalId_key`(`platform`,`externalId`),
  INDEX `SocialAccount_platform_idx`(`platform`),
  INDEX `SocialAccount_status_idx`(`status`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `SocialAutomationState` (
  `id` VARCHAR(191) NOT NULL DEFAULT 'global',
  `engagementEnabled` BOOLEAN NOT NULL DEFAULT FALSE,
  `publishingEnabled` BOOLEAN NOT NULL DEFAULT FALSE,
  `generationEnabled` BOOLEAN NOT NULL DEFAULT TRUE,
  `version` INTEGER NOT NULL DEFAULT 1,
  `changedById` VARCHAR(191) NULL,
  `changedByName` VARCHAR(500) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `AiPersonalityProfile` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(500) NOT NULL,
  `isDefault` BOOLEAN NOT NULL DEFAULT FALSE,
  `identity` VARCHAR(500) NULL,
  `brandContext` VARCHAR(500) NULL,
  `languages` VARCHAR(500) NOT NULL DEFAULT 'en,bn',
  `formality` INTEGER NOT NULL DEFAULT 3,
  `friendliness` INTEGER NOT NULL DEFAULT 4,
  `greeting` VARCHAR(500) NULL,
  `signOff` VARCHAR(500) NULL,
  `sentenceStyle` VARCHAR(500) NULL,
  `preferredPhrases` VARCHAR(500) NULL,
  `avoidPhrases` VARCHAR(500) NULL,
  `servicePrinciples` VARCHAR(500) NULL,
  `faqs` VARCHAR(500) NULL,
  `businessHours` VARCHAR(500) NULL,
  `escalationContact` VARCHAR(500) NULL,
  `platformStyles` VARCHAR(500) NULL,
  `neverAnswerTopics` VARCHAR(500) NULL,
  `examplePairs` VARCHAR(500) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `AiPersonalityProfile_isDefault_idx`(`isDefault`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `SocialKnowledgeSource` (
  `id` VARCHAR(191) NOT NULL,
  `title` VARCHAR(500) NOT NULL,
  `category` VARCHAR(191) NOT NULL DEFAULT 'faq',
  `content` LONGTEXT NOT NULL,
  `approved` BOOLEAN NOT NULL DEFAULT FALSE,
  `profileId` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `SocialKnowledgeSource_category_idx`(`category`),
  INDEX `SocialKnowledgeSource_approved_idx`(`approved`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `SocialConversation` (
  `id` VARCHAR(191) NOT NULL,
  `accountId` VARCHAR(191) NOT NULL,
  `platform` VARCHAR(191) NOT NULL,
  `externalThreadId` VARCHAR(191) NOT NULL,
  `participantId` VARCHAR(191) NOT NULL,
  `participantName` VARCHAR(500) NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'unread',
  `priority` VARCHAR(191) NOT NULL DEFAULT 'normal',
  `assignedUserId` VARCHAR(191) NULL,
  `labels` LONGTEXT NULL,
  `language` VARCHAR(191) NULL,
  `contactId` VARCHAR(191) NULL,
  `unreadCount` INTEGER NOT NULL DEFAULT 0,
  `lastMessageAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `SocialConversation_accountId_externalThreadId_key`(`accountId`,`externalThreadId`),
  INDEX `SocialConversation_platform_idx`(`platform`),
  INDEX `SocialConversation_status_idx`(`status`),
  INDEX `SocialConversation_lastMessageAt_idx`(`lastMessageAt`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `SocialMessage` (
  `id` VARCHAR(191) NOT NULL,
  `conversationId` VARCHAR(191) NOT NULL,
  `providerMessageId` VARCHAR(191) NULL,
  `direction` VARCHAR(191) NOT NULL,
  `kind` VARCHAR(191) NOT NULL DEFAULT 'message',
  `senderId` VARCHAR(191) NULL,
  `senderName` VARCHAR(500) NULL,
  `body` LONGTEXT NOT NULL,
  `mediaUrl` VARCHAR(500) NULL,
  `isOwn` BOOLEAN NOT NULL DEFAULT FALSE,
  `deliveryStatus` VARCHAR(191) NOT NULL DEFAULT 'received',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `SocialMessage_providerMessageId_key`(`providerMessageId`),
  INDEX `SocialMessage_conversationId_createdAt_idx`(`conversationId`,`createdAt`),
  INDEX `SocialMessage_deliveryStatus_idx`(`deliveryStatus`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `SocialWebhookEvent` (
  `id` VARCHAR(191) NOT NULL,
  `provider` VARCHAR(191) NOT NULL,
  `providerEventId` VARCHAR(191) NOT NULL,
  `accountId` VARCHAR(191) NULL,
  `payloadHash` VARCHAR(500) NOT NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'received',
  `attempts` INTEGER NOT NULL DEFAULT 0,
  `error` LONGTEXT NULL,
  `processedAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `SocialWebhookEvent_provider_providerEventId_key`(`provider`,`providerEventId`),
  INDEX `SocialWebhookEvent_status_idx`(`status`),
  INDEX `SocialWebhookEvent_createdAt_idx`(`createdAt`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `SocialReplyDecision` (
  `id` VARCHAR(191) NOT NULL,
  `conversationId` VARCHAR(191) NOT NULL,
  `messageId` VARCHAR(191) NULL,
  `category` VARCHAR(191) NOT NULL,
  `language` VARCHAR(191) NULL,
  `confidence` DOUBLE NOT NULL DEFAULT 0,
  `risk` VARCHAR(191) NOT NULL DEFAULT 'high',
  `draft` LONGTEXT NULL,
  `finalText` LONGTEXT NULL,
  `decision` VARCHAR(191) NOT NULL DEFAULT 'held',
  `reason` VARCHAR(500) NULL,
  `modelUsed` VARCHAR(500) NULL,
  `knowledgeRefs` LONGTEXT NULL,
  `automationVersion` INTEGER NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `SocialReplyDecision_conversationId_idx`(`conversationId`),
  INDEX `SocialReplyDecision_decision_idx`(`decision`),
  INDEX `SocialReplyDecision_createdAt_idx`(`createdAt`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `SocialApproval` (
  `id` VARCHAR(191) NOT NULL,
  `decisionId` VARCHAR(191) NOT NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
  `editedText` LONGTEXT NULL,
  `decidedById` VARCHAR(191) NULL,
  `decidedAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `SocialApproval_decisionId_key`(`decisionId`),
  INDEX `SocialApproval_status_idx`(`status`),
  INDEX `SocialApproval_createdAt_idx`(`createdAt`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `SocialAutomationRule` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(500) NOT NULL,
  `accountId` VARCHAR(191) NULL,
  `platform` VARCHAR(191) NULL,
  `category` VARCHAR(191) NULL,
  `action` VARCHAR(191) NOT NULL DEFAULT 'approval',
  `minConfidence` DOUBLE NOT NULL DEFAULT 0.85,
  `enabled` BOOLEAN NOT NULL DEFAULT TRUE,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `SocialAutomationRule_accountId_idx`(`accountId`),
  INDEX `SocialAutomationRule_enabled_idx`(`enabled`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `SocialCampaign` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(500) NOT NULL,
  `objective` VARCHAR(500) NULL,
  `pillar` VARCHAR(500) NULL,
  `audience` VARCHAR(500) NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'draft',
  `startsAt` DATETIME(3) NULL,
  `endsAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  `budget` INTEGER NOT NULL DEFAULT 0,
  `currency` VARCHAR(191) NOT NULL DEFAULT 'USD',
  `channels` LONGTEXT NOT NULL,
  `brief` VARCHAR(500) NULL,
  `utmCampaign` VARCHAR(500) NULL,
  PRIMARY KEY (`id`),
  INDEX `SocialCampaign_status_idx`(`status`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `SocialContent` (
  `id` VARCHAR(191) NOT NULL,
  `campaignId` VARCHAR(191) NULL,
  `title` VARCHAR(500) NOT NULL,
  `body` LONGTEXT NOT NULL,
  `variants` LONGTEXT NULL,
  `hashtags` LONGTEXT NULL,
  `cta` VARCHAR(500) NULL,
  `mediaUrls` LONGTEXT NULL,
  `language` VARCHAR(191) NOT NULL DEFAULT 'en',
  `status` VARCHAR(191) NOT NULL DEFAULT 'draft',
  `scheduledAt` DATETIME(3) NULL,
  `approvedById` VARCHAR(191) NULL,
  `createdById` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `SocialContent_status_idx`(`status`),
  INDEX `SocialContent_scheduledAt_idx`(`scheduledAt`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `SocialContentTarget` (
  `id` VARCHAR(191) NOT NULL,
  `contentId` VARCHAR(191) NOT NULL,
  `accountId` VARCHAR(191) NOT NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
  `providerPostId` VARCHAR(191) NULL,
  `error` LONGTEXT NULL,
  `attempts` INTEGER NOT NULL DEFAULT 0,
  `publishedAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `SocialContentTarget_contentId_accountId_key`(`contentId`,`accountId`),
  INDEX `SocialContentTarget_status_idx`(`status`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `HigherStudyFaculty` (
  `id` VARCHAR(191) NOT NULL,
  `universityId` VARCHAR(191) NOT NULL,
  `name` VARCHAR(500) NOT NULL,
  `type` VARCHAR(191) NOT NULL DEFAULT 'faculty',
  `parentId` VARCHAR(191) NULL,
  `officialUrl` VARCHAR(500) NULL,
  `sourceUrl` VARCHAR(500) NULL,
  `lastVerifiedAt` DATETIME(3) NULL,
  `verificationStatus` VARCHAR(191) NOT NULL DEFAULT 'pending-review',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `HigherStudyFaculty_universityId_idx`(`universityId`),
  INDEX `HigherStudyFaculty_type_idx`(`type`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `HigherStudyCourseIntake` (
  `id` VARCHAR(191) NOT NULL,
  `courseId` VARCHAR(191) NOT NULL,
  `intakeName` VARCHAR(500) NOT NULL,
  `academicYear` VARCHAR(500) NULL,
  `opensAt` DATETIME(3) NULL,
  `deadline` DATETIME(3) NULL,
  `intlDeadline` DATETIME(3) NULL,
  `scholarshipDeadline` DATETIME(3) NULL,
  `startsAt` DATETIME(3) NULL,
  `rolling` BOOLEAN NOT NULL DEFAULT FALSE,
  `intlConfirmed` BOOLEAN NOT NULL DEFAULT FALSE,
  `sourceUrl` VARCHAR(500) NULL,
  `lastVerifiedAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `HigherStudyCourseIntake_courseId_idx`(`courseId`),
  INDEX `HigherStudyCourseIntake_deadline_idx`(`deadline`),
  INDEX `HigherStudyCourseIntake_startsAt_idx`(`startsAt`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `HigherStudySourceRecord` (
  `id` VARCHAR(191) NOT NULL,
  `url` VARCHAR(191) NOT NULL,
  `owner` VARCHAR(500) NULL,
  `sourceType` VARCHAR(191) NOT NULL DEFAULT 'university-course',
  `entityType` VARCHAR(191) NULL,
  `entityId` VARCHAR(191) NULL,
  `countrySlug` VARCHAR(500) NULL,
  `title` VARCHAR(500) NULL,
  `licenseNote` VARCHAR(500) NULL,
  `active` BOOLEAN NOT NULL DEFAULT TRUE,
  `lastCheckedAt` DATETIME(3) NULL,
  `lastStatus` VARCHAR(191) NULL,
  `failCount` INTEGER NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `HigherStudySourceRecord_url_key`(`url`),
  INDEX `HigherStudySourceRecord_entityType_entityId_idx`(`entityType`,`entityId`),
  INDEX `HigherStudySourceRecord_active_idx`(`active`),
  INDEX `HigherStudySourceRecord_sourceType_idx`(`sourceType`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `HigherStudySourceSnapshot` (
  `id` VARCHAR(191) NOT NULL,
  `sourceId` VARCHAR(191) NOT NULL,
  `contentHash` VARCHAR(191) NOT NULL,
  `title` VARCHAR(500) NULL,
  `signals` LONGTEXT NULL,
  `fetchedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `httpStatus` INTEGER NULL,
  PRIMARY KEY (`id`),
  INDEX `HigherStudySourceSnapshot_sourceId_fetchedAt_idx`(`sourceId`,`fetchedAt`),
  INDEX `HigherStudySourceSnapshot_contentHash_idx`(`contentHash`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `HigherStudyDataChange` (
  `id` VARCHAR(191) NOT NULL,
  `runId` VARCHAR(191) NULL,
  `sourceId` VARCHAR(191) NULL,
  `entityType` VARCHAR(191) NOT NULL,
  `entityId` VARCHAR(191) NULL,
  `entityLabel` VARCHAR(500) NULL,
  `field` VARCHAR(191) NULL,
  `changeType` VARCHAR(191) NOT NULL,
  `impact` VARCHAR(191) NOT NULL DEFAULT 'MEDIUM',
  `oldValue` LONGTEXT NULL,
  `newValue` LONGTEXT NULL,
  `sourceUrl` VARCHAR(500) NULL,
  `confidence` DOUBLE NOT NULL DEFAULT 0,
  `aiSummary` LONGTEXT NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
  `decidedById` VARCHAR(191) NULL,
  `decidedAt` DATETIME(3) NULL,
  `detectedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `HigherStudyDataChange_status_idx`(`status`),
  INDEX `HigherStudyDataChange_changeType_idx`(`changeType`),
  INDEX `HigherStudyDataChange_entityType_entityId_idx`(`entityType`,`entityId`),
  INDEX `HigherStudyDataChange_detectedAt_idx`(`detectedAt`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `HigherStudyMonitoringRun` (
  `id` VARCHAR(191) NOT NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'running',
  `sourcesChecked` INTEGER NOT NULL DEFAULT 0,
  `sourcesFailed` INTEGER NOT NULL DEFAULT 0,
  `changesDetected` INTEGER NOT NULL DEFAULT 0,
  `error` LONGTEXT NULL,
  `startedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `completedAt` DATETIME(3) NULL,
  `nextRunAt` DATETIME(3) NULL,
  PRIMARY KEY (`id`),
  INDEX `HigherStudyMonitoringRun_status_idx`(`status`),
  INDEX `HigherStudyMonitoringRun_startedAt_idx`(`startedAt`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `HigherStudyOfficialDocument` (
  `id` VARCHAR(191) NOT NULL,
  `title` VARCHAR(500) NOT NULL,
  `sourceUrl` VARCHAR(500) NOT NULL,
  `universityId` VARCHAR(191) NULL,
  `countrySlug` VARCHAR(500) NULL,
  `category` VARCHAR(191) NOT NULL DEFAULT 'guide',
  `fileHash` VARCHAR(191) NULL,
  `version` INTEGER NOT NULL DEFAULT 1,
  `approvalStatus` VARCHAR(191) NOT NULL DEFAULT 'pending',
  `publishedAt` DATETIME(3) NULL,
  `discoveredAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `lastCheckedAt` DATETIME(3) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `HigherStudyOfficialDocument_sourceUrl_version_key`(`sourceUrl`,`version`),
  INDEX `HigherStudyOfficialDocument_countrySlug_idx`(`countrySlug`),
  INDEX `HigherStudyOfficialDocument_approvalStatus_idx`(`approvalStatus`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `KitDocument` (
  `id` VARCHAR(191) NOT NULL,
  `kind` VARCHAR(191) NOT NULL,
  `title` VARCHAR(500) NOT NULL,
  `content` LONGTEXT NOT NULL,
  `metadata` LONGTEXT NULL,
  `createdById` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `KitDocument_kind_updatedAt_idx`(`kind`,`updatedAt`),
  INDEX `KitDocument_createdById_idx`(`createdById`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `SeoAudit` (
  `id` VARCHAR(191) NOT NULL,
  `url` VARCHAR(191) NOT NULL,
  `score` INTEGER NOT NULL,
  `checks` LONGTEXT NOT NULL,
  `summary` LONGTEXT NOT NULL,
  `createdById` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `SeoAudit_createdAt_idx`(`createdAt`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `EmailCampaign` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(500) NOT NULL,
  `subject` VARCHAR(500) NOT NULL,
  `preheader` VARCHAR(500) NULL,
  `bodyHtml` LONGTEXT NOT NULL,
  `bodyText` LONGTEXT NOT NULL,
  `content` LONGTEXT NOT NULL,
  `audience` VARCHAR(500) NOT NULL DEFAULT 'all',
  `status` VARCHAR(191) NOT NULL DEFAULT 'draft',
  `scheduledAt` DATETIME(3) NULL,
  `sentAt` DATETIME(3) NULL,
  `createdById` VARCHAR(191) NULL,
  `campaignId` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `EmailCampaign_status_scheduledAt_idx`(`status`,`scheduledAt`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `EmailDelivery` (
  `id` VARCHAR(191) NOT NULL,
  `campaignId` VARCHAR(191) NOT NULL,
  `subscriberId` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
  `providerId` VARCHAR(191) NULL,
  `error` LONGTEXT NULL,
  `attempts` INTEGER NOT NULL DEFAULT 0,
  `sentAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `EmailDelivery_campaignId_subscriberId_key`(`campaignId`,`subscriberId`),
  INDEX `EmailDelivery_status_updatedAt_idx`(`status`,`updatedAt`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `SupportConversation` (
  `id` VARCHAR(191) NOT NULL,
  `visitorName` VARCHAR(500) NOT NULL,
  `visitorEmail` VARCHAR(500) NULL,
  `tokenHash` VARCHAR(191) NOT NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'open',
  `assignedTo` VARCHAR(500) NULL,
  `lastMessageAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `SupportConversation_tokenHash_key`(`tokenHash`),
  INDEX `SupportConversation_status_lastMessageAt_idx`(`status`,`lastMessageAt`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `SupportMessage` (
  `id` VARCHAR(191) NOT NULL,
  `conversationId` VARCHAR(191) NOT NULL,
  `sender` VARCHAR(191) NOT NULL,
  `senderName` VARCHAR(500) NOT NULL,
  `body` LONGTEXT NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `SupportMessage_conversationId_createdAt_idx`(`conversationId`,`createdAt`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `User` ADD COLUMN `passwordResetToken` VARCHAR(500) NULL;

ALTER TABLE `User` ADD COLUMN `passwordResetExpiresAt` DATETIME(3) NULL;

ALTER TABLE `User` ADD INDEX `User_passwordResetToken_idx`(`passwordResetToken`);

ALTER TABLE `SocialConversation` ADD CONSTRAINT `fk_SocialConversation_accountId` FOREIGN KEY (`accountId`) REFERENCES `SocialAccount`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `SocialMessage` ADD CONSTRAINT `fk_SocialMessage_conversationId` FOREIGN KEY (`conversationId`) REFERENCES `SocialConversation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `SocialContent` ADD CONSTRAINT `fk_SocialContent_campaignId` FOREIGN KEY (`campaignId`) REFERENCES `SocialCampaign`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `SocialContentTarget` ADD CONSTRAINT `fk_SocialContentTarget_contentId` FOREIGN KEY (`contentId`) REFERENCES `SocialContent`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `SocialContentTarget` ADD CONSTRAINT `fk_SocialContentTarget_accountId` FOREIGN KEY (`accountId`) REFERENCES `SocialAccount`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `EmailCampaign` ADD CONSTRAINT `fk_EmailCampaign_campaignId` FOREIGN KEY (`campaignId`) REFERENCES `SocialCampaign`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `EmailDelivery` ADD CONSTRAINT `fk_EmailDelivery_campaignId` FOREIGN KEY (`campaignId`) REFERENCES `EmailCampaign`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `SupportMessage` ADD CONSTRAINT `fk_SupportMessage_conversationId` FOREIGN KEY (`conversationId`) REFERENCES `SupportConversation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

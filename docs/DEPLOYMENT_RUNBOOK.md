# Deployment Runbook — Approval-Gated Operations

> Phase 1 proposal. **No deployment, migration, restore, secret rotation or infrastructure destruction was performed in Phase 0.** Existing scripts/workflows are evidence, not authorization.

## 1. Preconditions

- Exact commit SHA with green CI (typecheck/lint/tests/security/build).
- Human approval bound to commit, environment, action and input hash.
- Production provider/capacity/process manager verified.
- Verified backup + restore test + disposable migration comparison if schema changes.
- Rollback plan and on-call owner named.
- Dependency advisories triaged; license register updated for new components.

## 2. Existing deployment evidence and contradictions

- `.github/workflows/deploy.yml`: manual dispatch, CI-status guard, production environment, SSH/git-worktree, npm ci/build, symlink switch, PM2 reload, health check and rollback.
- `.github/workflows/versioned-release.yml`: tag/push and rollback via symlink + `pm2 reload alaminn-info`; tag step comment says approval gate but no explicit environment on tagging job.
- `deploy/` scripts use PM2; `deploy/install.sh` mentions Bun/Nginx/MariaDB/systemd; docs also describe Caddy/systemd/PostgreSQL/Redis.
- Dockerfile uses node:22-alpine, ephemeral build DB, standalone non-root uid1001; compose MySQL/nginx commented out.

**Do not run these blindly.** Phase 2 must reconcile the actual host and choose one path.

## 3. Standard release procedure (proposed)

1. Confirm approval ticket and commit SHA.
2. Announce change window; freeze unrelated writes if required.
3. Verify backup age/integrity; run restore test if stale.
4. If migration: execute disposable-copy comparison and obtain separate migration approval.
5. Deploy to staging; run smoke/E2E/security checks.
6. Production: create versioned release/worktree or image; install locked deps; build.
7. Switch traffic atomically (symlink/router/image tag); reload the verified process manager.
8. Health checks: `/api/health`, auth boundary, critical routes, DB connectivity, queue/worker heartbeat, audit write.
9. Monitor error rate/latency/queue/audit for agreed burn-in.
10. Record release evidence: SHA, artifact hashes, migration IDs, approver, timestamps, health results.

## 4. Rollback

- Trigger: failed health check, error/latency spike, audit failure, data integrity issue.
- Switch back to previous known-good release/image; reload service.
- **Database rollback is not automatic.** Restore only with approval, verified backup and write-freeze; prefer forward-fix for additive migrations.
- Re-run smoke tests; record incident and audit events.

## 5. Database migration procedure

1. Inspect schema/data metadata (no secret values).
2. Verified backup; restore to disposable host.
3. Apply migration to disposable copy; compare row counts/constraints/checksums.
4. Human approval with comparison evidence.
5. Controlled production execution during window.
6. Post-checks and application smoke; retain migration log.

Never run `prisma migrate reset`, delete volumes, or overwrite production data without explicit approval.

## 6. Secret rotation

Approval → issue new secret → dual-read/write window if supported → update broker/config → verify → revoke old → audit. Never paste secrets into chat/logs; never mount production secrets into untrusted workers.

## 7. Emergency kill switch

Super Admin can pause queues, revoke capability tokens, disable workers and block egress. Killing a worker must not delete durable tasks; leases expire and tasks requeue or await review.

## 8. Acceptance criteria

- [ ] Approval bound to exact action/commit/environment.
- [ ] Backup/restore evidence current.
- [ ] Staging and production smoke checks pass.
- [ ] Audit chain intact; no privileged action unlogged.
- [ ] Rollback rehearsed; DB restore requires separate approval.

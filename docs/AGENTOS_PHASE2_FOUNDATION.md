# AgentOS Phase 2 foundation — experimental / incomplete

This bounded slice is isolated from existing application APIs, AI tasks and production. It is **not production-ready** and Phase 2 has not met its exit criteria. SQLite and MySQL schemas add three tables; neither migration has been applied to an existing database. The SQLite migration was exercised only on fresh temporary databases. MySQL migration is unexecuted and needs provider-specific testing. Applying either to any existing environment requires the migration safety procedure and separate approval.

## What exists

`src/lib/agentos/foundation.ts` implements a narrow fixed-contract queue using SQLite/libSQL write transactions. It atomically records task creation, claims, and completion with a keyed HMAC audit chain; an invalid key or modified recorded event rolls back the operation. A lease token fences late completions, expired leases can be reclaimed up to a bounded attempt count, and a deadline is enforced. The only agent returns a fixed status object, with no network, shell, file or model access. The one-shot worker `scripts/agentos-worker.ts` requires an explicit absolute local SQLite URL and audit key, and never falls back to the application DB. It is not integrated into the application or started automatically.

## Important limitations and gates

- There is no authenticated enqueue API, admin UI, approval workflow, worker supervisor, expiry/dead-letter reconciliation, or independent audit checkpoint. Approval table is a **schema placeholder**, not an approval control. Privileged actions are unsupported and must remain unavailable, even if an approval row exists.
- Chain verification catches changed or reordered retained entries, but cannot detect deletion of a valid suffix or a reset without a separately protected external checkpoint. HMAC is not a public-key signature; key custody, rotation and independent verification are not implemented. Store audit keys separately from the DB and never expose them to agents.
- The caller is responsible for identity, authorization, isolation, resource limits and throttling; these functions are not an authorization boundary. No untrusted code runs here. No OS/container sandbox, network egress enforcement, artifact scanning, replay-resistant approval, or multi-project isolation is implemented. The hard-coded agent is not evidence of a general-purpose sandbox.
- A crashed task may remain queued/running after expiry or attempts exhaustion; these are not silently retried beyond limits and require a future audited reconciliation mechanism. Concurrent worker behavior and recovery under process failure require more testing. No MySQL runtime or production load testing has been performed.
- Task inputs are deliberately empty; no secrets or arbitrary paths are accepted. Never use this experimental worker against an existing DB until separately reviewed and approved.

## Offline discovery and dependency triage

`node scripts/agentos-discovery.mjs` reports local runtime and schema presence only, without opening any DB, inspecting environment values, or connecting to production. Production provider, data, backups, restore, capacity, networking and topology remain unverified. A separately authorized operator should inventory environment/provider and schema metadata, verify encrypted backups and a restore, then test a migration on a disposable copy with row/constraint comparisons before any controlled change. See [deployment runbook](DEPLOYMENT_RUNBOOK.md).

The Phase 0 advisory snapshot (2026-11-02) counted 45 full / 35 production affected packages, including Next, Nodemailer, Zod, Prisma and Sharp. Counts are advisory entries, not proven exploits. No dependencies were upgraded. Before changes: refresh the advisory and lockfile evidence, prioritize reachable critical/high issues, map transitive paths and fixes, review compatibility/license changes, test each candidate in isolation and run security, regression, build and rollback checks. Prisma major-version and native-image updates need dedicated compatibility review. Upgrade and deployment are separately gated.

## Rollback planning (not executed)

Before any authorized rollout, verify a restorable backup and test it on an isolated copy. Disable producers and stop workers, preserve/export task and audit records and independently checkpoint the audit chain. Restore the verified backup if needed, following the approved recovery procedure; avoid dropping tables or overwriting live data without explicit approval. Assess impact to writes made since backup and rehearse recovery before production. No rollback or restore has been tested here.

See [security architecture](SECURITY_ARCHITECTURE.md), [agent system](AGENT_SYSTEM.md) and [implementation roadmap](IMPLEMENTATION_ROADMAP.md). Their target architecture is not a claim that those capabilities exist.

**Deployment caution:** these migration files are in the normal migration directories. Existing deployment commands that automatically apply pending migrations must not be run against an existing database until the required review, backup/restore rehearsal and separate approval are complete. Schema validation is not migration execution or proof of MySQL compatibility.

## Verification in this workspace

SQLite and MySQL Prisma schemas validated (the MySQL validation used a dummy URL and made no connection). Six focused tests exercised a fresh temporary SQLite database, including rejected privileges, invalid contracts, lease recovery and stale-token fencing, concurrent claim contention and audit-tamper rollback. The full suite passed 352 tests before the additional contention test was added; typecheck and targeted runtime/worker lint passed after it. This is not a crash-recovery, multiple-host, MySQL, sandbox, or production test. Compared with the Phase 0 baseline, only the two Prisma schema files changed; none of the 889 baseline files are missing. The build was not rerun for this slice.

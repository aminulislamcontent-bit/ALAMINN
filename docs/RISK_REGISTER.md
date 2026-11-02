# AgentOS Risk Register

> Phase 0/1. Ratings are qualitative (H/M/L) before production discovery. Owners are proposed roles, not assigned individuals.

| ID | Risk | L | I | Mitigation | Owner | Gate |
|---|---|---|---|---|---|---|
| R01 | Critical/high dependency advisories (Next.js 16.1.3 etc.) | H | H | Triage reachability; patch under change control; compensating controls; rescan | Security/DevOps | Before workers get prod creds |
| R02 | Production DB/provider/topology unknown | H | H | Read-only discovery; document per environment; no migration until verified | DevOps/DB | Phase 2 entry |
| R03 | Architecture docs conflict (Postgres/Redis/systemd vs SQLite/PM2) | H | M | Reconcile to actual runtime; single canonical runbook | Architect | Phase 2 |
| R04 | Audit writes fail silently | M | H | Fail-closed privileged audit; hash chain; alerting | Core | Before privileged actions |
| R05 | Approvals not universal | H | H | Policy engine + approval matrix; negative tests | Core/Security | Before factory/RE |
| R06 | Worker duplicate execution / lost tasks | M | H | Atomic lease/fencing; durable queue; idempotency | Core | MVP acceptance |
| R07 | Prompt injection via web/skills/memory | H | H | Data/instruction separation; policy outside model; egress deny; canaries | Security | Before research/factory |
| R08 | Sandbox escape (RE/CAD/Container) | M | H | Disposable VMs; no host mounts; non-root; egress deny; revert | RE/DevOps | Before lab |
| R09 | Secret leakage to agents/logs | M | H | Broker; short-lived tokens; redaction; no .env mounts | Security | Before workers |
| R10 | License violation (Dify/Treg/Remotion/Rescript/VoiceStudio/OpenShorts) | M | H | Legal review; isolate; no vendoring; per-model/asset clearance | Compliance | Before adoption |
| R11 | Unknown/unavailable resources treated as safe | M | M | F classification; exact URL/hash required; no substitution | Architect | Before adoption |
| R12 | Model weights/media rights unclear | M | H | Separate weight/asset register; consent; provenance | Creative/Compliance | Before render |
| R13 | Unofficial WhatsApp automation | M | H | Official Meta Cloud API only; templates/consent | Messaging | Always |
| R14 | Unauthorized RE / DRM bypass | L | H | Authorization record; scope policy; excluded tools | RE/Security | Always |
| R15 | Resource exhaustion on modest hardware | H | M | Queues; caps; budgets; separate GPU/RE hosts | DevOps | Before concurrency |
| R16 | False local-inference claims | M | M | Configure/license/benchmark model; label fallback | AI | Before marketing |
| R17 | Backup/restore unverified | H | H | Encrypted offsite; restore tests; migration comparison | DevOps/DB | Before production |
| R18 | Cross-project memory leakage | M | H | Project ACL; retrieval filters; negative tests | Memory | Before shared memory |
| R19 | Auto-updating skills/plugins | M | H | Pin hashes; disable auto-update; review diffs | Factory | Before skills |
| R20 | External SaaS data exposure/cost | M | M | Vendor review; DPA; scoped keys; budgets; optional only | Compliance | Before integration |
| R21 | Generated code disables tests/security | M | H | Independent QA; mutation checks; human PR | QA | Before merge |
| R22 | Deployment/rollback mismatch | M | H | Reconcile PM2/systemd; rehearse; DB restore separate | DevOps | Before release |
| R23 | Audit/replay tampering | M | H | Signed chain; external checkpoints; WORM | Security | Before governance |
| R24 | Scope creep: installing 79 projects | H | M | Shortlist; A/B only after gates; C optional; D study | Architect | Always |
| R25 | Browser/visual QA unavailable | M | M | Restore Playwright/Chromium; explicit gap until then | QA | Before UI release |

## Top five immediate actions

1. Read-only production discovery (provider, capacity, process manager, backups).
2. Dependency advisory triage and approved remediation plan.
3. Additive task/lease/approval/audit schema design with rollback.
4. One low-risk read-only agent + durable worker MVP.
5. Resource shortlist/legal decisions; no installs until approved.

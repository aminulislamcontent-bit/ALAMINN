# Implementation Roadmap — Phases 2–7

> Phase 0 audit and Phase 1 architecture are documentation deliverables. **Implementation has not started.** Each phase requires explicit human approval; production deployment requires separate approval.

## Phase summary

| Phase | Scope | Key deliverables | Exit gate |
|---|---|---|---|
| 0 | Discovery/audit (this work) | 14 reports; 79-entry assessment; evidence manifest; preservation check | Human review of findings |
| 1 | Architecture proposal (this work) | 8 layers, 20 agents, task contract, DB/permission/integration/deployment designs, milestones/estimates | Explicit approval to implement a slice |
| 2 | Foundation & safety | Production discovery; dependency remediation; additive task/lease/approval/audit schema; one durable worker; one read-only agent | Negative security tests; backup/restore evidence; no data loss |
| 3 | Orchestrator & memory | 20-role registry; DAG scheduler; budgets; provenance memory; project isolation; skill registry | Crash/retry/idempotency; injection/isolation tests |
| 4 | Software factory & QA | OpenCode/internal adapter; branch/PR flow; independent QA; security/license gates; optional CodeRabbit/TestSprite | Human-approved PRs; reproducible QA; no autonomous merge |
| 5 | Authorized RE lab | Disposable VM; Ghidra/REA/Android adapters; authorization records; artifact quarantine | Sandbox/egress/revert tests; no production access |
| 6 | Optional creative studio | Presenton/HyperFrames/MoneyPrinter/Voicebox/Text-to-CAD adapters after license clearance; publication approval | License/provenance checks; resource caps; no auto-publish |
| 7 | Governance & production hardening | Super Admin policy/audit replay/kill switch; monitoring; backup/restore drills; controlled rollout | Separate production approval; rollback rehearsed |

## Resource estimates (planning ranges, not commitments)

| Item | Minimum viable | Recommended | Notes |
|---|---|---|---|
| Core app/DB | 2–4 CPU / 4–8GB / 50GB SSD | 4–8 CPU / 16GB / 100GB SSD | Verify Hostinger capacity first |
| Workers | 1–2 queued | 2–4 + separate heavy host | Modest hardware via caps/routing |
| RE lab | Separate VM 4 CPU/16GB/100GB | Dedicated host + KVM | Not audit host |
| Creative/GPU | Optional cloud APIs | Separate GPU host per model | Voicebox/OpenShorts/CogVideo not on 4GB host |
| Local LLM | Not required | Separate inference host after benchmark | No claim until tested |
| Backups | Encrypted offsite | Immutable + office replica | Restore tests mandatory |
| External SaaS | None mandatory | Optional QA/analytics/model gateways | Budget/DPA approval |

## Milestones and acceptance

- **M2.1** Production discovery report: provider/version/capacity/process manager/backups documented without secrets.
- **M2.2** Dependency remediation: critical/high reachable paths fixed or approved compensating controls; rescan evidence.
- **M2.3** Durable task MVP: atomic lease, restart recovery, idempotency, audit fail-closed.
- **M3.1** Memory MVP: provenance fields, project ACL, injection negative tests, retention.
- **M4.1** Factory MVP: scoped branch/PR, independent QA, human merge; no main push.
- **M5.1** RE lab: authorization gate, disposable VM, artifact scan, revert proof.
- **M6.1** Creative adapters: per-tool license/weight clearance, resource caps, publication approval.
- **M7.1** Production hardening: monitoring, backup/restore drill, rollback rehearsal, separate deploy approval.

## Standing constraints

- Preserve source/DBs/configs/user data; no unapproved delete/overwrite/reset/migrate.
- Never push directly to main; never merge/deploy production without explicit human approval.
- Default read-only; least privilege; sandbox untrusted code; no production credentials to agents.
- Official WhatsApp Meta API only; no DRM/license/auth bypass.
- Structured task contracts and auditable approvals for privileged actions.
- Accurate status labels; no fabricated metrics or local-inference claims.

## Approval checklist for Phase 2 entry

- [ ] Review Phase 0/1 reports and F/E resource decisions.
- [ ] Approve production discovery scope (read-only).
- [ ] Approve dependency remediation change window.
- [ ] Approve additive schema design and rollback plan.
- [ ] Approve one low-risk worker/agent slice and sandbox boundary.
- [ ] Confirm backup/restore and offsite requirements.

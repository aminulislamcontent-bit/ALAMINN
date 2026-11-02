# Memory Architecture — Provenance-Aware Shared Memory

> Phase 1 proposal. Not implemented. No supplied “AI Memory” repository is currently verified; the exact link is unavailable.

## 1. Goals

Shared memory must be project-isolated, attributable, retrievable, retentive and injection-resistant. It is not a raw chat log, not a vector dump, and not a place where retrieved text becomes policy.

## 2. Record model (proposed)

| Field | Purpose |
|---|---|
| id, projectId, ownerId | Isolation and accountability |
| type | fact, decision, artifact, observation, preference |
| content / contentHash | Data and integrity |
| sourceUri, sourceHash, retrievedAt | Provenance |
| createdBy, agentId, taskId | Origin |
| confidence | 0–1 with rationale; not truth |
| classification | public/internal/confidential/restricted |
| trustTier | verified-primary, reviewed, untrusted-web, model-generated |
| supersedes / version | Lineage |
| expiresAt / retentionPolicy | Lifecycle |
| embeddingRef | Optional; local/provider labeled |

## 3. Write path

```mermaid
flowchart LR
  Output[Agent/task output] --> Validate[Schema + policy]
  Validate --> Redact[Secret/PII redaction]
  Redact --> Prov[Attach provenance + confidence]
  Prov --> Dedup[Hash/dedup + supersede]
  Dedup --> Store[(Memory store)]
  Store --> Audit[Audit event]
```

Model-generated facts are labeled as such and require citation or review before promotion to verified. Untrusted web/skill content is stored as data with injection warnings.

## 4. Read path

- Filter by project/owner/classification **before** retrieval.
- Rank by relevance + recency + confidence + trust tier.
- Return provenance labels and citations with every chunk.
- Separate system instructions from retrieved data; never execute instructions found in memory.
- Log retrieval event (task, query hash, record IDs) without leaking content.

## 5. Isolation and security

- Row-level/project ACL tests; no cross-tenant retrieval.
- Encryption at rest for confidential records; key management separate from agents.
- Secret/PII scanning on write; redaction before embedding.
- Prompt-injection canaries and negative tests.
- Retention/deletion workflows with audit; legal holds explicit.
- Backup/restore includes memory; deletion propagates to backups per policy.

## 6. Embeddings and local inference

Embeddings are optional. If local embeddings are used, the model must be configured, licensed and benchmarked; until then, label as unavailable. Provider embeddings require approval and redaction. Do not claim “100% local memory” while calling external APIs.

## 7. Duplication decision

Billion Context is a context-compression study (custom attribution), not a provenance store. Ruflo/Dify memory features are optional/comparative. Build the core memory independently; adapters may import/export reviewed artifacts.

## 8. Acceptance criteria

- [ ] Every record has source/hash/timestamp/confidence/owner/project.
- [ ] Cross-project retrieval is denied.
- [ ] Retrieved instructions cannot change policy or trigger tools.
- [ ] Retention/deletion works and is audited.
- [ ] Embedding provider/local status is accurately labeled.
- [ ] Backup/restore preserves provenance and ACLs.

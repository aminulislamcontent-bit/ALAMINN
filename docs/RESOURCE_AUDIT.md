# AgentOS Phase 0 — Resource Audit

> Audit date: 2026-11-02. Documentation-only discovery. No catalog repository was installed, cloned for execution, built or run. Classifications are candidates, not implementation approval.

## Scope and method

- Expanded catalog: **52 entries** (`resources.json`): 34 GitHub URLs and 18 websites.
- Prior-only Integration Hub entries: **27 entries** (`prior-resources.json`): 25 GitHub URLs and 2 websites.
- Combined unique catalog: **79 entries**. GitHub: 59 URLs queried, 56 available, 3 unavailable. Websites: 20 entries; 19 fetched successfully, one Meta AI portal returned 403.
- Supporting source checks (not extra catalog entries): `TestSprite/testsprite-cli`, `superdesigndev/treg`, `supabase/supabase`.
- GitHub evidence: repository metadata, latest commit, releases, languages, file tree and capped file reads. Websites: public page text only. No scripts, forms, downloads, logins or payments were executed.
- This is a bounded discovery audit, not a penetration test, full dependency audit, legal opinion or functional certification. Missing evidence is marked F or gated; it is not treated as safe.
- Machine-readable assessments: [resource-assessments.json](audit/agentos-phase0/resource-assessments.json). Evidence index: [evidence-manifest.json](audit/agentos-phase0/evidence-manifest.json).

## Classification rubric

| Class | Meaning | Adoption rule |
|---|---|---|
| A | Direct reuse candidate | Permissive/compatible artifact; still pin, review and approve before use. |
| B | Adapter required | Wrap behind AgentOS task/approval/egress contracts; never expose raw host privileges. |
| C | Optional external service | SaaS/desktop/self-hosted side service; core must work without it unless explicitly approved. |
| D | Study + independent implementation | Learn patterns; do not vendor code/assets without separate rights. |
| E | Reject for this program | Out of scope, unsafe, or incompatible commercial terms under current plan. |
| F | Investigate further | Unavailable, unlicensed, unresolved or material license/security/resource question. |

## Summary

| Class | Expanded | Prior-only | Total |
|---|---:|---:|---:|
| A — Direct reuse candidate | 3 | 1 | 4 |
| B — Adapter required | 15 | 7 | 22 |
| C — Optional external service | 15 | 5 | 20 |
| D — Study + independent implementation | 12 | 9 | 21 |
| E — Reject for this program | 3 | 1 | 4 |
| F — Investigate further / blocked | 4 | 4 | 8 |

**No entry is approved for production installation.** A/B are technical fit classifications only. C remains optional. D does not grant copying rights. E/F are excluded from implementation until resolved.

## Unresolved supplied references (not counted as verified resources)

| Ref | Supplied description | Status | Required resolution |
|---|---|---|---|
| U01 | Exact “SwiftUI Skills” GitHub link | F — truncated/owner unknown | Provide full owner/repo URL or archive. Do not substitute a search result. |
| U02 | Exact “God’s Eye View” GitHub link | F — truncated/owner unknown | `godsviewai.com` is a hosted product, not proof of the intended repository. |
| U03 | Shortened GitHub paths for HyperFrames, Diagram Design, Billion Context, Text-to-CAD | F as supplied; full candidates separately audited | Confirm the intended owner/repo before treating the full candidate as the same resource. |
| U04 | YouTube redirect links for TestSprite, Tripo and “others” | F — redirect targets not preserved | Provide original video URLs; audit content/rights separately. |
| U05 | Shortened promotional/download links (including Buildonaut-style offers) | F — artifact unknown | Provide exact artifact URL, version, hash and license; no payment or execution. |
| U06 | `akitaonrails/ai-me` | F — unavailable | Correct URL/archive. |
| U07 | `anshuxinha/karpath` | F — unavailable | Correct URL/archive. |
| U08 | `engralaminn-collab/Ai-Markting-crm` | F — unavailable | Correct URL/archive; native CRM remains unchanged. |

## Detailed assessments

### Expanded 52-entry catalog

#### rea — REA (B)

- **Source:** https://github.com/morluto/rea
- **Classification:** B — Adapter required
- **GitHub evidence:** `morluto/rea`; availability `available`; observed push `2026-11-02T10:15:31Z`; commit `93b8b82db702`; detected license `MIT`; latest release `rea-agents-6.8.0`; tree truncated: `False`.
- **Purpose:** Authorized reverse-engineering workflow orchestration and analysis skills.
- **Stack / architecture:** TypeScript/agent skills; CLI-oriented RE workflow; bundles third-party tool notices.
- **License / commercial:** MIT detected; bundled GPL/LGPL components retain their own terms.
- **Dependencies / security:** Orchestrates external RE tools; skill text is untrusted input; bundled binaries need provenance and sandboxing.
- **Runtime / infrastructure:** Dedicated disposable RE VM; toolchain-specific CPU/RAM; no production credentials.
- **Interfaces:** Skills/CLI; wrapper needed for structured task contracts.
- **Local feasibility:** Candidate only in isolated lab; not executed.
- **AgentOS compatibility:** Fits RE Lab behind adapter; not AgentOS core.
- **Duplication / maintenance value:** High for authorized APK/binary analysis workflows.
- **Adoption gates:** Pin commit; inventory every bundled tool/license; authorized-target gate; egress deny; scan artifacts.

#### anyps5 — AnyPS5 (E)

- **Source:** https://github.com/boykopovar/AnyPS5
- **Classification:** E — Reject for this program
- **GitHub evidence:** `boykopovar/AnyPS5`; availability `available`; observed push `2026-11-02T10:24:54Z`; commit `e2ca2ddbfa2a`; detected license `GPL-2.0`; latest release `v0.1.4`; tree truncated: `False`.
- **Purpose:** PS5 game/porting experiments for Linux.
- **Stack / architecture:** Native game/porting stack; GPL-2.0-only repository.
- **License / commercial:** GPL-2.0-only detected.
- **Dependencies / security:** Game binaries/assets and platform-specific code are outside the authorized Android/binary RE scope; copyright risk.
- **Runtime / infrastructure:** Specialized Linux graphics stack; not a server component.
- **Interfaces:** No AgentOS API contract identified.
- **Local feasibility:** Not proposed for local execution.
- **AgentOS compatibility:** Out of scope for AgentOS and the stated RE lab.
- **Duplication / maintenance value:** Low; distracts from core platform.
- **Adoption gates:** Reject for this program; do not download or run.

#### ghidra — Ghidra (B)

- **Source:** https://github.com/NationalSecurityAgency/ghidra
- **Classification:** B — Adapter required
- **GitHub evidence:** `NationalSecurityAgency/ghidra`; availability `available`; observed push `2026-11-02T09:44:00Z`; commit `ac245cfdbd03`; detected license `Apache-2.0`; latest release `Ghidra_12.2_build`; tree truncated: `False`.
- **Purpose:** Software reverse-engineering suite (disassembly/decompilation/scripting).
- **Stack / architecture:** Java/Gradle; native decompiler components; headless analyzer.
- **License / commercial:** Apache-2.0 detected; bundled third-party notices apply.
- **Dependencies / security:** Untrusted binaries can exploit parsers; scripts run with user privileges; never analyze on production.
- **Runtime / infrastructure:** Disposable VM; Java toolchain; RAM/CPU sized to target; no GPU required.
- **Interfaces:** CLI/headless, Java/Python scripting, project files.
- **Local feasibility:** Strong lab candidate; not installed or run here.
- **AgentOS compatibility:** Adapter into RE Lab; results become provenance-tagged artifacts.
- **Duplication / maintenance value:** High for owned/authorized binary analysis.
- **Adoption gates:** Pin release; verify signatures; sandbox; no auto-run scripts; authorization record; license inventory.

#### innovation-insight — Innovation Insight (D)

- **Source:** https://www.innovation-insight.com/
- **Classification:** D — Study + independent implementation
- **Web evidence:** availability `fetched`; public page text reviewed; no runtime verified.
- **Purpose:** Custom software agency website and case studies.
- **Stack / architecture:** Public marketing/case-study site; no reusable runtime verified.
- **License / commercial:** Proprietary website content; no software license granted.
- **Dependencies / security:** Marketing claims are not verified benchmarks; do not copy client code/assets.
- **Runtime / infrastructure:** Browser only.
- **Interfaces:** None verified.
- **Local feasibility:** Reference reading only.
- **AgentOS compatibility:** Useful process/delivery patterns, not a component.
- **Duplication / maintenance value:** Medium for delivery/governance ideas.
- **Adoption gates:** Study independently; do not scrape client data or copy branding.

#### billion-context — Billion Context (D)

- **Source:** https://github.com/ranxianglei/billion-context
- **Classification:** D — Study + independent implementation
- **GitHub evidence:** `ranxianglei/billion-context`; availability `available`; observed push `2026-11-02T09:55:53Z`; commit `3a2d051ec897`; detected license `NOASSERTION`; latest release `v0.1.211`; tree truncated: `False`.
- **Purpose:** Context compression/management plugin for coding agents.
- **Stack / architecture:** TypeScript monorepo; plugin/kernel/subagents/server; auto-update policy.
- **License / commercial:** Custom MIT-plus-attribution: homepage/docs/About attribution required.
- **Dependencies / security:** Compression claims unverified; auto-update and subagent execution expand supply-chain risk.
- **Runtime / infrastructure:** Node/TS toolchain; agent host required.
- **Interfaces:** Plugin/skills/server hooks.
- **Local feasibility:** Possible lab study; not a memory database.
- **AgentOS compatibility:** Overlaps context management, not provenance memory.
- **Duplication / maintenance value:** Medium for ideas; low as core dependency.
- **Adoption gates:** Independent implementation preferred; if reused, pin and satisfy attribution; disable auto-update.

#### opencode — OpenCode (B)

- **Source:** https://github.com/anomalyco/opencode
- **Classification:** B — Adapter required
- **GitHub evidence:** `anomalyco/opencode`; availability `available`; observed push `2026-11-02T10:18:37Z`; commit `ff90ed91607c`; detected license `MIT`; latest release `v2.2.5`; tree truncated: `False`.
- **Purpose:** Open-source coding agent and developer tooling.
- **Stack / architecture:** Bun/Turbo/SST TypeScript + Rust monorepo; DB migrations; SECURITY.md.
- **License / commercial:** MIT detected.
- **Dependencies / security:** Agent executes tools; needs sandbox, scoped repo token, egress policy; migrations must not touch production DB.
- **Runtime / infrastructure:** Node/Bun/Rust build; separate worker host.
- **Interfaces:** CLI/server/API; editor integrations.
- **Local feasibility:** Candidate coding worker after isolated build.
- **AgentOS compatibility:** Adapter to Software Factory; not a durable orchestrator by itself.
- **Duplication / maintenance value:** High for code generation/editing.
- **Adoption gates:** Pin commit; review SECURITY; sandbox; no production secrets; human PR approval.

#### scrapling — Scrapling (B)

- **Source:** https://github.com/D4Vinci/Scrapling
- **Classification:** B — Adapter required
- **GitHub evidence:** `D4Vinci/Scrapling`; availability `available`; observed push `2026-11-01T18:00:03Z`; commit `95cf9019ab5a`; detected license `BSD-3-Clause`; latest release `v0.5`; tree truncated: `False`.
- **Purpose:** Web scraping/fetching/parsing library with agent interfaces.
- **Stack / architecture:** Python >=3.10; fetchers/spiders/parsing; MCP/skill/CLI/Docker.
- **License / commercial:** BSD-3-Clause detected.
- **Dependencies / security:** Antibot/interstitial features conflict with no-access-control-bypass rule; parser and fetcher attack surface.
- **Runtime / infrastructure:** Python worker; browser engines optional; network egress controls.
- **Interfaces:** Python API, CLI, MCP, skill, Docker.
- **Local feasibility:** Candidate for authorized public research only.
- **AgentOS compatibility:** Adapter to Research agent; disable bypass modes.
- **Duplication / maintenance value:** High for lawful retrieval; medium overall.
- **Adoption gates:** Pin version; allowlist domains; robots/terms review; no login/paywall/DRM bypass; scan outputs.

#### cli-anything — CLI-Anything (B)

- **Source:** https://github.com/HKUDS/CLI-Anything
- **Classification:** B — Adapter required
- **GitHub evidence:** `HKUDS/CLI-Anything`; availability `available`; observed push `2026-09-22T02:01:29Z`; commit `34f519533bc1`; detected license `Apache-2.0`; latest release `v0.4.0`; tree truncated: `False`.
- **Purpose:** Generate CLI harnesses for GUI/desktop software so agents can operate tools.
- **Stack / architecture:** Python/agent tooling; Apache-2.0.
- **License / commercial:** Apache-2.0 detected.
- **Dependencies / security:** Generated harnesses execute local apps; must be treated as untrusted code.
- **Runtime / infrastructure:** Disposable worker with target app installed; no production mounts.
- **Interfaces:** CLI generation, skills/plugins.
- **Local feasibility:** Lab candidate only.
- **AgentOS compatibility:** Adapter factory for desktop tools; not core.
- **Duplication / maintenance value:** Medium-high for Kdenlive/OBS-style automation.
- **Adoption gates:** Pin; review generated code; sandbox; app-specific license checks; human approval.

#### pocock-skills — Skills by Matt Pocock (A)

- **Source:** https://github.com/mattpocock/skills
- **Classification:** A — Direct reuse candidate
- **GitHub evidence:** `mattpocock/skills`; availability `available`; observed push `2026-11-01T11:42:33Z`; commit `4ae2317ddb22`; detected license `MIT`; latest release `v1.3.2`; tree truncated: `False`.
- **Purpose:** Reusable engineering skills (TypeScript/testing/process guidance).
- **Stack / architecture:** Markdown skill artifacts; host-agent execution.
- **License / commercial:** MIT detected.
- **Dependencies / security:** Instructions can contain prompt injection; review each skill; no runtime binary.
- **Runtime / infrastructure:** Any compatible agent host; negligible compute.
- **Interfaces:** SKILL.md artifacts.
- **Local feasibility:** Direct reuse of reviewed text artifacts is feasible.
- **AgentOS compatibility:** Fits Software Factory/QA skill library after review.
- **Duplication / maintenance value:** High leverage, low maintenance.
- **Adoption gates:** Pin commit; human review; disable auto-install; version skill registry.

#### ruflo — Ruflo (D)

- **Source:** https://github.com/ruvnet/ruflo
- **Classification:** D — Study + independent implementation
- **GitHub evidence:** `ruvnet/ruflo`; availability `available`; observed push `2026-11-02T09:21:09Z`; commit `5f3dacc54b72`; detected license `MIT`; latest release `v3.71.0`; tree truncated: `False`.
- **Purpose:** Large multi-agent orchestration framework (claude-flow).
- **Stack / architecture:** Node >=20 (plugins >=22); npm/native SQLite/Rust; many plugins.
- **License / commercial:** MIT detected.
- **Dependencies / security:** Heavy dependency/plugin surface; sandbox warnings; orchestration claims not independently verified.
- **Runtime / infrastructure:** Substantial Node/native build; separate host if studied.
- **Interfaces:** CLI/plugins/MCP-style hooks.
- **Local feasibility:** Study only on audit host; too heavy to adopt wholesale.
- **AgentOS compatibility:** Overlaps proposed orchestrator; independent core preferred.
- **Duplication / maintenance value:** Medium for patterns; low as dependency.
- **Adoption gates:** Do not import core; study task routing/swarm ideas; no plugin auto-install.

#### claude-plugins — Claude Plugins (B)

- **Source:** https://github.com/anthropics/claude-plugins-official
- **Classification:** B — Adapter required
- **GitHub evidence:** `anthropics/claude-plugins-official`; availability `available`; observed push `2026-11-02T07:29:13Z`; commit `a7ba5b93db0c`; detected license `Apache-2.0`; latest release `none observed`; tree truncated: `False`.
- **Purpose:** Official Claude plugin/skill marketplace content.
- **Stack / architecture:** Markdown/JSON plugin manifests; host-specific integrations.
- **License / commercial:** Apache-2.0 detected.
- **Dependencies / security:** Plugins may request tools/credentials; local MCP security guidance must be enforced.
- **Runtime / infrastructure:** Claude-compatible host or adapter; per-plugin requirements.
- **Interfaces:** Plugins/skills/MCP definitions.
- **Local feasibility:** Selective reuse feasible.
- **AgentOS compatibility:** Adapter/skill source, not AgentOS runtime.
- **Duplication / maintenance value:** Medium-high for curated workflows.
- **Adoption gates:** Pin; review each plugin; least privilege; no marketplace auto-update.

#### android-skills — Android Skills (A)

- **Source:** https://github.com/android/skills
- **Classification:** A — Direct reuse candidate
- **GitHub evidence:** `android/skills`; availability `available`; observed push `2026-10-29T10:12:00Z`; commit `6daa53ef27fa`; detected license `Apache-2.0`; latest release `v1.0.19`; tree truncated: `False`.
- **Purpose:** Official Android development/analysis skills.
- **Stack / architecture:** Markdown skill artifacts for Android tooling.
- **License / commercial:** Apache-2.0 detected.
- **Dependencies / security:** Skill instructions are untrusted until reviewed; Android SDK actions need authorization.
- **Runtime / infrastructure:** Agent host; Android SDK/emulator only for authorized targets.
- **Interfaces:** SKILL.md artifacts.
- **Local feasibility:** Direct artifact reuse feasible; emulator not run here.
- **AgentOS compatibility:** Fits RE Lab and mobile Software Factory.
- **Duplication / maintenance value:** High for Android work.
- **Adoption gates:** Pin; review; authorized APK/emulator only; no production keystore.

#### scientific-skills — Scientific Agent Skills (B)

- **Source:** https://github.com/K-Dense-AI/scientific-agent-skills
- **Classification:** B — Adapter required
- **GitHub evidence:** `K-Dense-AI/scientific-agent-skills`; availability `available`; observed push `2026-11-02T09:23:27Z`; commit `a25cf9ec00e2`; detected license `MIT`; latest release `v2.72.0`; tree truncated: `False`.
- **Purpose:** Scientific research/analysis skill collection.
- **Stack / architecture:** Markdown/Python-oriented skills; multiple scientific domains.
- **License / commercial:** MIT detected.
- **Dependencies / security:** Domain tools may fetch data or execute code; verify each dependency and data license.
- **Runtime / infrastructure:** Python/scientific stack per skill; modest to heavy depending on tool.
- **Interfaces:** Skills; tool-specific CLI/API.
- **Local feasibility:** Selective lab reuse feasible.
- **AgentOS compatibility:** Research agent adapters; not core memory.
- **Duplication / maintenance value:** Medium-high for research workflows.
- **Adoption gates:** Pin; select skills; sandbox; verify data licenses; no automatic publication.

#### cursor-plugins — Cursor Plugins (D)

- **Source:** https://github.com/cursor/plugins
- **Classification:** D — Study + independent implementation
- **GitHub evidence:** `cursor/plugins`; availability `available`; observed push `2026-11-01T00:10:38Z`; commit `ae5650febf43`; detected license `None`; latest release `none observed`; tree truncated: `False`.
- **Purpose:** Cursor editor plugin definitions and workflows.
- **Stack / architecture:** Editor-specific plugin manifests/skills.
- **License / commercial:** No root license detected in collected evidence.
- **Dependencies / security:** Editor plugins can access workspace/credentials; host-specific trust model.
- **Runtime / infrastructure:** Cursor editor; not a server runtime.
- **Interfaces:** Cursor plugin API.
- **Local feasibility:** Reference only.
- **AgentOS compatibility:** Overlaps factory skills; independent registry preferred.
- **Duplication / maintenance value:** Medium for UX/workflow ideas.
- **Adoption gates:** Do not vendor without license; study patterns; implement own reviewed skills.

#### ai-memory — AI Memory (F)

- **Source:** https://github.com/akitaonrails/ai-me
- **Classification:** F — Investigate further / blocked
- **Web evidence:** availability `unavailable`; public page text reviewed; no runtime verified.
- **Purpose:** Intended AI memory resource; exact supplied repository unavailable.
- **Stack / architecture:** Unknown; exact URL returned unavailable.
- **License / commercial:** Unknown.
- **Dependencies / security:** Cannot assess code, dependencies or security.
- **Runtime / infrastructure:** Unknown.
- **Interfaces:** Unknown.
- **Local feasibility:** Not feasible until resolved.
- **AgentOS compatibility:** Cannot map to Memory layer.
- **Duplication / maintenance value:** Unknown.
- **Adoption gates:** Request exact working URL or archive; do not substitute a similarly named repo.

#### karpath — Kapathi Skills Extended (owner label) (F)

- **Source:** https://github.com/anshuxinha/karpath
- **Classification:** F — Investigate further / blocked
- **Web evidence:** availability `unavailable`; public page text reviewed; no runtime verified.
- **Purpose:** Supplied “Kapathi Skills Extended” repository link.
- **Stack / architecture:** Unknown; exact URL returned unavailable.
- **License / commercial:** Unknown.
- **Dependencies / security:** Cannot assess.
- **Runtime / infrastructure:** Unknown.
- **Interfaces:** Unknown.
- **Local feasibility:** Not feasible until resolved.
- **AgentOS compatibility:** Cannot map.
- **Duplication / maintenance value:** Unknown.
- **Adoption gates:** Request corrected URL; owner label is not verification.

#### delegate-router — Delegate Router (B)

- **Source:** https://github.com/pvjbuilds/delegate-router
- **Classification:** B — Adapter required
- **GitHub evidence:** `pvjbuilds/delegate-router`; availability `available`; observed push `2026-11-01T07:45:10Z`; commit `708f60acdce9`; detected license `MIT`; latest release `v1.4.1`; tree truncated: `False`.
- **Purpose:** Model/provider delegation and routing for agents.
- **Stack / architecture:** TypeScript routing library/plugin.
- **License / commercial:** MIT detected.
- **Dependencies / security:** Routing is not authorization; provider keys and fallbacks need policy enforcement.
- **Runtime / infrastructure:** Node/TS; lightweight.
- **Interfaces:** Library/plugin hooks.
- **Local feasibility:** Feasible as a small adapter.
- **AgentOS compatibility:** Overlaps existing free-router; evaluate before adding.
- **Duplication / maintenance value:** Medium; existing router may be sufficient.
- **Adoption gates:** Pin; compare with current router; no new provider without approval; budget caps.

#### container — Container (D)

- **Source:** https://github.com/aerovato/container
- **Classification:** D — Study + independent implementation
- **GitHub evidence:** `aerovato/container`; availability `available`; observed push `2026-10-23T04:08:31Z`; commit `4b23fc15fd0a`; detected license `BSD-3-Clause`; latest release `v3.7.1`; tree truncated: `False`.
- **Purpose:** Persistent Linux workspaces for coding agents using Docker/Podman.
- **Stack / architecture:** TypeScript; @aerovato/container 3.7.1; container workspaces.
- **License / commercial:** BSD-3-Clause detected.
- **Dependencies / security:** Project mounted read-write at /root; network/optional credentials persist; not prompt-injection protection.
- **Runtime / infrastructure:** Docker/Podman host; not available in audit sandbox.
- **Interfaces:** CLI/skill; container lifecycle.
- **Local feasibility:** Study only here; no container runtime installed.
- **AgentOS compatibility:** Useful workspace UX, insufficient as security boundary.
- **Duplication / maintenance value:** Medium for ideas; do not treat as sandbox guarantee.
- **Adoption gates:** Independent hardened runner; read-only mounts; non-root; egress deny; no credential persistence.

#### testsprite — TestSprite (C)

- **Source:** https://www.testsprite.com/
- **Classification:** C — Optional external service
- **Web evidence:** availability `fetched`; public page text reviewed; no runtime verified.
- **Purpose:** Hosted AI testing/verification platform with official CLI.
- **Stack / architecture:** SaaS + Apache-2.0 CLI (TestSprite/testsprite-cli verified).
- **License / commercial:** CLI Apache-2.0; hosted service governed by vendor terms/pricing.
- **Dependencies / security:** Tests send app/code context to vendor; CLI setup writes agent skills; API key required.
- **Runtime / infrastructure:** Hosted service; CLI Node 20.19+/22.13+/24+.
- **Interfaces:** CLI/MCP/skills; hosted API.
- **Local feasibility:** CLI can run locally but verification depends on hosted service.
- **AgentOS compatibility:** Optional external QA; internal tests remain authoritative.
- **Duplication / maintenance value:** Medium-high as optional second opinion.
- **Adoption gates:** Vendor review; data-processing approval; scoped key; no production targets; budget cap.

#### coderabbit — CodeRabbit (C)

- **Source:** https://www.coderabbit.ai/
- **Classification:** C — Optional external service
- **Web evidence:** availability `fetched`; public page text reviewed; no runtime verified.
- **Purpose:** Hosted AI pull-request review and security analysis.
- **Stack / architecture:** SaaS GitHub/GitLab/Azure/Bitbucket integrations.
- **License / commercial:** Proprietary service; plan terms.
- **Dependencies / security:** Repository access and code leave boundary; Deep Scan is not SCA/SBOM; review comments are untrusted.
- **Runtime / infrastructure:** Vendor cloud; repo app/token.
- **Interfaces:** PR checks/comments; IDE/CLI; security findings.
- **Local feasibility:** No local server; optional integration only.
- **AgentOS compatibility:** Complements internal QA; cannot approve merges.
- **Duplication / maintenance value:** Medium-high for PR review.
- **Adoption gates:** Least-privilege repo app; branch protection; human merge; no secret repos without approval.

#### opensms — OpenSMS (B)

- **Source:** https://github.com/daslearning-org/OpenSMS
- **Classification:** B — Adapter required
- **GitHub evidence:** `daslearning-org/OpenSMS`; availability `available`; observed push `2026-11-02T08:58:56Z`; commit `62ead94887a5`; detected license `Apache-2.0`; latest release `v0.3.0`; tree truncated: `False`.
- **Purpose:** Android SMS gateway with HTTP API.
- **Stack / architecture:** Python FastAPI/Uvicorn; KivyMD Android client; unpinned/master deps.
- **License / commercial:** Apache-2.0 detected.
- **Dependencies / security:** No gateway rate limiting; sensitive SMS permissions; README suggests disabling Play Protect/restricted access — do not follow blindly.
- **Runtime / infrastructure:** Android device + Python server; carrier/SMS costs.
- **Interfaces:** REST API; Android app.
- **Local feasibility:** Possible isolated lab; not executed.
- **AgentOS compatibility:** Adapter to existing SMS capability; official WhatsApp remains separate.
- **Duplication / maintenance value:** Medium; httpSMS already integrated.
- **Adoption gates:** Pin deps; rate limit; consent; secure device; no Play Protect bypass; approval for sends.

#### postiz — Postiz (C)

- **Source:** https://github.com/gitroomhq/postiz-app
- **Classification:** C — Optional external service
- **GitHub evidence:** `gitroomhq/postiz-app`; availability `available`; observed push `2026-11-02T10:04:24Z`; commit `207eee0dae44`; detected license `AGPL-3.0`; latest release `v2.25.3`; tree truncated: `False`.
- **Purpose:** Self-hosted social publishing platform.
- **Stack / architecture:** Node exactly 22.23.4; Postgres/Redis/storage; AGPL-3.0.
- **License / commercial:** AGPL-3.0 detected; network copyleft obligations if modified/hosted.
- **Dependencies / security:** Provider keys; latest-release-only security support; external publication risk.
- **Runtime / infrastructure:** Separate service with Postgres/Redis/storage; exact Node engine.
- **Interfaces:** REST/CLI/MCP; provider connectors.
- **Local feasibility:** Feasible on dedicated host, not audit sandbox.
- **AgentOS compatibility:** Optional external publishing service; keep out of core.
- **Duplication / maintenance value:** High if social publishing needed; medium overall.
- **Adoption gates:** AGPL review; isolate; pin; provider terms; human approval per publication.

#### voicebox — Voicebox (B)

- **Source:** https://github.com/jamiepine/voicebox
- **Classification:** B — Adapter required
- **GitHub evidence:** `jamiepine/voicebox`; availability `available`; observed push `2026-10-07T01:17:58Z`; commit `8af7efe62fab`; detected license `MIT`; latest release `v0.5.0`; tree truncated: `False`.
- **Purpose:** Local voice input/output and TTS/STT studio.
- **Stack / architecture:** Tauri/Rust + FastAPI; Python >=3.12,<3.13; Torch/transformers; git-only ML deps.
- **License / commercial:** MIT detected; model weights have separate licenses.
- **Dependencies / security:** Custom git/no-deps engine installs; model provenance; microphone/voice privacy.
- **Runtime / infrastructure:** Desktop/worker; GPU optional but heavy ML deps; Python 3.12.
- **Interfaces:** REST/MCP; desktop app.
- **Local feasibility:** Candidate on suitable workstation; not audit host.
- **AgentOS compatibility:** Adapter to Creative Studio; not core.
- **Duplication / maintenance value:** High for local voice workflows.
- **Adoption gates:** Pin engines/weights; license each model; sandbox; consent for voice cloning; no production mic access.

#### kdenlive — Kdenlive (C)

- **Source:** https://github.com/KDE/kdenlive
- **Classification:** C — Optional external service
- **GitHub evidence:** `KDE/kdenlive`; availability `available`; observed push `2026-11-02T03:53:40Z`; commit `3682de2ea291`; detected license `GPL-3.0`; latest release `none observed`; tree truncated: `False`.
- **Purpose:** Native non-linear video editor.
- **Stack / architecture:** C++/MLT/Qt/KDE Frameworks6/frei0r/LADSPA; GitHub mirror of KDE Invent.
- **License / commercial:** GPL-3.0 detected.
- **Dependencies / security:** Native codecs/plugins process untrusted media; desktop privileges.
- **Runtime / infrastructure:** Linux desktop; MLT/Qt stack; CPU/GPU per workload.
- **Interfaces:** Desktop GUI; MLT/scripting; CLI-anything harness possible.
- **Local feasibility:** Workstation tool, not web-service drop-in.
- **AgentOS compatibility:** Optional external creative tool; render worker via harness.
- **Duplication / maintenance value:** High for human editing; low as embedded dependency.
- **Adoption gates:** Use distro/KDE builds; isolate media; GPL review for redistribution; no server embedding.

#### openshorts — OpenShorts (F)

- **Source:** https://github.com/mutonby/openshorts
- **Classification:** F — Investigate further / blocked
- **GitHub evidence:** `mutonby/openshorts`; availability `available`; observed push `2026-11-02T02:12:50Z`; commit `cf0810f01ad9`; detected license `MIT`; latest release `none observed`; tree truncated: `False`.
- **Purpose:** Long-video to short-clip generation service.
- **Stack / architecture:** Python/Docker; Rust NVDEC/CUDA/NVENC renderer; Torch/Whisper/GenAI deps.
- **License / commercial:** App MIT, but composite includes AGPL Ultralytics and Remotion company-license terms.
- **Dependencies / security:** Heavy ML/media deps; model licenses; GPU renderer; hosted cloud variant.
- **Runtime / infrastructure:** Documented CPU 8GB+ RAM; optional NVIDIA GPU; audit host ~3.9GB.
- **Interfaces:** REST/MCP; cloud variant.
- **Local feasibility:** Not feasible on audit host as documented.
- **AgentOS compatibility:** Potential Creative Studio worker after license clearance.
- **Duplication / maintenance value:** High capability; blocked by composite licensing/resources.
- **Adoption gates:** Resolve Remotion/Ultralytics/model terms; dedicated host; pin; sandbox; no auto-publish.

#### moneyprinter — MoneyPrinterTurbo (B)

- **Source:** https://github.com/harry0703/MoneyPrinterTurbo
- **Classification:** B — Adapter required
- **GitHub evidence:** `harry0703/MoneyPrinterTurbo`; availability `available`; observed push `2026-11-02T09:22:43Z`; commit `84e99b3168cc`; detected license `MIT`; latest release `v1.3.9`; tree truncated: `False`.
- **Purpose:** Automated short-video generation.
- **Stack / architecture:** Python >=3.11; mpt 1.3.9 WebUI/API/CLI/agent; uv lock.
- **License / commercial:** MIT detected; media/model/provider terms separate.
- **Dependencies / security:** Best-effort security; cloud providers avoid GPU; local transcription/batching needs resources.
- **Runtime / infrastructure:** Python worker; GPU optional; cloud keys optional.
- **Interfaces:** WebUI/API/CLI/agent.
- **Local feasibility:** Feasible on modest host with cloud providers; local ML heavier.
- **AgentOS compatibility:** Creative Studio adapter; overlaps OpenShorts/Pixelle.
- **Duplication / maintenance value:** High for scripted video; choose one engine.
- **Adoption gates:** Pin uv lock; scan media; license assets; sandbox; approval for publication; budget caps.

#### obs — OBS Studio (C)

- **Source:** https://github.com/obsproject/obs-studio
- **Classification:** C — Optional external service
- **GitHub evidence:** `obsproject/obs-studio`; availability `available`; observed push `2026-10-29T21:06:06Z`; commit `65c320b46e1a`; detected license `GPL-2.0`; latest release `33.0.1`; tree truncated: `False`.
- **Purpose:** Desktop recording/live streaming studio.
- **Stack / architecture:** C/C++ native; plugin ecosystem.
- **License / commercial:** GPL-2.0 detected.
- **Dependencies / security:** Plugins and capture sources are privileged; streaming keys sensitive.
- **Runtime / infrastructure:** Desktop with capture/graphics; not headless web core.
- **Interfaces:** Desktop GUI; WebSocket/plugin APIs; CLI harness possible.
- **Local feasibility:** Workstation only.
- **AgentOS compatibility:** Optional external capture tool.
- **Duplication / maintenance value:** High for recording; not core automation.
- **Adoption gates:** Trusted plugins only; isolate capture; protect stream keys; GPL review if redistributed.

#### rescript — Rescript (E)

- **Source:** https://github.com/wassgha/rescript
- **Classification:** E — Reject for this program
- **GitHub evidence:** `wassgha/rescript`; availability `available`; observed push `2026-10-29T17:31:28Z`; commit `167c7b3ff429`; detected license `NOASSERTION`; latest release `v1.2.5`; tree truncated: `False`.
- **Purpose:** Browser/desktop transcript and media editing tool.
- **Stack / architecture:** Next/Electron/transformers.js/ffmpeg.wasm; WebGPU/WASM/COOP-COEP.
- **License / commercial:** Current PolyForm Noncommercial 1.0.0; older MIT releases remain MIT but do not relicense current code.
- **Dependencies / security:** Telemetry deps present despite offline claims; browser media attack surface.
- **Runtime / infrastructure:** Modern browser/Electron; WebGPU optional.
- **Interfaces:** Desktop/web app.
- **Local feasibility:** Commercial embedding blocked under current license.
- **AgentOS compatibility:** Overlaps VideoCaptioner/Voicebox; study only.
- **Duplication / maintenance value:** Low for commercial reuse; medium for ideas.
- **Adoption gates:** Reject current code for commercial AgentOS; independent implementation or separate commercial license.

#### presenton — Presenton (B)

- **Source:** https://github.com/presenton/presenton
- **Classification:** B — Adapter required
- **GitHub evidence:** `presenton/presenton`; availability `available`; observed push `2026-11-01T04:25:15Z`; commit `571461f969be`; detected license `Apache-2.0`; latest release `v0.9.12-beta`; tree truncated: `False`.
- **Purpose:** AI presentation generation with editable PPTX/PDF export.
- **Stack / architecture:** Next/Python; Docker/desktop; LLM providers; sharp/liteparse.
- **License / commercial:** Apache-2.0 detected; templates/assets/models separate.
- **Dependencies / security:** Provider keys; document parsing; template licensing.
- **Runtime / infrastructure:** Docker or desktop; LLM API or local model; modest CPU.
- **Interfaces:** API; WebUI; desktop; Ollama/OpenAI-compatible providers.
- **Local feasibility:** Strong candidate on separate worker.
- **AgentOS compatibility:** Creative Studio adapter; overlaps native presentation outlines only.
- **Duplication / maintenance value:** High for decks.
- **Adoption gates:** Pin; review templates; sandbox document parsing; provider budget; human review before external use.

#### dify — Dify (C)

- **Source:** https://github.com/langgenius/dify
- **Classification:** C — Optional external service
- **GitHub evidence:** `langgenius/dify`; availability `available`; observed push `2026-11-02T10:21:44Z`; commit `24da932967e9`; detected license `NOASSERTION`; latest release `1.18.0`; tree truncated: `False`.
- **Purpose:** LLM app/workflow/RAG/agent platform.
- **Stack / architecture:** Python/Next; Docker Compose; Postgres/Redis/vector store; marketplace.
- **License / commercial:** Modified Apache-2.0: no unauthorized multi-tenant service; frontend logo/copyright retention.
- **Dependencies / security:** Marketplace plugins and agent sandbox claims need review; custom license is not plain Apache.
- **Runtime / infrastructure:** Documented >=2 CPU/4GiB RAM; Docker Compose v2.24+.
- **Interfaces:** APIs for all features; MCP/tools; visual workflows.
- **Local feasibility:** Feasible on dedicated host, not audit sandbox.
- **AgentOS compatibility:** Optional external orchestration; overlaps core; do not make mandatory.
- **Duplication / maintenance value:** Medium; useful comparator, not core.
- **Adoption gates:** Legal review for tenancy/branding; isolate; pin; no marketplace auto-install; keep core independent.

#### open-seo — Every App Open SEO (B)

- **Source:** https://github.com/every-app/open-seo
- **Classification:** B — Adapter required
- **GitHub evidence:** `every-app/open-seo`; availability `available`; observed push `2026-10-31T02:28:19Z`; commit `1523750b7685`; detected license `MIT`; latest release `v0.1.22`; tree truncated: `False`.
- **Purpose:** Self-hosted SEO research/audit tool with agent interfaces.
- **Stack / architecture:** Next/Cloudflare or Docker; DataForSEO API; MCP/skills.
- **License / commercial:** MIT detected; DataForSEO is paid external data.
- **Dependencies / security:** First-visitor admin setup; optional no-signin mode must stay private; API key cost.
- **Runtime / infrastructure:** Docker or Cloudflare; DataForSEO key required for data.
- **Interfaces:** MCP/skills; web UI; API.
- **Local feasibility:** Feasible as separate service; not free data.
- **AgentOS compatibility:** Research/SEO adapter; overlaps existing SEO kits.
- **Duplication / maintenance value:** Medium-high if paid data justified.
- **Adoption gates:** Pin; secure admin bootstrap; private network; budget cap; verify data terms.

#### wacrm — WACRM (D)

- **Source:** https://github.com/ArnasDon/wacrm
- **Classification:** D — Study + independent implementation
- **GitHub evidence:** `ArnasDon/wacrm`; availability `available`; observed push `2026-10-30T09:26:38Z`; commit `c81299d1488a`; detected license `MIT`; latest release `none observed`; tree truncated: `False`.
- **Purpose:** Official WhatsApp Business API CRM.
- **Stack / architecture:** Next16/Supabase; Node >=22.12; REST /api/v1; MCP.
- **License / commercial:** MIT detected.
- **Dependencies / security:** Scoped API keys; MCP read-only default/opt-in writes; Meta policy compliance required.
- **Runtime / infrastructure:** Node/Supabase; Docker/Hostinger claims unverified.
- **Interfaces:** REST; MCP; webhooks.
- **Local feasibility:** Feasible but duplicates existing CRM.
- **AgentOS compatibility:** Study official API/MCP patterns; do not replace native CRM.
- **Duplication / maintenance value:** Medium; existing CRM + Meta adapter preferred.
- **Adoption gates:** No WAHA/unofficial clients; Meta templates/consent; independent implementation or selective adapter.

#### mailcheap — Mailcheap (C)

- **Source:** https://github.com/marclou/mailcheap
- **Classification:** C — Optional external service
- **GitHub evidence:** `marclou/mailcheap`; availability `available`; observed push `2026-11-02T09:37:44Z`; commit `113550690e70`; detected license `AGPL-3.0`; latest release `none observed`; tree truncated: `False`.
- **Purpose:** Self-hosted email marketing/sending platform.
- **Stack / architecture:** Next/Mongoose/better-auth/MCP; SES/PostShiba.
- **License / commercial:** AGPL-3.0 detected.
- **Dependencies / security:** Sending marked irreversible/approval-gated; provider keys; deliverability/abuse controls.
- **Runtime / infrastructure:** Node >=22; MongoDB; email provider.
- **Interfaces:** REST/MCP parity; web UI.
- **Local feasibility:** Separate service feasible.
- **AgentOS compatibility:** Optional external email service; overlaps native email campaigns.
- **Duplication / maintenance value:** Medium; keep native unless gap proven.
- **Adoption gates:** AGPL review; isolate; consent/suppression lists; human approval for sends; rate limits.

#### hyperframes — HyperFrames (B)

- **Source:** https://github.com/heygen-com/hyperframes
- **Classification:** B — Adapter required
- **GitHub evidence:** `heygen-com/hyperframes`; availability `available`; observed push `2026-11-02T10:25:40Z`; commit `618c486734b3`; detected license `Apache-2.0`; latest release `v0.9.2`; tree truncated: `False`.
- **Purpose:** Deterministic HTML/CSS to MP4 rendering.
- **Stack / architecture:** Bun 1.4.4; CLI/skills/plugin; renderer.
- **License / commercial:** Apache-2.0 detected.
- **Dependencies / security:** Skill installers can auto-update from main; renderer processes untrusted HTML.
- **Runtime / infrastructure:** Bun worker; browser/render deps; CPU/GPU per workload.
- **Interfaces:** CLI/skills/plugin.
- **Local feasibility:** Feasible on dedicated render worker.
- **AgentOS compatibility:** Creative Studio adapter; overlaps Remotion/MoneyPrinter.
- **Duplication / maintenance value:** High for deterministic motion graphics.
- **Adoption gates:** Pin artifacts; disable auto-update; sandbox HTML; asset licenses; resource limits.

#### diagram-design — Diagram Design (A)

- **Source:** https://github.com/cathrynlavery/diagram-design
- **Classification:** A — Direct reuse candidate
- **GitHub evidence:** `cathrynlavery/diagram-design`; availability `available`; observed push `2026-11-01T09:13:30Z`; commit `0cf73c3fcc56`; detected license `MIT`; latest release `none observed`; tree truncated: `False`.
- **Purpose:** Skill for self-contained HTML/SVG diagrams (45 types).
- **Stack / architecture:** Markdown skill + scripts/references/assets; plugin auto-update.
- **License / commercial:** MIT detected.
- **Dependencies / security:** Scripts and assets need review; auto-update mutable upstream.
- **Runtime / infrastructure:** Agent host; browser/SVG rendering.
- **Interfaces:** SKILL.md; scripts.
- **Local feasibility:** Direct reviewed artifact reuse feasible.
- **AgentOS compatibility:** Fits Creative/Factory diagram skill.
- **Duplication / maintenance value:** High, low maintenance.
- **Adoption gates:** Pin; review scripts/assets; disable auto-update; privacy review.

#### text-to-cad — Text to CAD (B)

- **Source:** https://github.com/earthtojake/text-to-cad
- **Classification:** B — Adapter required
- **GitHub evidence:** `earthtojake/text-to-cad`; availability `available`; observed push `2026-11-02T06:24:37Z`; commit `5efa85a911d9`; detected license `MIT`; latest release `v0.10.0`; tree truncated: `False`.
- **Purpose:** Agent-driven CAD generation/export and fabrication checks.
- **Stack / architecture:** Python/build123d/Open CASCADE; local daemon; MCP/skills; uv.
- **License / commercial:** MIT detected; Open CASCADE and fabrication-service terms separate.
- **Dependencies / security:** SECURITY: sandboxed agent can reach daemon outside sandbox; server installs packages with network by design.
- **Runtime / infrastructure:** Local daemon; Python/uv; loopback token; CPU-heavy CAD.
- **Interfaces:** MCP/CLI/skills; STEP/GLB/STL/3MF.
- **Local feasibility:** Candidate only in disposable VM; daemon boundary is user account, not sandbox.
- **AgentOS compatibility:** Creative/Engineering adapter with strong isolation.
- **Duplication / maintenance value:** High for CAD; medium overall.
- **Adoption gates:** Dedicated VM; no production credentials; pin; review scripts; egress controls; fabrication approval.

#### tripo — Tripo (C)

- **Source:** https://studio.tripo3d.ai/
- **Classification:** C — Optional external service
- **Web evidence:** availability `fetched`; public page text reviewed; no runtime verified.
- **Purpose:** Hosted AI 3D generation studio/API.
- **Stack / architecture:** Vendor SaaS; terms reviewed.
- **License / commercial:** Proprietary; terms allow lawful commercial output use but restrict competing models/services and unauthorized third-party API availability.
- **Dependencies / security:** No reverse engineering; input responsibility; automated access restrictions; output non-exclusive.
- **Runtime / infrastructure:** Vendor cloud; API key/credits.
- **Interfaces:** Hosted API/studio.
- **Local feasibility:** No local model; optional external only.
- **AgentOS compatibility:** Creative Studio optional adapter; overlaps Text-to-CAD.
- **Duplication / maintenance value:** Medium; useful for organic 3D, not core.
- **Adoption gates:** Vendor/API agreement; no competing-service resale; budget; human review; input rights.

#### godsview — GodsViewAI (D)

- **Source:** https://godsviewai.com/globe
- **Classification:** D — Study + independent implementation
- **Web evidence:** availability `fetched`; public page text reviewed; no runtime verified.
- **Purpose:** Live globe/data visualization product.
- **Stack / architecture:** Hosted web app; map/data layers; sign-in features.
- **License / commercial:** Proprietary service; no source license verified.
- **Dependencies / security:** Data-layer licenses and accuracy unverified; do not scrape authenticated data.
- **Runtime / infrastructure:** Browser; vendor backend.
- **Interfaces:** No public API contract verified.
- **Local feasibility:** Reference only.
- **AgentOS compatibility:** UX/data-layer inspiration for dashboards; not a component.
- **Duplication / maintenance value:** Medium for visualization ideas.
- **Adoption gates:** Independent implementation; verify each data source license; no copied assets.

#### riverside — Riverside (C)

- **Source:** https://riverside.com/
- **Classification:** C — Optional external service
- **Web evidence:** availability `fetched`; public page text reviewed; no runtime verified.
- **Purpose:** Cloud recording/editing/podcast hosting.
- **Stack / architecture:** Vendor SaaS/web/mobile.
- **License / commercial:** Proprietary terms; competitor/benchmarking restrictions; content hosting license.
- **Dependencies / security:** Guest recording privacy/consent; third-party integrations; vendor storage.
- **Runtime / infrastructure:** Vendor cloud.
- **Interfaces:** Studio/web; integrations; API not verified here.
- **Local feasibility:** No local server.
- **AgentOS compatibility:** Optional external recording; complements OBS/Kdenlive.
- **Duplication / maintenance value:** Medium for remote podcasts.
- **Adoption gates:** Terms/privacy review; consent; no competitor benchmarking; export retention; optional only.

#### voicestudio — VoiceStudio (C)

- **Source:** https://github.com/debpalash/VoiceStudio
- **Classification:** C — Optional external service
- **GitHub evidence:** `debpalash/VoiceStudio`; availability `available`; observed push `2026-11-02T07:48:12Z`; commit `1a29929cb87f`; detected license `AGPL-3.0`; latest release `v0.5.7`; tree truncated: `False`.
- **Purpose:** Local-first voice/TTS studio with recipes and watch folders.
- **Stack / architecture:** Electron/FastAPI; Python >=3.11; Torch/WhisperX/pyannote/pedalboard.
- **License / commercial:** App AGPL-3.0-only or paid closed-source license; model weights separate (incl. CC-BY-NC/community terms).
- **Dependencies / security:** Heavy ML deps; voice cloning consent; model license fragmentation.
- **Runtime / infrastructure:** Workstation/worker; GPU recommended for heavy models.
- **Interfaces:** Local API/MCP/recipes/watch folders.
- **Local feasibility:** Feasible on suitable workstation; not audit host.
- **AgentOS compatibility:** Optional Creative Studio service; overlaps Voicebox.
- **Duplication / maintenance value:** Medium-high; license complexity lowers value.
- **Adoption gates:** Choose AGPL compliance or commercial license; clear each weight; isolate; consent; pin.

#### wacrm-docs — WACRM documentation (D)

- **Source:** https://wacrm.tech/docs/getting-started
- **Classification:** D — Study + independent implementation
- **Web evidence:** availability `fetched`; public page text reviewed; no runtime verified.
- **Purpose:** Documentation site for WACRM.
- **Stack / architecture:** Public docs for the WACRM project.
- **License / commercial:** Documentation copyright; underlying WACRM MIT.
- **Dependencies / security:** Docs are not a runtime; verify against pinned source.
- **Runtime / infrastructure:** Browser.
- **Interfaces:** Describes REST/MCP.
- **Local feasibility:** Reference only.
- **AgentOS compatibility:** Same resource family as wacrm; avoid double integration.
- **Duplication / maintenance value:** Medium as API reference.
- **Adoption gates:** Use with wacrm assessment; no separate dependency.

#### supabase — Supabase (C)

- **Source:** https://supabase.com
- **Classification:** C — Optional external service
- **Web evidence:** availability `fetched`; public page text reviewed; no runtime verified.
- **Purpose:** Optional Postgres/Auth/Storage/Realtime platform.
- **Stack / architecture:** Managed service or self-hosted Apache-2.0 stack (supabase/supabase verified).
- **License / commercial:** Service terms; self-host source Apache-2.0; separate component licenses.
- **Dependencies / security:** Vendor SOC2/ISO claims do not secure app RLS/keys; customer responsibility.
- **Runtime / infrastructure:** Managed cloud or substantial self-host stack.
- **Interfaces:** REST/SDK/Auth/Storage/Realtime.
- **Local feasibility:** Self-host possible but not proposed for current SQLite/MySQL app.
- **AgentOS compatibility:** Optional external platform; no mandatory migration.
- **Duplication / maintenance value:** Medium; current DB preserved.
- **Adoption gates:** No migration without approval; RLS/key review; backup/restore; cost; data residency.

#### meta — Meta for Developers (C)

- **Source:** https://developers.facebook.com/
- **Classification:** C — Optional external service
- **Web evidence:** availability `fetched`; public page text reviewed; no runtime verified.
- **Purpose:** Official Meta developer platform, including WhatsApp Business Cloud API.
- **Stack / architecture:** Hosted Graph API/webhooks/templates; documentation.
- **License / commercial:** Meta platform terms/policies; not an app approval.
- **Dependencies / security:** Business verification, templates, consent, webhook security; no unofficial clients.
- **Runtime / infrastructure:** Vendor cloud; business portfolio; HTTPS webhook.
- **Interfaces:** Graph API/webhooks.
- **Local feasibility:** Local adapter exists; service external.
- **AgentOS compatibility:** Preserve existing official WhatsApp integration; optional channel.
- **Duplication / maintenance value:** High for WhatsApp; mandatory only for that channel.
- **Adoption gates:** Meta policy compliance; scoped tokens; template approval; send approval; no credential exposure.

#### ngrok — ngrok (C)

- **Source:** https://ngrok.com
- **Classification:** C — Optional external service
- **Web evidence:** availability `fetched`; public page text reviewed; no runtime verified.
- **Purpose:** Managed ingress/tunneling for development.
- **Stack / architecture:** Vendor cloud + local agent.
- **License / commercial:** Proprietary service; free/paid tiers.
- **Dependencies / security:** Tunnels can expose internal services; auth and egress controls required.
- **Runtime / infrastructure:** Local agent + vendor edge; free $5 credit/caps; paid plans.
- **Interfaces:** CLI/agent; public URLs.
- **Local feasibility:** Dev-only feasible; not production architecture.
- **AgentOS compatibility:** Optional dev ingress; never bypass production firewall.
- **Duplication / maintenance value:** Medium for demos; low for core.
- **Adoption gates:** Auth required; no production DB/admin exposure; expiry; approval; prefer VPN/private network.

#### trustmrr — TrustMRR (D)

- **Source:** https://trustmrr.com/
- **Classification:** D — Study + independent implementation
- **Web evidence:** availability `fetched`; public page text reviewed; no runtime verified.
- **Purpose:** Startup acquisition marketplace and revenue listings.
- **Stack / architecture:** Hosted marketplace.
- **License / commercial:** Proprietary content/listings.
- **Dependencies / security:** Listings are vendor claims; financial/acquisition decisions need diligence.
- **Runtime / infrastructure:** Browser.
- **Interfaces:** No integration contract verified.
- **Local feasibility:** Reference only.
- **AgentOS compatibility:** Market research, not analytics infrastructure.
- **Duplication / maintenance value:** Low-medium.
- **Adoption gates:** No scraping/trading automation; verify claims independently.

#### datafast — DataFast (C)

- **Source:** https://datafa.st/
- **Classification:** C — Optional external service
- **Web evidence:** availability `fetched`; public page text reviewed; no runtime verified.
- **Purpose:** Paid revenue-focused web analytics.
- **Stack / architecture:** Hosted analytics + site script.
- **License / commercial:** Proprietary SaaS; trial/paid.
- **Dependencies / security:** Visitor data leaves site; privacy/consent and script supply-chain review.
- **Runtime / infrastructure:** Vendor cloud; snippet.
- **Interfaces:** JS snippet; dashboard; API not verified.
- **Local feasibility:** No local server.
- **AgentOS compatibility:** Optional external analytics; overlaps native analytics.
- **Duplication / maintenance value:** Medium; native first-party preferred.
- **Adoption gates:** Privacy review; consent; CSP; data retention; no mandatory dependency.

#### webtracky — WebTracky (C)

- **Source:** https://webtracky.com/
- **Classification:** C — Optional external service
- **Web evidence:** availability `fetched`; public page text reviewed; no runtime verified.
- **Purpose:** Paid traffic/revenue analytics with Stripe attribution.
- **Stack / architecture:** Hosted analytics; script; Stripe read-only key.
- **License / commercial:** Proprietary SaaS; trial/paid.
- **Dependencies / security:** Stripe restricted key; visitor privacy; script/CSP; privacy URL redirected to sign-in.
- **Runtime / infrastructure:** Vendor cloud.
- **Interfaces:** JS snippet; dashboard; Stripe connection.
- **Local feasibility:** No local server.
- **AgentOS compatibility:** Optional external analytics; overlaps native/DataFast.
- **Duplication / maintenance value:** Medium.
- **Adoption gates:** Restricted Stripe key; privacy terms; consent; CSP; optional only.

#### startupmap — StartupMap (D)

- **Source:** https://startupmap.lol
- **Classification:** D — Study + independent implementation
- **Web evidence:** availability `fetched`; public page text reviewed; no runtime verified.
- **Purpose:** Maker/startup discovery map.
- **Stack / architecture:** Hosted map/directory; OpenStreetMap/MapTiler attributions.
- **License / commercial:** Proprietary site; map data licenses apply.
- **Dependencies / security:** Public listing showed zero creators; data quality unverified.
- **Runtime / infrastructure:** Browser.
- **Interfaces:** No API verified.
- **Local feasibility:** Reference only.
- **AgentOS compatibility:** Discovery/UX inspiration; not core.
- **Duplication / maintenance value:** Low.
- **Adoption gates:** No scraping; verify map/data licenses if independently implemented.

#### buildonaut — Buildonaut (F)

- **Source:** https://buildonaut-yt.netlify.app/
- **Classification:** F — Investigate further / blocked
- **Web evidence:** availability `fetched`; public page text reviewed; no runtime verified.
- **Purpose:** Promotional “Hangar” site linking source-code/agent downloads and test payments.
- **Stack / architecture:** Netlify marketing site; external demos/Discord/YouTube; Razorpay test mode.
- **License / commercial:** No license verified for promoted downloads.
- **Dependencies / security:** Untrusted downloads/payment links; do not execute or pay.
- **Runtime / infrastructure:** Browser; unknown for downloads.
- **Interfaces:** None verified.
- **Local feasibility:** Not safe to install.
- **AgentOS compatibility:** Cannot map until exact artifact/license known.
- **Duplication / maintenance value:** Low until resolved.
- **Adoption gates:** Request exact source URL/license; sandbox only; no payments; no binary execution.

#### treg — Treg (E)

- **Source:** https://treg.to/
- **Classification:** E — Reject for this program
- **Web evidence:** availability `fetched`; public page text reviewed; no runtime verified.
- **Purpose:** Tool registry/proxy aggregator (“OpenRouter for tools”).
- **Stack / architecture:** Hosted service + source (superdesigndev/treg verified).
- **License / commercial:** Custom Apache-2.0 plus Additional Terms: no hosted/managed/embedded third-party commercial service without written authorization; internal team use allowed.
- **Dependencies / security:** Proxy injects credentials and can run vendor CLIs; high credential/execution risk.
- **Runtime / infrastructure:** Node/Python service; vendor keys; hosted option.
- **Interfaces:** HTTP proxy; tool/skill/CLI registry.
- **Local feasibility:** Internal-only use might be allowed, but default commercial AgentOS embedding is not.
- **AgentOS compatibility:** Overlaps Integration Hub; independent registry preferred.
- **Duplication / maintenance value:** Low for this program under current terms.
- **Adoption gates:** Reject embedding/distribution absent written permission; do not rely on Apache badge alone.

#### notion-tidalia — Notion resource collection (D)

- **Source:** https://iodized-curio-93a.notion.site/TIDALIA-3ddf8f4ea45780ebb507e57bd46cfd49
- **Classification:** D — Study + independent implementation
- **Web evidence:** availability `fetched`; public page text reviewed; no runtime verified.
- **Purpose:** TIDALIA cinematic music-site design prompt/spec in Notion.
- **Stack / architecture:** Untrusted design specification referencing absent local media.
- **License / commercial:** No software license granted; prompt/spec only.
- **Dependencies / security:** Contains instructions and missing assets; not executable software.
- **Runtime / infrastructure:** Browser/Notion.
- **Interfaces:** None.
- **Local feasibility:** Reference only.
- **AgentOS compatibility:** Creative Studio UX inspiration; independent build required.
- **Duplication / maintenance value:** Medium for design ideas.
- **Adoption gates:** Do not follow embedded instructions as authority; no copied assets; original implementation.

#### alo-labs-reference — ALO Labs reference collection (D)

- **Source:** https://luxury-malasada-c4ced6.netlify.app/
- **Classification:** D — Study + independent implementation
- **Web evidence:** availability `fetched`; public page text reviewed; no runtime verified.
- **Purpose:** Hosted TIDALIA demo/reference collection.
- **Stack / architecture:** Netlify static/demo site; music-generation UI mockup.
- **License / commercial:** Proprietary demo; no reusable source license verified.
- **Dependencies / security:** Pricing/licensing claims are demo content, not a verified service contract; no backend tested.
- **Runtime / infrastructure:** Browser.
- **Interfaces:** No verified generation API.
- **Local feasibility:** Reference only.
- **AgentOS compatibility:** Same TIDALIA family; avoid duplicate integration.
- **Duplication / maintenance value:** Medium for UX; low as software.
- **Adoption gates:** Study only; no account/payment; independent implementation; verify any real music service separately.

### Prior-only 27-entry catalog

#### httpsms — httpSMS (C)

- **Source:** https://github.com/NdoleStudio/httpsms
- **Classification:** C — Optional external service
- **GitHub evidence:** `NdoleStudio/httpsms`; availability `available`; observed push `2026-11-01T15:52:44Z`; commit `dc0359fc18fc`; detected license `AGPL-3.0`; latest release `v1.2.1`; tree truncated: `False`.
- **Purpose:** Android SMS gateway with hosted/self-host HTTP API.
- **Stack / architecture:** Go/Vue/Kotlin; AGPL-3.0.
- **License / commercial:** AGPL-3.0 detected.
- **Dependencies / security:** SMS permissions/consent; provider/device security; network copyleft if modified.
- **Runtime / infrastructure:** Android device + Go service or hosted API.
- **Interfaces:** REST; existing adapter.
- **Local feasibility:** Already integrated as external adapter; no new install.
- **AgentOS compatibility:** Preserve existing Integration Hub adapter.
- **Duplication / maintenance value:** High for SMS; keep optional.
- **Adoption gates:** AGPL review; consent; rate limits; send approval; device hardening.

#### httpsms-node — httpSMS Node client (A)

- **Source:** https://github.com/NdoleStudio/httpsms-node
- **Classification:** A — Direct reuse candidate
- **GitHub evidence:** `NdoleStudio/httpsms-node`; availability `available`; observed push `2026-11-01T10:10:16Z`; commit `3b1985340ce8`; detected license `MIT`; latest release `v0.0.2`; tree truncated: `False`.
- **Purpose:** MIT Node client for httpSMS API.
- **Stack / architecture:** TypeScript/JavaScript client.
- **License / commercial:** MIT detected.
- **Dependencies / security:** Thin client; API key handling; sending is external side effect.
- **Runtime / infrastructure:** Node; lightweight.
- **Interfaces:** SDK over REST.
- **Local feasibility:** Direct reuse feasible if needed.
- **AgentOS compatibility:** Existing generic adapter may suffice; avoid duplicate dependency.
- **Duplication / maintenance value:** Medium.
- **Adoption gates:** Pin version; compare with existing adapter; no sends without approval.

#### domovina-sms — sms.domovina.ai (D)

- **Source:** https://github.com/domovinatv/sms.domovina.ai
- **Classification:** D — Study + independent implementation
- **GitHub evidence:** `domovinatv/sms.domovina.ai`; availability `available`; observed push `2026-05-11T15:37:04Z`; commit `51403b576e91`; detected license `None`; latest release `v0.2.1`; tree truncated: `False`.
- **Purpose:** Example httpSMS deployment with reverse-OTP PoC.
- **Stack / architecture:** Go/Vue/Kotlin subtree + Hono/Bun webhook; Coolify/Oracle ARM/Cloudflare.
- **License / commercial:** No root license detected; upstream httpSMS AGPL subtree.
- **Dependencies / security:** In-memory OTP store; deployment-specific secrets; subtree licensing.
- **Runtime / infrastructure:** ARM cloud + tunnel; example topology only.
- **Interfaces:** Webhook/API example.
- **Local feasibility:** Reference only.
- **AgentOS compatibility:** Useful deployment pattern; not a new gateway.
- **Duplication / maintenance value:** Medium.
- **Adoption gates:** No code reuse without license; independent webhook with durable store; private network.

#### deskcomm — DeskcommCRM (D)

- **Source:** https://github.com/melgarafael/DeskcommCRM
- **Classification:** D — Study + independent implementation
- **GitHub evidence:** `melgarafael/DeskcommCRM`; availability `available`; observed push `2026-11-02T10:45:35Z`; commit `34f35301205d`; detected license `MIT`; latest release `v1.98.0`; tree truncated: `False`.
- **Purpose:** AI sales CRM using WhatsApp via WAHA.
- **Stack / architecture:** Next16/Supabase/PLpgSQL; multi-tenant; MCP.
- **License / commercial:** MIT detected.
- **Dependencies / security:** WAHA is not the official Meta Cloud API path; conflicts with official-API constraint.
- **Runtime / infrastructure:** Node/Supabase; separate service.
- **Interfaces:** REST/MCP; web UI.
- **Local feasibility:** Feasible but duplicates CRM.
- **AgentOS compatibility:** Study CRM/MCP ideas only; do not adopt WAHA.
- **Duplication / maintenance value:** Medium for patterns; low as dependency.
- **Adoption gates:** Official Meta API only; independent implementation; no tenant data mixing.

#### ai-marketing-crm — Ai-Markting-crm (F)

- **Source:** https://github.com/engralaminn-collab/Ai-Markting-crm
- **Classification:** F — Investigate further / blocked
- **Web evidence:** availability `unavailable`; public page text reviewed; no runtime verified.
- **Purpose:** Previously supplied CRM repository.
- **Stack / architecture:** Unavailable (404/private/deleted).
- **License / commercial:** Unknown.
- **Dependencies / security:** Cannot assess.
- **Runtime / infrastructure:** Unknown.
- **Interfaces:** Unknown.
- **Local feasibility:** Not feasible.
- **AgentOS compatibility:** Existing native CRM remains.
- **Duplication / maintenance value:** Unknown.
- **Adoption gates:** Request exact working URL/archive; do not guess replacement.

#### meta-ai — Meta for Developers / AI (C)

- **Source:** https://developer.meta.com/ai
- **Classification:** C — Optional external service
- **Web evidence:** availability `fetch-403`; public page text reviewed; no runtime verified.
- **Purpose:** Meta AI developer documentation portal.
- **Stack / architecture:** Hosted docs; fetch returned 403 in supplemental review.
- **License / commercial:** Meta terms; documentation only.
- **Dependencies / security:** No executable artifact; access restrictions.
- **Runtime / infrastructure:** Browser.
- **Interfaces:** Docs; model/API terms vary.
- **Local feasibility:** Reference only.
- **AgentOS compatibility:** Same vendor family as meta; not a separate runtime.
- **Duplication / maintenance value:** Medium.
- **Adoption gates:** Use official accessible docs; verify model licenses separately; no mandatory dependency.

#### meta-cookbook — Meta Model Cookbook (D)

- **Source:** https://github.com/meta-models/meta-model-cookbook
- **Classification:** D — Study + independent implementation
- **GitHub evidence:** `meta-models/meta-model-cookbook`; availability `available`; observed push `2026-10-24T04:05:26Z`; commit `0a99b987858e`; detected license `MIT`; latest release `none observed`; tree truncated: `False`.
- **Purpose:** Meta model/agent examples and recipes.
- **Stack / architecture:** Python/TS/Swift/Jupyter examples; agent loops, audit, approvals, sandbox patterns.
- **License / commercial:** MIT detected.
- **Dependencies / security:** Examples are not production guarantees; model weights/API terms separate.
- **Runtime / infrastructure:** Varies by recipe; GPU/API per model.
- **Interfaces:** Example code/API patterns.
- **Local feasibility:** Study only.
- **AgentOS compatibility:** Excellent reference for factory/governance patterns; independent core.
- **Duplication / maintenance value:** High for learning; not a dependency.
- **Adoption gates:** Pin examples; review each; no model weights without license; no production credentials.

#### openrouter — OpenRouter (C)

- **Source:** https://openrouter.ai/blog/tutorials/build-tool-calling-agent-loop
- **Classification:** C — Optional external service
- **Web evidence:** availability `fetched`; public page text reviewed; no runtime verified.
- **Purpose:** Model gateway and tool-calling tutorial resource.
- **Stack / architecture:** Hosted API + TypeScript SDK tutorial.
- **License / commercial:** Proprietary service; tutorial content separate.
- **Dependencies / security:** Provider keys; paid/free model routing; data leaves boundary.
- **Runtime / infrastructure:** Vendor cloud; local SDK.
- **Interfaces:** OpenAI-compatible API; SDK; MCP ecosystem.
- **Local feasibility:** Local client, external inference.
- **AgentOS compatibility:** Existing optional provider; not mandatory core.
- **Duplication / maintenance value:** High as optional fallback.
- **Adoption gates:** Budget caps; provider terms; no secret exposure; local-first policy; fallback accuracy labels.

#### runninghub — ComfyUI RunningHub API (F)

- **Source:** https://github.com/HM-RunningHub/ComfyUI_RH_APICall
- **Classification:** F — Investigate further / blocked
- **GitHub evidence:** `HM-RunningHub/ComfyUI_RH_APICall`; availability `available`; observed push `2026-05-09T13:15:17Z`; commit `8fc4f5482123`; detected license `None`; latest release `none observed`; tree truncated: `False`.
- **Purpose:** ComfyUI plugin calling RunningHub cloud workflows.
- **Stack / architecture:** Python/JavaScript ComfyUI nodes.
- **License / commercial:** No license detected.
- **Dependencies / security:** Cloud API key; workflow execution; plugin license unresolved.
- **Runtime / infrastructure:** ComfyUI + RunningHub account.
- **Interfaces:** ComfyUI nodes; cloud API.
- **Local feasibility:** Blocked for reuse until license/terms clarified.
- **AgentOS compatibility:** Optional creative backend only.
- **Duplication / maintenance value:** Medium capability; low until cleared.
- **Adoption gates:** Obtain license; verify cloud terms; isolated ComfyUI; budget; no auto-publish.

#### remotion — Remotion (F)

- **Source:** https://github.com/remotion-dev/remotion
- **Classification:** F — Investigate further / blocked
- **GitHub evidence:** `remotion-dev/remotion`; availability `available`; observed push `2026-11-02T09:20:41Z`; commit `596c2ed0cd3b`; detected license `NOASSERTION`; latest release `v4.0.540`; tree truncated: `False`.
- **Purpose:** Programmatic React video rendering.
- **Stack / architecture:** TypeScript monorepo; native compositor packages; CLI/SDK.
- **License / commercial:** Custom Remotion License: free for individuals/<=3 employees/nonprofits/evaluation; company license otherwise; no derivative resale.
- **Dependencies / security:** Browser/native render deps; template/assets licenses; version 5 license changes noted.
- **Runtime / infrastructure:** Node/Bun; Chromium/native compositor; CPU/GPU.
- **Interfaces:** SDK/CLI/React; render APIs.
- **Local feasibility:** Technically feasible; legal eligibility unresolved.
- **AgentOS compatibility:** Creative render option; overlaps HyperFrames/MoneyPrinter.
- **Duplication / maintenance value:** High capability; blocked pending license.
- **Adoption gates:** Determine entity size/use; obtain company license if required; pin; isolate render; asset rights.

#### pixelle — Pixelle-Video (B)

- **Source:** https://github.com/ATH-MaaS/Pixelle-Video
- **Classification:** B — Adapter required
- **GitHub evidence:** `ATH-MaaS/Pixelle-Video`; availability `available`; observed push `2026-06-14T12:40:58Z`; commit `848b054e4fae`; detected license `Apache-2.0`; latest release `v0.1.15`; tree truncated: `False`.
- **Purpose:** Automated short-video engine with ComfyUI/RunningHub/direct API paths.
- **Stack / architecture:** Python; WebUI/API; TTS/image/video pipelines.
- **License / commercial:** Apache-2.0 detected; model/media/provider terms separate.
- **Dependencies / security:** Many providers; RunningHub license unresolved if used; media rights.
- **Runtime / infrastructure:** Python worker; GPU optional via external providers; ComfyUI optional.
- **Interfaces:** API/WebUI; workflow templates.
- **Local feasibility:** Feasible with cloud providers; local GPU heavier.
- **AgentOS compatibility:** Creative Studio adapter; overlaps MoneyPrinter/OpenShorts.
- **Duplication / maintenance value:** High; choose one engine.
- **Adoption gates:** Pin; select licensed providers; sandbox; asset/model rights; publication approval.

#### videocaptioner — VideoCaptioner (B)

- **Source:** https://github.com/WEIFENG2333/VideoCaptioner
- **Classification:** B — Adapter required
- **GitHub evidence:** `WEIFENG2333/VideoCaptioner`; availability `available`; observed push `2026-09-12T06:20:49Z`; commit `95842ecb5618`; detected license `GPL-3.0`; latest release `v1.4.2`; tree truncated: `False`.
- **Purpose:** Subtitle transcription/translation/burn-in tool.
- **Stack / architecture:** Python CLI/GUI; faster-whisper/whisper-cpp/API; Claude skill.
- **License / commercial:** GPL-3.0 detected.
- **Dependencies / security:** Free translation/ASR endpoints may have terms; media parsing; model licenses.
- **Runtime / infrastructure:** Python worker; GPU optional; desktop GUI optional.
- **Interfaces:** CLI/GUI/skill.
- **Local feasibility:** Feasible on worker; not run here.
- **AgentOS compatibility:** Creative Studio adapter; overlaps Voicebox/Rescript ideas.
- **Duplication / maintenance value:** High for captions.
- **Adoption gates:** GPL compliance if distributed; pin; verify endpoint terms; sandbox media; no DRM bypass.

#### cogvideo — CogVideo (B)

- **Source:** https://github.com/zai-org/CogVideo
- **Classification:** B — Adapter required
- **GitHub evidence:** `zai-org/CogVideo`; availability `available`; observed push `2025-11-04T11:19:04Z`; commit `7a1af7154511`; detected license `Apache-2.0`; latest release `v1.0`; tree truncated: `False`.
- **Purpose:** Text/image-to-video research models and inference code.
- **Stack / architecture:** Python/PyTorch/diffusers; SAT pipelines.
- **License / commercial:** Apache-2.0 code detected; model weights have separate licenses.
- **Dependencies / security:** Large weights; GPU memory; research code quality; weight license verification.
- **Runtime / infrastructure:** CUDA GPU strongly preferred; substantial VRAM/RAM.
- **Interfaces:** Python CLI/API scripts.
- **Local feasibility:** Not feasible on audit host; dedicated GPU required.
- **AgentOS compatibility:** Optional Creative GPU worker.
- **Duplication / maintenance value:** Medium-high if GPU budget exists.
- **Adoption gates:** Verify each weight license; pin; isolate; queue; no production host; benchmark before claims.

#### hunyuanvideo — HunyuanVideo (F)

- **Source:** https://github.com/Tencent-Hunyuan/HunyuanVideo
- **Classification:** F — Investigate further / blocked
- **GitHub evidence:** `Tencent-Hunyuan/HunyuanVideo`; availability `available`; observed push `2026-10-08T08:57:37Z`; commit `4eda9cb44c3b`; detected license `NOASSERTION`; latest release `none observed`; tree truncated: `False`.
- **Purpose:** Large video generation model/code.
- **Stack / architecture:** Python/PyTorch; weights and inference code.
- **License / commercial:** Tencent Hunyuan Community License; territory excludes EU/UK/South Korea; custom use conditions.
- **Dependencies / security:** Custom license/acceptable use; large weights; GPU; derivative rules.
- **Runtime / infrastructure:** Large CUDA GPU; not audit host.
- **Interfaces:** Python scripts; model weights.
- **Local feasibility:** Technically possible on GPU; legal review required.
- **AgentOS compatibility:** Optional Creative GPU worker.
- **Duplication / maintenance value:** Medium; license complexity.
- **Adoption gates:** Territory/use review; weight license; pin; isolate; benchmark; no EU/UK/KR deployment under this license.

#### infinitetalk — InfiniteTalk (B)

- **Source:** https://github.com/MeiGen-AI/InfiniteTalk
- **Classification:** B — Adapter required
- **GitHub evidence:** `MeiGen-AI/InfiniteTalk`; availability `available`; observed push `2026-05-22T02:35:51Z`; commit `50aa0a941843`; detected license `Apache-2.0`; latest release `none observed`; tree truncated: `False`.
- **Purpose:** Audio-driven talking video generation/dubbing.
- **Stack / architecture:** Python/PyTorch; image/video-to-video pipelines.
- **License / commercial:** Apache-2.0 code detected; weights separate.
- **Dependencies / security:** Portrait/voice consent; large models; GPU.
- **Runtime / infrastructure:** CUDA GPU; substantial VRAM.
- **Interfaces:** Python scripts.
- **Local feasibility:** Dedicated GPU only.
- **AgentOS compatibility:** Optional Creative worker; overlaps CogVideo/Hunyuan.
- **Duplication / maintenance value:** Medium-high for dubbing.
- **Adoption gates:** Weight licenses; consent; pin; isolate; queue; no impersonation without permission.

#### reddit-video — RedditVideoMakerBot (D)

- **Source:** https://github.com/elebumm/RedditVideoMakerBot
- **Classification:** D — Study + independent implementation
- **GitHub evidence:** `elebumm/RedditVideoMakerBot`; availability `available`; observed push `2026-10-30T10:12:51Z`; commit `569f25098a64`; detected license `GPL-3.0`; latest release `3.4.0`; tree truncated: `False`.
- **Purpose:** Automated Reddit-story video maker.
- **Stack / architecture:** Python 3.10; Playwright; TTS/media pipeline.
- **License / commercial:** GPL-3.0 detected.
- **Dependencies / security:** Scrapes Reddit; content rights; experimental install scripts; platform terms.
- **Runtime / infrastructure:** Python + browser; modest CPU.
- **Interfaces:** CLI.
- **Local feasibility:** Study only.
- **AgentOS compatibility:** Overlaps MoneyPrinter/Pixelle; independent pipeline preferred.
- **Duplication / maintenance value:** Medium for ideas.
- **Adoption gates:** No copied Reddit content without rights; GPL review; no shell installers; official APIs where required.

#### videorecorder — VideoRecorder (D)

- **Source:** https://github.com/qdrzwd/VideoRecorder
- **Classification:** D — Study + independent implementation
- **GitHub evidence:** `qdrzwd/VideoRecorder`; availability `available`; observed push `2023-08-08T09:37:01Z`; commit `3323b0021702`; detected license `Apache-2.0`; latest release `none observed`; tree truncated: `False`.
- **Purpose:** Old Android video-recording sample.
- **Stack / architecture:** Java Android; camera/audio encoding sample.
- **License / commercial:** Apache-2.0 detected.
- **Dependencies / security:** Old Android APIs; camera/mic permissions; unmaintained sample.
- **Runtime / infrastructure:** Android device/emulator; legacy SDK.
- **Interfaces:** Android sample code.
- **Local feasibility:** Reference only.
- **AgentOS compatibility:** Modern Android skills supersede it.
- **Duplication / maintenance value:** Low.
- **Adoption gates:** Study concepts only; use current SDK; authorized devices; no production keystore.

#### youtube-dl — youtube-dl (B)

- **Source:** https://github.com/ytdl-org/youtube-dl
- **Classification:** B — Adapter required
- **GitHub evidence:** `ytdl-org/youtube-dl`; availability `available`; observed push `2026-10-30T13:24:03Z`; commit `f40489ee7eea`; detected license `Unlicense`; latest release `2021.12.17`; tree truncated: `False`.
- **Purpose:** Command-line video downloader.
- **Stack / architecture:** Python; site extractors.
- **License / commercial:** Unlicense detected.
- **Dependencies / security:** Site terms/DRM/copyright; extractor attack surface; frequent updates.
- **Runtime / infrastructure:** Python; network; storage.
- **Interfaces:** CLI/Python embed.
- **Local feasibility:** Feasible for authorized media only.
- **AgentOS compatibility:** Research/Creative ingestion adapter; not a rights grant.
- **Duplication / maintenance value:** Medium.
- **Adoption gates:** Allowlist owned/authorized URLs; no DRM/paywall bypass; sandbox; scan downloads; retain rights metadata.

#### claude-video — claude-video (B)

- **Source:** https://github.com/bradautomates/claude-video
- **Classification:** B — Adapter required
- **GitHub evidence:** `bradautomates/claude-video`; availability `available`; observed push `2026-09-25T01:25:54Z`; commit `03ceb42f7fa2`; detected license `MIT`; latest release `v0.3.2`; tree truncated: `False`.
- **Purpose:** Give agents timestamped video evidence (frames/transcript).
- **Stack / architecture:** Python/Shell; yt-dlp/WhisperX/Groq/OpenAI options; skills.
- **License / commercial:** MIT detected; underlying tools/models separate.
- **Dependencies / security:** Downloads/transcription send data to providers; media parsing; skill instructions.
- **Runtime / infrastructure:** Python worker; optional GPU/API.
- **Interfaces:** Skill/CLI; Claude/Codex hosts.
- **Local feasibility:** Feasible on worker.
- **AgentOS compatibility:** Research/RE evidence adapter.
- **Duplication / maintenance value:** High for video understanding.
- **Adoption gates:** Pin; authorized media; provider consent; sandbox; no automatic installs.

#### videocode — VideoCode (D)

- **Source:** https://github.com/MarkTechStation/VideoCode
- **Classification:** D — Study + independent implementation
- **GitHub evidence:** `MarkTechStation/VideoCode`; availability `available`; observed push `2025-08-13T14:02:31Z`; commit `b05293d86aa3`; detected license `None`; latest release `none observed`; tree truncated: `False`.
- **Purpose:** Tutorial example-code collection.
- **Stack / architecture:** Jupyter/Python/JS/CSS examples.
- **License / commercial:** No license detected.
- **Dependencies / security:** Tutorial code not production-ready; no reuse permission.
- **Runtime / infrastructure:** Varies.
- **Interfaces:** None stable.
- **Local feasibility:** Reference only.
- **AgentOS compatibility:** Learning resource, not component.
- **Duplication / maintenance value:** Low-medium.
- **Adoption gates:** No code copying without permission; independent implementation.

#### 3b1b-videos — 3b1b/videos (D)

- **Source:** https://github.com/3b1b/videos
- **Classification:** D — Study + independent implementation
- **GitHub evidence:** `3b1b/videos`; availability `available`; observed push `2026-09-29T14:42:56Z`; commit `306a1346a356`; detected license `NOASSERTION`; latest release `none observed`; tree truncated: `False`.
- **Purpose:** Manim scene code for 3Blue1Brown videos.
- **Stack / architecture:** Python/Manim; Lean/GLSL/WGSL scenes.
- **License / commercial:** CC BY-NC-SA 4.0 repository content; Manim library itself MIT.
- **Dependencies / security:** Noncommercial/sharealike; older scenes may not run; media assets separate.
- **Runtime / infrastructure:** Python/Manim; LaTeX/render deps.
- **Interfaces:** Scene scripts.
- **Local feasibility:** Study only for commercial product.
- **AgentOS compatibility:** Animation technique reference; not reusable commercial assets.
- **Duplication / maintenance value:** Medium for learning.
- **Adoption gates:** No commercial copying; independent scenes; attribute if permitted use; verify Manim license.

#### linphone — Linphone iPhone (C)

- **Source:** https://github.com/BelledonneCommunications/linphone-iphone
- **Classification:** C — Optional external service
- **GitHub evidence:** `BelledonneCommunications/linphone-iphone`; availability `available`; observed push `2026-10-29T16:39:23Z`; commit `7d506a3d890f`; detected license `GPL-3.0`; latest release `none observed`; tree truncated: `False`.
- **Purpose:** SIP softphone for iOS.
- **Stack / architecture:** Swift/Xcode; Linphone SDK via SPM.
- **License / commercial:** Dual GPL-3.0 or paid proprietary license.
- **Dependencies / security:** SIP credentials; call privacy; SDK licensing; Apple build requirements.
- **Runtime / infrastructure:** macOS/Xcode/iOS; SIP provider.
- **Interfaces:** App; SDK; SIP.
- **Local feasibility:** Workstation/mobile build only.
- **AgentOS compatibility:** Optional external voice tool; not web core.
- **Duplication / maintenance value:** Medium if SIP needed.
- **Adoption gates:** Choose GPL/commercial path; SIP provider terms; consent/recording laws; no embedded closed reuse without license.

#### voip-privacy — VoIP (0perationPrivacy) (C)

- **Source:** https://github.com/0perationPrivacy/VoIP
- **Classification:** C — Optional external service
- **GitHub evidence:** `0perationPrivacy/VoIP`; availability `available`; observed push `2026-07-29T07:21:39Z`; commit `e4a3885e0c58`; detected license `GPL-3.0`; latest release `none observed`; tree truncated: `False`.
- **Purpose:** Self-hosted Twilio/Telnyx VoIP/SMS web interface.
- **Stack / architecture:** JavaScript/Vue; provider APIs.
- **License / commercial:** GPL-3.0 detected.
- **Dependencies / security:** Provider keys; call/SMS privacy; web auth; copyleft.
- **Runtime / infrastructure:** Node/web server; Twilio/Telnyx account.
- **Interfaces:** Web UI; provider APIs.
- **Local feasibility:** Separate service feasible.
- **AgentOS compatibility:** Optional external comms; overlaps native messaging.
- **Duplication / maintenance value:** Medium.
- **Adoption gates:** GPL review; isolate; provider consent; recording laws; send/call approval.

#### voip-sample — VoIP-Call-Sample (D)

- **Source:** https://github.com/developerspace-samples/VoIP-Call-Sample
- **Classification:** D — Study + independent implementation
- **GitHub evidence:** `developerspace-samples/VoIP-Call-Sample`; availability `available`; observed push `2022-07-16T12:19:40Z`; commit `6151e003e467`; detected license `Apache-2.0`; latest release `none observed`; tree truncated: `False`.
- **Purpose:** Android ConnectionService VoIP sample.
- **Stack / architecture:** Java/Kotlin; CometChat + Firebase.
- **License / commercial:** Apache-2.0 detected; CometChat/Firebase terms separate.
- **Dependencies / security:** Old sample; provider SDK keys; call permissions.
- **Runtime / infrastructure:** Android Studio/device; Firebase/CometChat.
- **Interfaces:** Android sample.
- **Local feasibility:** Reference only.
- **AgentOS compatibility:** Modern implementation preferred.
- **Duplication / maintenance value:** Low-medium.
- **Adoption gates:** Study ConnectionService; verify current SDK terms; authorized test calls only.

#### ipftrace2 — ipftrace2 (B)

- **Source:** https://github.com/YutaroHayakawa/ipftrace2
- **Classification:** B — Adapter required
- **GitHub evidence:** `YutaroHayakawa/ipftrace2`; availability `available`; observed push `2024-04-14T02:35:14Z`; commit `4bd7dcfbbd8b`; detected license `NOASSERTION`; latest release `v0.10.1`; tree truncated: `False`.
- **Purpose:** Linux kernel packet-function tracing.
- **Stack / architecture:** C/Lua/eBPF; x86_64; kernel BTF/kprobes/perf/BPF.
- **License / commercial:** Dual GPL-2.0-only OR BSD-2-Clause (README says GPL-2.0; SPDX-style dual line present).
- **Dependencies / security:** Requires privileged kernel tracing; never on production; kernel attack surface.
- **Runtime / infrastructure:** Linux x86_64 >=4.17 with BTF/kprobes/BPF; root/caps.
- **Interfaces:** CLI.
- **Local feasibility:** Disposable VM only.
- **AgentOS compatibility:** RE/infra diagnostics lab adapter.
- **Duplication / maintenance value:** Medium for authorized network debugging.
- **Adoption gates:** License clarification; privileged VM; no production; pin; capture redaction.

#### electron-ipc — electron-promise-ipc (D)

- **Source:** https://github.com/sibnerian/electron-promise-ipc
- **Classification:** D — Study + independent implementation
- **GitHub evidence:** `sibnerian/electron-promise-ipc`; availability `available`; observed push `2023-03-04T02:44:15Z`; commit `72bb077904ae`; detected license `MIT`; latest release `v2.2.1`; tree truncated: `False`.
- **Purpose:** Promise-style Electron IPC library.
- **Stack / architecture:** TypeScript/JavaScript; Electron main/renderer.
- **License / commercial:** MIT detected.
- **Dependencies / security:** Old (2023) and Electron IPC is a privilege boundary; renderer must not get arbitrary main access.
- **Runtime / infrastructure:** Electron app.
- **Interfaces:** IPC library.
- **Local feasibility:** Reference only; not needed for web AgentOS.
- **AgentOS compatibility:** Native shell pattern only.
- **Duplication / maintenance value:** Low.
- **Adoption gates:** If desktop shell later, implement typed allowlisted IPC; no arbitrary file/shell handlers.

#### wifi-cracker — WiFi-Password-Cracker-Pro (E)

- **Source:** https://github.com/YouBTech01/WiFi-Password-Cracker-Pro
- **Classification:** E — Reject for this program
- **GitHub evidence:** `YouBTech01/WiFi-Password-Cracker-Pro`; availability `available`; observed push `2025-02-09T14:34:32Z`; commit `219623edfaea`; detected license `MIT`; latest release `WIFI-Crack-Release-1.0`; tree truncated: `False`.
- **Purpose:** Wi-Fi password cracking/strength tool.
- **Stack / architecture:** Python/pywifi/tkinter; executable promotion.
- **License / commercial:** MIT detected.
- **Dependencies / security:** Offensive network access tooling; untrusted executable; outside authorized scope.
- **Runtime / infrastructure:** Desktop with Wi-Fi hardware.
- **Interfaces:** CLI/GUI/executable.
- **Local feasibility:** Do not run.
- **AgentOS compatibility:** Excluded from AgentOS/RE lab.
- **Duplication / maintenance value:** Negative for this program.
- **Adoption gates:** Reject; no download/execution; authorized security testing requires separate scope and tools.

## Cross-cutting findings

1. **Do not install the catalog wholesale.** Most value is in a small set of skills, adapters and optional workers; several entries duplicate existing CRM/email/analytics/video functions.
2. **License badges are insufficient.** Dify, Treg, Remotion, HunyuanVideo, Rescript and VoiceStudio have custom or composite terms. Model weights, templates, fonts, media and plugins need separate clearance.
3. **Sandbox claims are not security guarantees.** Container mounts projects read-write; Text-to-CAD explicitly lets a sandboxed agent reach a daemon outside the sandbox; RE tools process hostile inputs.
4. **Modest hardware remains viable only with queues and routing.** Audit host has 2 CPUs/~3.9GB RAM/~15GB free disk and no Docker/Podman/Ghidra. OpenShorts documents 8GB+; Postiz requires an exact newer Node patch; GPU video models are not local candidates here.
5. **Official WhatsApp only.** WACRM is a useful official-API reference; Deskcomm/WAHA and unofficial automation are not approved paths.
6. **External services are optional.** TestSprite, CodeRabbit, Tripo, Riverside, Supabase, ngrok, analytics and model gateways require vendor/privacy/budget review and must not become hidden core dependencies.
7. **No local inference is verified.** Existing `local-grounded` synthesis is deterministic fallback, not a configured local model. Ollama support is code, not proof of a running model.
8. **Maintenance is a snapshot.** Push/release dates show activity, not quality or security. Pin commits, verify signatures, scan dependencies and re-review before adoption.

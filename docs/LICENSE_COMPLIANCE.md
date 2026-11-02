# AgentOS Phase 0 — License Compliance

> Engineering compliance register, not legal advice. Detected SPDX labels are evidence, not clearance. Commercial use, redistribution, hosting, model weights, templates, fonts, media and plugins require separate review.

## Rules

1. No vendoring without a verified license and NOTICE/attribution plan.
2. Pin exact commits/releases; record hash, license text, copyright notices and source URL.
3. Treat app code, model weights, datasets, templates, fonts, media and plugins as separate licensed objects.
4. GPL/AGPL side services stay process-isolated; modifications and network use trigger legal review before deployment.
5. Noncommercial/custom terms block commercial embedding unless a separate written license is obtained.
6. Generated output is not automatically free of third-party rights; retain provenance and require human publication approval.
7. Missing license = no reuse permission (F), even if source is public.

## High-risk / custom terms

| Resource | Observed terms | Consequence | Decision |
|---|---|---|---|
| Dify | Modified Apache-2.0; no unauthorized multi-tenant service; frontend logo/copyright retention | Not plain Apache; SaaS/embedding constraints | Optional external only; legal review before any commercial hosting |
| Treg | Apache-2.0 plus Additional Terms; no hosted/managed/embedded third-party commercial service without written permission; internal team use allowed | Apache badge alone is misleading for product embedding | E for default commercial AgentOS embedding |
| Remotion | Custom free/company license; entity-size and use-case conditions; no derivative resale | Commercial eligibility unresolved | F until entity/use cleared |
| Rescript | Current PolyForm Noncommercial 1.0.0; older MIT releases remain MIT | Current code cannot be commercially embedded | E for current-code reuse |
| HunyuanVideo | Tencent community license; territory excludes EU/UK/South Korea; acceptable-use/derivative terms | Not a generic open-source grant | F; territory/use review |
| VoiceStudio | App AGPL-3.0-only or paid closed license; weights include CC-BY-NC/community terms | App license does not clear weights | C optional; per-model clearance |
| OpenShorts | App MIT; composite AGPL Ultralytics + Remotion terms + model weights | Composite commercial clearance missing | F |
| 3b1b/videos | CC BY-NC-SA 4.0 content; Manim library MIT | Commercial scene/asset copying blocked | D study only |
| Tripo | Proprietary terms; lawful commercial outputs allowed but competing-service and third-party API availability restrictions | Output use is not unlimited redistribution | C optional; vendor agreement |
| Riverside | Proprietary; competitor/benchmarking restrictions; hosting/content license | Service use only under terms | C optional |
| TIDALIA/ALO demo | Design prompt/demo; no software license verified | No code/asset reuse rights | D reference only |

## Copyleft / network-copyleft register

| Resource | License | Engineering boundary |
|---|---|---|
| httpSMS | AGPL-3.0 | External service; preserve adapter; review modified hosted source obligations |
| Postiz | AGPL-3.0 | Separate service; no code vendoring; source/notice plan if modified |
| Mailcheap | AGPL-3.0 | Separate service; email consent/approval controls |
| VoiceStudio | AGPL-3.0-only / commercial | Separate app/service or paid license; weights separate |
| Kdenlive | GPL-3.0 | Desktop tool; no server embedding |
| OBS | GPL-2.0 | Desktop tool; plugin licenses separate |
| VideoCaptioner | GPL-3.0 | Isolated worker; distribution review |
| RedditVideoMakerBot | GPL-3.0 | Study only; content rights separate |
| Linphone | GPL-3.0 / proprietary | Choose license path before SDK embedding |
| VoIP (0perationPrivacy) | GPL-3.0 | Separate service |
| AnyPS5 | GPL-2.0-only | Excluded from program |
| ipftrace2 | GPL-2.0-only OR BSD-2-Clause line; README GPL-2.0 | Clarify before redistribution; lab-only |

## Permissive candidates (still gated)

MIT/Apache/BSD candidates include REA, OpenCode, Scrapling, CLI-Anything, Pocock skills, Ruflo, Claude plugins, Android skills, Scientific skills, Delegate Router, Container, OpenSMS, Voicebox, MoneyPrinter, Presenton, OpenSEO, WACRM, HyperFrames, Diagram Design, Text-to-CAD, httpSMS Node client, Meta cookbook, Pixelle, CogVideo code, InfiniteTalk code, VideoRecorder, youtube-dl, claude-video, VoIP sample, electron-promise-ipc. **Bundled tools, models, assets and dependencies are not cleared by this list.**

## Unknown / unavailable

AI Memory, Kapathi, dead CRM, Domovina SMS root, RunningHub plugin, VideoCode, Cursor root license, Buildonaut downloads, SwiftUI Skills, God’s Eye View GitHub and shortened promotional/video links remain F. Public visibility is not a license.

## Existing repository dependency license snapshot

- Root project LICENSE: **absent**. Ownership/licensing decision required before external distribution.
- Direct dependencies: **87/87** had installed package manifests matching lockfile versions with a license field.
- Lockfile dependency entries: **1,243**; **1,100** had installed matching manifests with license fields; **143** remain unverified (often optional/platform-specific or not installed). This is not a full transitive clearance.
- Notable direct declarations: `@reactuses/core` Unlicense; `dotenv` BSD-2-Clause; `nodemailer` MIT-0; Prisma Apache-2.0; most others MIT.
- Mini-service lockfiles and external catalog dependencies were **not** exhaustively audited.

## Adoption checklist

- [ ] Exact source/version/hash recorded
- [ ] License + NOTICE + attribution reviewed
- [ ] Commercial/hosting/redistribution rights confirmed
- [ ] Model weights/datasets/templates/fonts/media cleared
- [ ] Dependency/advisory scan reviewed
- [ ] Sandbox/egress/secret boundary designed
- [ ] Human approval recorded
- [ ] SBOM and license register updated

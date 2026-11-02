# Integration Hub

`/admin/integrations` (System → Integration Hub) is a verified catalog of every
external project you shared, plus a safe way to connect the ones that expose an
API. It is driven by your own agents and the existing auth/RBAC/audit stack — no
new external dependency is required to run the platform itself.

## What was verified

All 40 GitHub repositories were checked against the GitHub API for existence,
license, primary language and size. Two non-repo links (OpenRouter tutorial, Meta
for Developers) were treated as official API references. Results:

- **39 repositories resolved.** One did not: `engralaminn-collab/Ai-Markting-crm`
  returned **404** at verification time. It is listed as `unavailable`; nothing
  was integrated from a dead link. Share a working/private URL to re-verify.
- Duplicate links (`qdrzwd/VideoRecorder`, `mutonby/openshorts`, `ArnasDon/wacrm`)
  were de-duplicated to a single entry each.

## How each project connects (the honest part)

We do **not** copy these codebases into this platform. Many are GPL/AGPL, GB-scale,
or native desktop/GPU projects (C/C++/Swift/Java/Python). Vendoring them would
break their licenses and this build. Instead every entry has an explicit mode:

| Mode | Meaning | Examples |
|---|---|---|
| `adapter` | We ship an independently-written HTTP client + live connection test against an official API. | httpSMS, OpenRouter, Meta Graph |
| `service` | You self-host the project, then connect it here by base URL + key. | Postiz, Dify, WACRM, MoneyPrinterTurbo, OpenSEO, Mailcheap, Presenton, RunningHub, OpenSMS, Pixelle, OpenShorts, Voicebox, DeskcommCRM, VoIP |
| `reference` | Documentation/recipes to study; not a runtime dependency. | Meta Cookbook, Scrapling, Remotion, youtube-dl, electron-promise-ipc, claude-video, 3b1b/videos, VideoCode, container, httpSMS-node, VoIP-Call-Sample |
| `desktop` | Runs on a workstation/GPU; cannot be embedded in a web server. | OBS, Kdenlive, Linphone, CogVideo, HunyuanVideo, InfiniteTalk, VideoCaptioner, Rescript, RedditVideoMakerBot, VideoRecorder |
| `unavailable` | Link did not resolve. | Ai-Markting-crm |
| `excluded` | Intentionally not integrated. | WiFi-Password-Cracker-Pro |

### Licensing boundaries

- **GPL/AGPL** projects (httpSMS server, Postiz, Mailcheap, OBS, Kdenlive, Linphone,
  VideoCaptioner, RedditVideoMakerBot, VoIP) are connected as **external services**
  or listed as desktop/reference. Their code is never copied in. An HTTP client
  that talks to a copyleft *service* over its public API does not inherit that
  service's license.
- **Custom/company licenses** (Remotion, Dify, HunyuanVideo) are flagged so you can
  review commercial-use terms before connecting.
- **No license asserted** (sms.domovina.ai, RunningHub plugin, Rescript, VideoCode,
  3b1b/videos) are treated as external/reference only — never vendored.

### Safety exclusion

`WiFi-Password-Cracker-Pro` is **excluded**. Cracking Wi-Fi credentials you do not
own or have authorization to test is unauthorized access. It is listed for
transparency only and has no connector.

## Connecting an integration

1. Open **System → Integration Hub**, find a `Native adapter` or `Self-host + connect` card.
2. Click **Configure**, enter the base URL and/or API key, toggle **Enable**, **Save**.
3. Click **Test connection** to run a bounded live probe.

Secrets are encrypted at rest (AES-256-GCM, the same helper used by AI provider
keys) and stored in the existing `Setting` table under `integration:<id>:<field>`.
No schema migration is needed. The API only ever returns masked secrets; leaving a
secret blank on save keeps the existing value.

## Security model

- `GET /api/v1/admin/integrations` requires `integration_settings.view`.
- `PUT /api/v1/admin/integrations` and `POST .../:id/test` require
  `integration_settings.update`, are same-origin guarded, rate-limited and audited.
- Connection tests use a hard 12s timeout, do **not** follow redirects, and block
  the cloud link-local metadata endpoint (`169.254.169.254`,
  `metadata.google.internal`). Only `http`/`https` base URLs are accepted.
- Tests never return raw secrets or full upstream bodies.

## What is and isn't live

- The **registry, configuration, encryption, masking, RBAC, audit and connection
  test runner** are fully implemented and covered by tests.
- A connection test only succeeds when the target is reachable from the server and
  the credentials are valid. In this sandbox, outbound access is restricted, so
  tests against public hosts return a structured "could not reach" result rather
  than a false success. On your own host with network access and real keys, the
  adapters probe the official endpoints (`/v1/users/me`, `/api/v1/key`, Graph `/me`).
- `service` connectors currently verify **reachability + auth**. Wiring each
  self-hosted product's specific send/generate endpoints is a follow-up once you
  confirm which services you actually deploy and their exact API shapes. We do not
  fabricate a "sent"/"generated" result for an endpoint we have not confirmed.

## Verification

- `npm run typecheck` — pass
- `npm run lint` — 0 errors (existing warnings only)
- `npm run build` — pass (358 pages, including `/admin/integrations`)
- `npm test` — **347 passed** (registry integrity, connector fail-closed/SSRF/auth,
  UI render + configure + test, agent registry now 63 dashboards)
- Live API flows: anonymous 401 + no-store, cross-origin PUT blocked, secret
  encrypted at rest + masked, blank-keeps-existing, reference-only config blocked,
  structured connection-test result, metadata SSRF blocked.

# Integrated Command Center kits

All ten workspaces are available from **Admin → Integrated Kits** and the
Command Center launchpad. They share the existing authentication, RBAC, audit
logging, database, navigation and design system.

| Workspace | Route | Persistent capability |
|---|---|---|
| AI Diagram Designer | `/admin/diagrams` | Editable nodes/edges, templates, AI drafts, SVG export, saved documents |
| Interactive CRM Pipeline | `/admin/crm` | Existing contacts/opportunities, search, drag-and-drop and accessible stage selectors |
| Marketing Campaign Kit | `/admin/marketing` | Briefs, budgets, channels, dates, UTM attribution, linked email/social content |
| SEO Engine Audit | `/admin/seo-dashboard` | Same-site public HTML metadata/content audit and saved reports |
| Content Humanizer | `/admin/ai-assistant/humanizer` | Tone-based rewriting, editable output, saved drafts |
| Email Campaign Builder | `/admin/email-builder` | Safe templates, personalization, account-only tests, consent-based queue |
| System Analytics | `/admin/analytics-dashboard` | Cookie-less traffic, conversions, sources/pages, role-gated system health |
| Video Storyboard Studio | `/admin/video-studio` | Timed scenes, dialogue, AI drafts, saved scripts, text export |
| Social Media Scheduler | `/admin/social-scheduler` | Calendar/list, account targets, approval, guarded official-API publishing |
| Live Support Desk | `/admin/live-chat` | Website widget, persistent conversations, staff replies, status tracking |

## Deliberate boundaries

- AI uses the existing free-provider router. If no generative provider is
  available, the API returns a clear 503; it never fabricates an AI result.
  Manual editors and templates remain usable.
- SEO is a bounded same-site HTML audit, not a ranking tracker, Lighthouse run,
  crawler or Core Web Vitals measurement. Private/admin paths are rejected.
- Email delivery requires SMTP or Resend, confirmed subscribers and consent.
  Test sends go only to the signed-in account email. Queue claims are atomic;
  retries are bounded; every campaign includes an unsubscribe link. Unsubscribe
  requires a confirmation POST, so link prefetchers cannot withdraw consent.
- Social publishing requires approval, a future schedule, a connected account
  with a valid token and publishing capability, and the independent publishing
  switch. Editing approved copy resets target approval/state. Facebook feed and
  Instagram image publishing use official Graph endpoints. Other platforms are
  explicitly unsupported rather than simulated. Auto-replies have a separate
  switch. Ambiguous provider failures require reconciliation before retrying.
- Live support uses hashed bearer capabilities and polling, not a third-party
  chat service. Visitor tokens stay in session storage; staff access is gated.
  Closing the browser may lose an anonymous visitor's capability by design.
- Analytics honors DNT and uses no tracking cookie. KPI totals come from database
  aggregates; detailed charts are capped at 50,000 recent events. This is not a
  claim of complete bot filtering or cross-device identity.
- Video Studio creates scripts/storyboards; it does not render video or claim
  integration with a video-generation provider.

## Workers and production configuration

Configure the existing SMTP/Resend, social OAuth/token encryption and AI-provider
settings through the hosting environment/admin settings. Never put secrets in
client code or commit `.env`.

Call these endpoints from a trusted scheduler using
`x-cron-secret: $CRON_SECRET` (keep the secret out of URLs and logs):

- `/api/cron/email-queue` — recommended every minute.
- `/api/cron/social-publish` — recommended every minute.

Both reject unauthenticated calls. The workers are bounded and persistent but
were not exercised against real external providers in this workspace.

## Verification and rollout

- Production Next.js build succeeds; all ten routes are present in the manifest.
- TypeScript and ESLint pass (the existing repository still has lint warnings).
- Vitest covers contracts, RBAC boundaries, email rendering/worker safeguards,
  schema parity, all ten UI shells, diagram saving, email CTA persistence and
  visitor-token persistence. Authenticated HTTP flows cover CRUD and guardrails.
- Browser automation was unavailable in the sandbox (Chromium/native library
  downloads blocked). Component tests are not a substitute for a final visual,
  keyboard and mobile review in a real browser.
- SQLite migrations were applied to a clean database. MySQL schema/SQL were
  structurally checked but not executed against MySQL here. Rehearse the MySQL
  migration on staging and review live-provider delivery before production.

No live deployment, DNS change, external account connection or real email/social
send is performed by this repository change.

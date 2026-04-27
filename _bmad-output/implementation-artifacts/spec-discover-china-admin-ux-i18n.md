---
title: 'Discover China, Admin DC, UX Glass, I18N Preferences'
type: 'feature'
created: '2026-04-27'
status: 'dev-reviewed-with-gaps'
baseline_commit: '52cddb207ab84cff401df7c27875e1f3d8eb0318'
context:
  - '/opt/projects/zhiyu/planning/rules.md'
  - '/opt/projects/zhiyu/planning/prds/02-discover-china/01-functional-requirements.md'
  - '/opt/projects/zhiyu/planning/prds/02-discover-china/02-data-model-api.md'
  - '/opt/projects/zhiyu/planning/prds/02-discover-china/03-acceptance-criteria.md'
  - '/opt/projects/zhiyu/planning/prds/12-admin/01-functional-requirements.md'
  - '/opt/projects/zhiyu/planning/prds/15-i18n/01-functional-requirements.md'
  - '/opt/projects/zhiyu/content/china/00-index.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The current app has placeholder Discover China, weak generic glass UI, missing visible Chinese cultural direction, no explicit profile language/pinyin controls, no same-page article translation switching, and no real Admin Discover China workbench. This violates DC-FR-001~016, AD-FR-006/008, I18N-FR-003/004, UA-FR-007/013, and the user request to align interactions with Stitch-like glass components without copying its palette.

**Approach:** Implement the full local dev slice inside `/opt/projects/zhiyu/system`: richer shared glass components and dynamic ink-flow background, content-backed 12-category Discover China with sentence-level reading and preferences, backend APIs/state for progress/favorites/notes/ratings/search/share/admin CRUD/review/import/audit, admin DC screens, seed/migration support, and PRD coverage audit docs.

## Boundaries & Constraints

**Always:** All executable changes stay under `/opt/projects/zhiyu/system`; UX planning docs may be updated under `/opt/projects/zhiyu/planning/ux`. Cite PRD source in code-adjacent implementation notes and final audit. Use Docker-only validation commands. Keep every generated/updated file under 800 lines. Respect `content/china/00-index.md` category order and anonymous access: first 3 categories only, login unlocks all 12.

**Ask First:** Only halt for destructive git operations, external SaaS/provider integration, production/staging deployment, or schema choices that would delete existing user data.

**Never:** No GitHub workflows, no hosted CI, no external visual testing cloud, no real AI/TTS/payment dependency, no implementation outside `system/`, no pretending partial implementation is complete.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|---------------|----------------------------|----------------|
| Anonymous open category | `/en/discover/festivals` with no token | Login-unlock panel, no article body/sentence/audio leakage | record `discover_gate` event with anon/device fields |
| Logged-in open category | token for active user | all 12 categories and articles readable | 401 clears token and returns login path |
| Language switch | profile or page switch from en to vi/th/id | UI path prefix updates and article translations/sentence translations change in place; missing translation falls back en | fallback badge/state remains non-blocking |
| Sentence interaction | click/keyboard/long press sentence | audio state, menu, note/favorite/copy controls visible and usable | note limited to 500 chars, errors shown inline |
| Admin write | editor/admin publishes, copies, imports, edits sentence/category/article | backend mutates local state and writes audit log | RBAC blocks non-writers; redline blocks forbidden content |
| Search/filter | keyword/hsk/length/sort/page | paginated highlighted results respecting anonymous gate | 0 results empty state |

</frozen-after-approval>

## Code Map

- `system/packages/ui/src/index.tsx` -- shared Button/Card/Input/SentenceCard controls and PRD-coded interaction primitives.
- `system/packages/ui/src/styles/tokens.css` -- global material tokens, dynamic ink-flow background, language/font variables.
- `system/packages/ui/src/styles/components.css` -- Stitch-like glass buttons, cards, tabs, popovers, audio, table interactions.
- `system/apps/web/src/App.tsx` -- locale routing, theme/lang handling, discover/search/profile route wiring.
- `system/apps/web/src/pages/DiscoverPages.tsx` -- `/discover`, category list, article reader, sentence interactions, search.
- `system/apps/web/src/pages/AuthPages.tsx` -- profile language, pinyin, translation, font, TTS preferences and user stats/favorites/notes links.
- `system/apps/admin/src/AdminApp.tsx` -- Admin DC route/list/category/article/sentence/review/import/access model UI.
- `system/packages/backend/src/runtime/state.ts` -- local dev data model and seed-backed state for 12 categories/articles/sentences.
- `system/packages/backend/src/modules/app-api.ts` -- public and user Discover APIs plus telemetry, progress, favorites, notes, ratings, share.
- `system/packages/backend/src/modules/admin-api.ts` -- Admin DC CRUD/review/import/publish/version/preview/audit endpoints.
- `system/packages/db/*` -- migration table list and `seed:discover-china` JSON fixtures.
- `planning/ux/*.md` and `system/docs/*` -- updated UX source of truth and PRD coverage audit.

## Tasks & Acceptance

**Execution:**
- [ ] `planning/ux/*` and `system/docs/ux-global-guidelines.md` -- document Stitch-like glass interaction rules, dynamic ink-flow, and Chinese cultural tokens -- source: UX docs + user request.
- [ ] `system/packages/ui/*` -- implement tokenized glass components, sentence/audio/menu controls, and accessible interaction states -- source: DC-FR-004, UA-FR-007, UX core components.
- [ ] `system/packages/backend/*` -- implement Discover data/API behavior and admin content operations -- source: DC-FR-001~016, AD-FR-006/008, I18N-FR-004.
- [ ] `system/apps/web/*` -- implement Discover pages, profile preferences, local language switching, gates, progress/favorite/note/rating/share/search -- source: DC-FR-001~016, UA-FR-007/013, I18N-FR-003/004.
- [ ] `system/apps/admin/*` -- implement Admin Discover China workbench including category/article/sentence/review/import/access model -- source: AD-FR-006/008 and ADC-01~10.
- [ ] `system/packages/db/seed/discover-china/*` -- provide >=36 dev articles, 12 category coverage, schema/upsert command -- source: rules §11, DC-23/24.
- [ ] `system/docs/prd-coverage-audit-discover-china.md` -- write exact coverage, tests, gaps and risks -- source: user delivery requirement.

**Acceptance Criteria:**
- Given no login, when visiting first 3 DC categories/articles, then list and reader work; when visiting categories 4-12, then unlock UI appears and body/sentence/audio data is not exposed.
- Given login, when switching language from profile or page controls, then article/sentence translations update immediately and URL prefix follows `/en|vi|th|id`.
- Given article reader, when using sentence play/menu/note/favorite/rating/share/progress, then UI responds and API/local fallback persists.
- Given admin login, when creating/editing/importing/reviewing/publishing DC content, then frontend updates, backend audits, and preview respects access model.
- Given Docker validation, when running build/typecheck/seed and MCP browser smoke, then app/admin pages render without broken interactions.

## Verification

**Commands:**
- `cd /opt/projects/zhiyu/system && docker compose -f docker/docker-compose.yml build` -- expected: images build using only system context.
- `cd /opt/projects/zhiyu/system && docker compose -f docker/docker-compose.yml run --rm zhiyu-app-be pnpm test` -- expected: backend/unit smoke passes or reports only unrelated pre-existing failures.
- `cd /opt/projects/zhiyu/system && docker compose -f docker/docker-compose.yml run --rm zhiyu-app-be pnpm seed:discover-china` -- expected: >=36 items counted, idempotent.
- MCP Browser against `http://115.159.109.23:3100` and `http://115.159.109.23:4100` -- expected: screenshots for discover home, category, article, profile preferences, admin DC list/editor/review/import.

## Spec Change Log

- 2026-04-27: Implemented the local Docker dev slice for Discover China, Admin Discover China, Chinese-style glass UX tokens/components, profile preferences, i18n content switching, seed data, and API/runtime support.
- 2026-04-27: BMAD code review found and fixed deterministic issues: public draft/archived leakage, missing readable gates for user actions, Admin status PATCH mismatch, missing article action 404s, import overclaim, content DB/runtime mismatch notes, ratings RLS, and reduced-motion animation loops.
- 2026-04-27: Docker cross-service smoke exposed an App/Admin in-memory state isolation bug: Admin PATCH to `draft` was not visible to App API. Fixed with Redis-backed Discover runtime snapshot under `zhiyu:runtime:discover:v1` and version key, with Admin persist and App refresh hooks.
- 2026-04-27: Docker backend typecheck passed after strict typing fixes in `app-api.ts` and `state.ts`.
- 2026-04-27: Docker backend tests passed with `Test Files 2 passed (2)` and `Tests 4 passed (4)`.
- 2026-04-27: Docker service refresh completed for `zhiyu-app-be`, `zhiyu-admin-be`, and `zhiyu-redis`; all three reported healthy.
- 2026-04-27: Docker cross-service smoke passed: ready endpoints, 12 active categories, anonymous public history, anonymous gated festivals 401, user login unlock, Admin content categories/table/detail, Admin PATCH draft, App draft 404, republish visible again, missing publish 404, empty import 400, and invalid progress 400.
- 2026-04-27: MCP Browser post-fix screenshots captured: `post-redis-discover-home`, `post-redis-discover-locked-festivals`, `post-redis-discover-unlocked-festivals-token`, `post-redis-profile-preferences`, and `post-redis-admin-discover-workbench-articles`.
- 2026-04-27: Created `system/docs/prd-coverage-audit-discover-china.md` with PRD-by-PRD implemented/partial/not-implemented coverage and explicit non-overclaim gaps.

## Post-Review Verification Evidence

| Check | Result |
| --- | --- |
| Docker backend typecheck | PASS: `pnpm --filter @zhiyu/backend typecheck`, `tsc -p tsconfig.json --noEmit`, exit 0 |
| Docker backend tests | PASS: `vitest run --reporter=dot`, `2 passed (2)` files and `4 passed (4)` tests |
| Redis Discover runtime reset | PASS: `redis-cli DEL zhiyu:runtime:discover:v1 zhiyu:runtime:discover:v1:version` returned `0` before service rebuild |
| App/Admin/Redis health | PASS: `zhiyu-app-be`, `zhiyu-admin-be`, `zhiyu-redis` healthy |
| Cross-service Discover smoke | PASS: Admin `draft` hides article from App API with 404; republish restores App 200 |
| Browser smoke | PASS: Discover home, locked category, unlocked category, Profile preferences, Admin Discover workbench rendered and screenshot |

## Remaining Gaps To Avoid Overclaim

- Share cards still return seed/placeholder URLs; no real 1080x1920 image, QR, Storage cache, or referral-code registration loop.
- Sentence audio/TTS is represented by `seed://audio` data and UI feedback, not real playback, signed URLs, or timing validation.
- Search is in-memory/dev behavior despite a UI label mentioning Postgres FTS; real PostgreSQL FTS/pg_trgm, highlight, and pagination remain future work.
- Runtime Discover persistence is Redis snapshot plus in-memory fallback for Docker dev, not production Postgres/RLS content persistence.
- Seed corpus is 36 articles, not the W0 600 article gate.
- Import validates/records input but does not perform a full production DB upsert workflow.
- Review workflow, redline, audit, version history, and preview are useful dev slices but not complete production workflows.
- SEO, sitemap, hreflang, JSON-LD, cache headers, service-worker prewarm, performance budgets, and automated accessibility reports are not complete.
- Scroll restore, exact 30s completion semantics, long-press sentence menu, TTS voice selection, email subscriptions, and full i18n key coverage remain partial.

## Design Notes

Use Stitch as interaction inspiration only: translucent, animated material surfaces, pill/icon buttons, segmented controls, deep blur, hover/press feedback, and a moving light-flow background. Keep Zhiyu colors Chinese-inspired rather than Stitch purple/black: paper, ink, celadon, jade, cinnabar, porcelain. Reading body stays paper-solid for legibility.

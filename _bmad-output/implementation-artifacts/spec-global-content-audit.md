---
title: 'Global content audit and readiness cleanup'
type: 'chore'
created: '2026-04-25'
baseline_commit: 'f01bda4a6e07ad5ba59d0783e82c969bbfef5424'
status: 'done'
context:
  - '/opt/projects/ideas_ai/_bmad-output/planning-artifacts/implementation-readiness-report-2026-04-25.md'
  - '/opt/projects/ideas_ai/planning/00-implementation-readiness-report.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The requested documentation corpus must be ready for later development, but automated audit found a few structural issues: duplicate i18n index content, incomplete course track index links, and stale relative links in the existing readiness report. BMAD readiness also surfaced that canonical BMAD planning discovery is not aligned with the repository's actual `planning/` structure.

**Approach:** Repair only objective documentation hygiene issues that affect navigation or later agent consumption, then rerun the audit over `china/`, `course/`, `docs/`, `games/`, `novels/`, `planning/`, and `research/`. Keep every generated or edited file below 800 lines and avoid changing product scope, requirements, or story intent.

## Boundaries & Constraints

**Always:** Preserve existing Chinese product content and story semantics; use relative Markdown links; keep file edits focused and under 800 lines; record verification results.

**Ask First:** No human checkpoint is required because the user explicitly delegated decisions and prohibited questions.

**Never:** Do not delete user-authored content unless it is an exact duplicate block; do not split files below the 800-line hard limit; do not rewrite product requirements just to polish wording.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Full corpus audit | 543 target files under seven folders | Counts, line-limit status, link status, index coverage, placeholder review | Treat code-snippet pseudo-links as false positives after verification |
| Duplicate index | Repeated i18n story index block | Keep one complete version and remove duplicate content | Preserve all 10 story links |
| Course track indexes | Track index lacks explicit stage links | Add a concise stage-file link section | Keep existing milestone tables unchanged |
| Existing readiness links | Links resolve from wrong directory | Correct targets to valid relative paths | Do not change report conclusions beyond verified facts |

</frozen-after-approval>

## Code Map

- `course/*/00-index.md` -- track-level course indexes that need explicit stage links.
- `planning/story/04-i18n/00-index.md` -- duplicate index block detected by heading scan.
- `planning/00-implementation-readiness-report.md` -- existing audit report with stale relative links and pseudo-link notes.
- `_bmad-output/planning-artifacts/implementation-readiness-report-2026-04-25.md` -- BMAD readiness report generated during this task.

## Tasks & Acceptance

**Execution:**
- [x] `planning/story/04-i18n/00-index.md` -- remove the duplicated index block while preserving one complete story table.
- [x] `course/daily/00-index.md`, `course/ecommerce/00-index.md`, `course/factory/00-index.md`, `course/hsk/00-index.md` -- add explicit relative links to all 12 stage files for each track.
- [x] `planning/00-implementation-readiness-report.md` -- repair invalid relative links and keep code-like pseudo-link examples non-rendering.
- [x] `_bmad-output/implementation-artifacts/spec-global-content-audit.md` -- track workflow status through implementation and review.

**Acceptance Criteria:**
- Given the seven requested folders, when the audit script runs, then no file exceeds 800 lines and no empty Markdown files are reported.
- Given Markdown links outside code spans, when link validation runs, then all relative links resolve to existing files.
- Given course track indexes, when index coverage runs, then each track index references `stage-01.md` through `stage-12.md`.
- Given `planning/story/04-i18n/00-index.md`, when heading duplication is checked, then it has one top-level title and one story table.

## Spec Change Log

## Verification

**Commands:**
- `python3 - <<'PY' ... PY` -- passed: 543 target files, 542 Markdown files plus 1 YAML status file, max 700 lines, 813 real relative Markdown links, zero over-800 files, zero empty files, zero duplicate H1 entries, zero real broken links, zero index coverage gaps.
- `git -C /opt/projects/ideas_ai diff --check` -- passed: no whitespace errors.

## Suggested Review Order

**Audit Conclusions**

- Start with the repository-level readiness distinction and final audit facts.
  [implementation-readiness-report-2026-04-25.md:177](../planning-artifacts/implementation-readiness-report-2026-04-25.md#L177)

- Confirm the existing planning report now records strict link verification.
  [00-implementation-readiness-report.md:37](../../planning/00-implementation-readiness-report.md#L37)

**Navigation Repairs**

- Check the duplicate i18n story index was collapsed safely.
  [00-index.md:1](../../planning/story/04-i18n/00-index.md#L1)

- Review the daily course stage entry pattern first.
  [00-index.md:68](../../course/daily/00-index.md#L68)

- Compare the business course index uses the same stage coverage.
  [00-index.md:72](../../course/ecommerce/00-index.md#L72)

- Verify the factory course index keeps role-based descriptions.
  [00-index.md:69](../../course/factory/00-index.md#L69)

- Verify the HSK index maps stages to exam progression.
  [00-index.md:65](../../course/hsk/00-index.md#L65)

**Workflow Record**

- End with the completed task and verification trail for this cleanup.
  [spec-global-content-audit.md:1](./spec-global-content-audit.md#L1)

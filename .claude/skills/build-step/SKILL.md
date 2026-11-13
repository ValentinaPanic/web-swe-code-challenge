---
name: build-step
description: Run exactly one step of the build order in PLAN.md §7 for the DAT broker page, starting from a fresh session. Use only when the user types /build-step, optionally followed by a step number.
argument-hint: "[step number]"
disable-model-invocation: true
---

# Build one step of PLAN.md

Each build step runs in its own fresh session. This skill gives that session the
context it needs, does one step, records it, and stops. Requested step: **$ARGUMENTS**
(empty means "the next unfinished step").

The rules live in `CLAUDE.md` and the step details in `PLAN.md`. This file only
defines the process. If anything here conflicts with `CLAUDE.md`, `CLAUDE.md` wins.

## 1. Load context
Read these in full rather than skimming:
- `CLAUDE.md`: the rules for this repo. It imports `AGENTS.md`, which points to the
  Next.js docs that match the installed version. Read the relevant guide there
  before using any Next.js API.
- `PLAN.md` §7 (build order), plus every section the chosen step refers to
  (for example §2 conflicts, §4 types, §5 interactions).

Then check the repo:
- `git branch --show-current` must be `build/broker-page`.
- `git status --short` should be clean, apart from the gitignored AI log.
- `git log --oneline -8` shows what recent steps did.

If you're on the wrong branch, or the tree has changes you can't explain, stop and ask.

## 2. Pick the step
- If a step number was given, use it. Otherwise use the first step in §7 that has
  no `**Done:**` marker.
- Every earlier step should be marked Done. If one isn't, stop and ask whether to
  continue anyway.
- Before writing code, restate the step in 3–5 bullets: what you'll build, which
  files you'll touch, and what's out of scope.
- Add one more bullet: **the simplest version that meets the step's goal.** If
  PLAN.md suggests something heavier (extra modules, validation, tests, config
  changes), say so and build the simpler version unless it misses part of the
  goal. Follow "Keep it simple" in CLAUDE.md.
- If `PLAN.md` disagrees with the repo or the Figma file, stop and ask. Otherwise
  carry on without asking.

## 3. Build
- Do this step only. If you notice work that belongs to another step, list it in
  your summary instead of doing it.
- For steps that use Figma:
  - Call `create_session` for file `2ik2JXVqCajst1ufcgm9Fh` before any other Figma call.
  - Follow the Figma workflow rule in `CLAUDE.md` (all three frames, translate the
    Tailwind output into CSS Modules with tokens).
  - Download assets straight into `assets/images`.
- If you have to make a decision `PLAN.md` doesn't cover, always ask.

## 4. Verify
- **Simplicity review first.** Read your own diff (`git diff --stat`, then the full
  diff). For each new file, type, function, dependency or config change, ask:
  does this step need it today? Delete anything that doesn't, and report the
  final line count in your summary.
- Run `npm run lint && npm run typecheck && npm run build`.
  - All of them must pass with zero warnings.
  - The route must still show as static (○) in the build output.
- For steps that change the UI:
  - Run the dev server and confirm the browser console is empty.
  - Check the step's sections at 360, 960 and 1440 px if you have a browser tool.
    If you don't, say so; never claim a visual check you didn't do.

## 5. Record
- **PLAN.md:**
  - Append `**Done:**` and a one-line summary to the step in §7.
  - If a decision changed, update the matching table row or list item in PLAN.md
    (§2 conflicts, §10 "unsure" list).
- **SPEC.md:**
  - Add a short, factual update to the section that `PLAN.md` §11 maps this step to.
  - Never write the reasoning under "Interaction & UX decisions". The author writes
    that. Instead, list in your summary the decisions they need to explain.
- **AI usage:** if a prompt or correction from this session would make a good
  example, suggest it in your summary. Don't add it to SPEC.md without asking.

## 6. Commit and stop
- Make one commit with a conventional message. Don't push.
- Don't start the next step.
- End with a short summary:
  - what you built
  - the check results
  - decisions you made
  - what the author needs to do (review the SPEC text, write interaction reasoning,
    answer open questions)
  - the name of the next step

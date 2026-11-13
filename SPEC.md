# Project Spec & Notes

## AI usage

<!-- Which tools did you use, and for what? Include representative prompts
     (not a full transcript) — enough for us to see how you direct AI and
     evaluate what it gives you. -->

**Tools:** Claude Code (planning, scaffolding, implementation) with the Figma MCP server (reading frames, variables and assets). The agent works from [`CLAUDE.md`](CLAUDE.md) (repo rules) and [`PLAN.md`](PLAN.md) (the approved plan). A small hook ([`.claude/hooks/ai-log.mjs`](.claude/hooks/ai-log.mjs)) keeps a raw log of every prompt and reply. This section lists only representative prompts.

### 1. Planning before any code
> "TASK: plan only. Write no code and install nothing. Read CHALLENGE.md first and treat its evaluation criteria as the bar for every decision. Then examine the Figma file … Look at every frame and breakpoint, including the prototype frame. … Where you're unsure, say so instead of guessing."

- **Why I prompted it this way:** scoped to planning so I could review the approach before any code existed. Tied every decision to the grading criteria, and named the prototype frame explicitly because interaction details tend to live there.
- **What came back:** a plan ([`PLAN.md`](PLAN.md)) with 16 numbered conflicts between Figma, `content.json` and `tokens.css`. It found the prototype's sticky nav and sticky "Get started today" banner, mobile feature copy that differs from `content.json`, and colours missing from the tokens.
- **Accepted:** the folder structure and component split.
- **Adjusted:** the plan built the nav in HTML. I changed it to static images first, since the brief allows it and the evaluation focuses on what sits between the nav and footer. HTML nav and footer became an optional last step.
- **Rejected:** I asked what would change if the form used Server Actions. With nowhere to send the data, it would add backend code with no purpose, so the form stays the only client component.
- **Caught:** the agent noticed my `.claude/settings.json` hooks pointed at a script that didn't exist, and wrote it.
- **Corrected:** reviewing the generated `CLAUDE.md`, I found two unclear rules. "Convert Tailwind to CSS Modules" read as if Tailwind were in the project (it isn't; Tailwind is just the format the Figma MCP returns its reference code in). "All 3 breakpoints" never named the frames. I had both reworded, and the typography rule now says its values come from Figma's text styles.

### 2. One fresh session per build step: the `/build-step` skill
Long sessions build up stale context and cost more tokens, so I run each build step in a new session. Instead of re-explaining the project every time, I had the agent write a project skill, [`.claude/skills/build-step/SKILL.md`](.claude/skills/build-step/SKILL.md). Running `/build-step` (or `/build-step 4`) makes the agent:
1. Read `CLAUDE.md` and the relevant parts of `PLAN.md`, and check the branch and git state.
2. Pick the next step: the first one in `PLAN.md` without a `**Done:**` marker.
3. Restate the step and its scope before coding, and stop to ask if `PLAN.md` disagrees with the repo or Figma.
4. Build only that step, then run lint, typecheck, tests and build with zero warnings.
5. Mark the step Done, draft the SPEC update (but leave interaction reasoning to me), make one commit, and stop.

- **Design choice:** the skill holds only the process. Rules stay in `CLAUDE.md`, and step details stay in `PLAN.md`, so nothing is duplicated and the skill doesn't go stale as the plan changes.
- **Guardrails:** it runs only when I type it (`disable-model-invocation`), never pushes, and won't claim a visual check it couldn't do.

## Design token usage

<!-- How did you use the tokens in styles/tokens.css? Any places you had to
     make a judgment call because a token didn't quite fit? -->

## Interaction & UX decisions

<!-- The design doesn't spell out every interaction. What did you decide,
     and why? -->

## Assumptions & trade-offs

<!-- Anything you assumed, skipped, or simplified given the time box, and
     why you made that call. -->

- **Starter files:** `index.html` and `script.js` were framework-neutral stubs, so Next.js replaces them. Their `lang="en"` lives on in `app/layout.tsx`. `tokens.css` and `content.json` stay where they were, unchanged.
- **Scaffold:** Next.js 16 (App Router), React 19, TypeScript in strict mode plus `noUncheckedIndexedAccess`, and ESLint with Next's rules. No Tailwind: the design tokens already exist as CSS variables, and a second styling system would compete with them.
- **CORS:** the page reads content on the server at build time through `getContent()` ([`lib/content.ts`](lib/content.ts)) and ships it as HTML, so the browser never calls the CMS and no CORS error can occur. Moving to a real CMS means swapping the JSON import for a server-side `fetch` with `revalidate`; call sites don't change. If content ever had to be fetched in the browser, I'd add a same-origin route handler as a proxy rather than loosen CORS on the CMS.
- **Typed content without zod:** interfaces in [`types/content.ts`](types/content.ts) mirror `content.json`. JSON imports widen string unions (button `variant`, field `type`, `mediaPosition`) to `string`, so `getContent()` asserts the import `as Content`. There's no runtime validation: the content file is fixed for this challenge, so it would guard against a problem I don't have.

## If I had more time

<!-- Anything you'd change, refactor, or add. -->

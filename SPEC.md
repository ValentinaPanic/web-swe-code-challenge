# Project Spec & Notes

## AI usage

<!-- Which tools did you use, and for what? Include representative prompts
     (not a full transcript) — enough for us to see how you direct AI and
     evaluate what it gives you. -->

**Tools:** Claude Code (planning, scaffolding, implementation) with the Figma MCP server (reading frames, variables and assets). The agent works from [`CLAUDE.md`](CLAUDE.md) (repo rules) and [`PLAN.md`](PLAN.md) (the approved plan). A small hook ([`.claude/hooks/ai-log.mjs`](.claude/hooks/ai-log.mjs)) keeps a raw log of every prompt and reply. This section lists only representative prompts.

### 1. Planning before any code
> "TASK: plan only. Write no code and install nothing. Read CHALLENGE.md first and treat its evaluation criteria as the bar for every decision. Then examine the Figma file … Look at every frame and breakpoint, including the prototype frame. … Where you're unsure, say so instead of guessing."

- **Why I prompted it this way:** scoped to planning so I could review the approach before any code existed. Tied every decision to the grading criteria, and named the prototype frame explicitly because interaction details tend to live there.
- **What came back:** a plan ([`PLAN.md`](PLAN.md)) with 16 numbered conflicts between Figma, `content.json` and `tokens.css`. It found the prototype's sticky nav and sticky "Get started today" banner, mobile feature copy that differs from `content.json`, and colors missing from the tokens.
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

### 3. Rejected: over-engineering in step 3, and fixing the rules that caused it
The step 3 agent typed `content.json` with 277 lines: runtime guards, a recursive `Widen<T>` type, 7 `node --test` tests, and three config changes to make Node run them. All of it guarded a fixed file in this repo, which TypeScript already checks.
- **Rejected:** I replaced it with a single `as Content` assertion (commit `058740c`).
- **Root cause, not just the symptom:** my own plan had asked for guards and tests, and nothing told the agent to push back on a plan heavier than its goal. I added a "Keep it simple" section to `CLAUDE.md`: least code for the goal, no single-use abstractions, no runtime checks on repo files, no config changes to make an approach work. `/build-step` now states the simplest version before coding, and reviews its own diff before committing.
- **Second trap found while fixing the first:** I'd declined the `AGENTS.md` that `create-next-app` offers. Next 16 uses it to point agents at docs matching the installed version (`node_modules/next/dist/docs/`), and `next dev` re-creates it whenever it detects an AI agent. Claude Code reads only `CLAUDE.md`, so I committed Next's generated `AGENTS.md` and imported it into `CLAUDE.md` with `@AGENTS.md`.

### 4. Adjusted: "used once" is the wrong test for form fields
> "We want DRY code, imagine that this is the full DAT website. On the full website there are most likely multiple forms used across the site. I need you to break down the AuthorityForm."

- **What came back first:** following the "no abstraction for a single use" rule, the agent had drawn every input, select and checkbox inline in one `AuthorityForm`, because each pattern appears only on this page.
- **Adjusted:** this page is one segment page of a large marketing site with many forms. The agent split out a shared `Field` (bordered box and floating label, written once), with `TextField`, `SelectField` and `CheckboxGroup` on top. They take plain props rather than the CMS field shape, so any form can use them, and `AuthorityForm` now only maps content to fields and handles submit.
- **Also corrected:** layout margins (`margin-inline: auto` centering, `margin-top` spacing) became flex, grid and `gap`. I added that preference to `CLAUDE.md` so later sessions follow it.

## Design token usage

<!-- How did you use the tokens in styles/tokens.css? Any places you had to
     make a judgment call because a token didn't quite fit? -->

- **`tokens.css` is unchanged.** Values it lacks live in [`styles/tokens.extensions.css`](styles/tokens.extensions.css), each commented with its Figma source:
  - **Spacing** (`--space-200` … `--space-3000`): the DS has no spacing scale. Names follow Figma's own variable, `cg-spacing-200` = 8px, so a step of 100 is 4px. That also fits the off-grid values the frames use (12, 20, 44).
  - **Line heights** (`--line-height-*`): Figma's text styles pair each font size with a line height the DS doesn't define. Each one is numbered after the `--font-size-*` step it goes with (for example `--line-height-900` = 72px for the 60px display size).
  - **`--letter-spacing-caps`** (1.5px): button labels, from Figma `cg-font-letter_spacing-caps`.
  - **`--color-background-inverse`** (`#192129`): Figma's Background/Inverse, used for the nav band, the sticky banner and (later) the spotlight panels. The nav band has to match the nav image's edge exactly, so the nearest token (neutral-1000) wasn't an option there, and one token keeps every dark surface consistent.
  - **`--gradient-brand`**: Figma's Gradient/Blue 5 for primary buttons, from `--color-primary-500` to `#9900e0`. The purple end has no DS token.
  - **`--shadow-sticky-bottom`**: not in the DS or Figma. An upward shadow for the sticky banner (a design decision of mine, see Interaction & UX decisions). Its color is `--color-neutral-900` at 40% through `color-mix()`, so no raw color.
- **Typography:** [`styles/typography.module.css`](styles/typography.module.css) has one class per Figma text style used on the page (`displayMedium`, `headlineLarge`, `bodyLarge`…). Components pull these in with `composes:`, so no component sets its own font size and line height.
- **Font (judgment call):** Figma uses Sequel Sans, a licensed font with in-between weights. The page uses the DS system stack, mapped as Book → regular, Bold → bold and Black → black. Line breaks can differ slightly from Figma.
- **Text color (judgment call):** Figma's Text/Primary (`#192129`) isn't in the DS. Body text uses `--color-neutral-1000`, which looks the same at text sizes.
- **Focus ring:** built from DS tokens only: `--border-weight-focus` (4px) in `--color-primary-300`.
- **Colors inside SVG assets:** the icon SVGs keep Figma's fills (`#0046E0` = `--color-primary-500`, `#192129` for the check icon) because an `<img>` can't take CSS variables. These are asset files, not component CSS.

## Interaction & UX decisions

<!-- The design doesn't spell out every interaction. What did you decide,
     and why? -->

- **Focus states.** Every interactive element shows a 4px focus ring (`--border-weight-focus`) only for keyboard users (`:focus-visible`), so mouse clicks don't leave rings behind. On dark surfaces like the "Get started today" banner, the ring switches to the lighter `--color-primary-200`. That stays visible against the dark background and is a little closer to the focus style on the live DAT site. All buttons share the same pill-shaped ring, so focus looks the same whichever button you land on.
- **Hover states.** Most calls to action darken slightly on hover. I prefer this because it gives clear feedback without changing the button's color or shape. The gradient can't be animated directly, so a dark layer fades in over it. The ghost button ("Learn more") has no background to darken, so it gets an underline instead, which is easy to see on the dark banner.
- **Sticky header and banner in CSS only.** The prototype pins the nav to the top and the "Get started today" banner to the bottom. Both use `position: sticky`, with no JavaScript, scroll listeners or client component: they work before any script loads, and there's nothing that can break or fall out of sync. The banner stays pinned at every width, even while the footer scrolls past. It's the last element on the page, so at the very end it comes to rest below the footer instead of covering it.
- **Mobile button order follows Figma.** On phones the banner stacks "Request a demo" above "Learn more", as in the 360 frame. "Request a demo" is the punchier action, so it belongs on top. The HTML keeps `content.json`'s order (Learn more, then Request a demo), which matches desktop, so on mobile the keyboard and screen-reader order runs bottom to top. With two adjacent buttons, I accepted that small mismatch.
- **Banner shadow (my addition, not in Figma).** The pinned banner casts a soft shadow upward so it reads as a layer above the page while content scrolls underneath. A shadow can't show on the near-black footer, so a 1px lighter top edge (`--color-neutral-700`) keeps the banner visually separate there too.
- **Checkboxes in a row on mobile (my addition, not in Figma).** The 360 frame stacks the three "Authority Needed?" options in a column. Three short labels fit on one row even at 360px, and the column left a lot of white space that took away from the view. They wrap onto a second line only on very narrow screens.

## Assumptions & trade-offs

<!-- Anything you assumed, skipped, or simplified given the time box, and
     why you made that call. -->

- **Starter files:** `index.html` and `script.js` were framework-neutral stubs, so Next.js replaces them. Their `lang="en"` lives on in `app/layout.tsx`. `tokens.css` and `content.json` stay where they were, unchanged.
- **Scaffold:** Next.js 16 (App Router), React 19, TypeScript in strict mode plus `noUncheckedIndexedAccess`, and ESLint with Next's rules. No Tailwind: the design tokens already exist as CSS variables, and a second styling system would compete with them.
- **CORS:** the page reads content on the server at build time through `getContent()` ([`lib/content.ts`](lib/content.ts)) and ships it as HTML, so the browser never calls the CMS and no CORS error can occur. Moving to a real CMS means swapping the JSON import for a server-side `fetch` with `revalidate`; call sites don't change. If content ever had to be fetched in the browser, I'd add a same-origin route handler as a proxy rather than loosen CORS on the CMS.
- **Typed content without zod:** interfaces in [`types/content.ts`](types/content.ts) mirror `content.json`. JSON imports widen string unions (button `variant`, field `type`, `mediaPosition`) to `string`, so `getContent()` asserts the import `as Content`. There's no runtime validation: the content file is fixed for this challenge, so it would guard against a problem I don't have.
- **Images are local files:** `content.json` has no images, so every image was exported from Figma into [`assets/images`](assets/images) (no expiring figma.com URLs). Screenshots and photos are Figma's original fills, not re-renders. The footer export is Figma's own render, including its App Store badge text overflowing the badge.
- **Nav and footer are static images**, as the brief allows. Each is a `<picture>` with one Figma render per breakpoint (nav: 360, 960, 1440; footer: 960, 1440), built with Next's `getImageProps()` so only the matching image downloads, in optimized 1x/2x versions. Each image shows at its design width, centered on a full-width band in its edge color, so it never stretches. There's no `<nav>` landmark while the nav is a picture with no links. No 360 footer exists, so the 960 footer scales down on phones and its small text gets hard to read.
- **Feature copy comes from `content.json` at every width.** The 360 frame has different titles and text for cards 1 and 2 ("Make & send awards", "Evaluate bids using embedded RateView insights…"). The page uses content.json's copy everywhere, so one content source serves every breakpoint.
- **Feature card type is the same for all mobile cards.** In the 360 frame, cards 1 and 2 use 16/22 titles with 14/20 text, while card 3 uses 20/24 with 16/22. All three use the 16/22 + 14/20 pair (the majority).
- **Feature screenshots** all use one 16:9 shape on a padded light panel (`--color-neutral-050`), which reproduces Figma's panel heights at each breakpoint. Figma's insets vary slightly per card. The contract bid screenshot is taller, so it is cropped from the top, as in Figma, and stays the same size as the other two.
- **Mobile carousel dots use CSS only.** Each card's scroll position drives its dot through CSS scroll-driven animations, so the section stays a server component with no JavaScript. Browsers without support (Firefox today) still swipe and snap but show no dots. The dots are a visual hint only (`aria-hidden`); as links they would have jumped the page and changed the URL. The 37px gap between heading and cards is snapped to 40px (`--space-1000`) on the spacing scale.
- **The feature list is a keyboard tab stop at every width.** It needs `tabindex="0"` so keyboard users can scroll the mobile carousel, but CSS can't remove that from 960 up, where the cards sit in a grid and don't scroll.
- **Banner copy comes from `content.json`.** The 960 and 360 banner frames say "request a Demo"; the page uses content.json's "Request a demo" (rendered in caps either way).

## If I had more time

<!-- Anything you'd change, refactor, or add. -->

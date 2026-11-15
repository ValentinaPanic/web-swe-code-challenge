# Project Spec & Notes

## AI usage

<!-- Which tools did you use, and for what? Include representative prompts
     (not a full transcript) — enough for us to see how you direct AI and
     evaluate what it gives you. -->

**Tools:** Claude Code (planning, scaffolding, implementation) with the Figma MCP server (reading frames, variables and assets). The agent works from [`CLAUDE.md`](CLAUDE.md) (repo rules) and [`PLAN.md`](PLAN.md) (the approved plan). A small hook ([`.claude/hooks/ai-log.mjs`](.claude/hooks/ai-log.mjs)) keeps a raw log of every prompt and reply. That log stays local and isn't committed. This section lists only representative prompts.

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
4. Build only that step, then run lint, typecheck and build with zero warnings.
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

### 5. Caught: a problem in my own plan
- **What happened:** my plan said to draw the spotlight's background photo as a CSS background. While building step 9, the agent saw that the photo was a 1.5 MB PNG shown at only 20% opacity. As a CSS background it would download full size and unoptimized.
- **What it did:** it stopped and asked before deviating, instead of quietly following the plan or quietly changing it. It offered a decorative `next/image` (`alt=""`), which Next resizes and serves as WebP/AVIF.
- **Accepted:** I chose `next/image`, and the agent updated `PLAN.md` to match. The `/build-step` rule to "ask when the plan disagrees with what you find" worked as intended.

## Design token usage

<!-- How did you use the tokens in styles/tokens.css? Any places you had to
     make a judgment call because a token didn't quite fit? -->

- **`tokens.css` is unchanged.** Values it lacks live in [`styles/tokens.extensions.css`](styles/tokens.extensions.css), each commented with its Figma source:
  - **Spacing** (`--space-200` … `--space-3000`): the DS has no spacing scale. Names follow Figma's own variable, `cg-spacing-200` = 8px, so a step of 100 is 4px. That also fits the off-grid values the frames use (12, 20, 44).
  - **Line heights** (`--line-height-*`): Figma's text styles pair each font size with a line height the DS doesn't define. Each one is numbered after the `--font-size-*` step it goes with (for example `--line-height-900` = 72px for the 60px display size).
  - **`--letter-spacing-caps`** (1.5px): button labels, from Figma `cg-font-letter_spacing-caps`.
  - **`--color-background-inverse`** (`#192129`): Figma's Background/Inverse, used for the nav band, the sticky banner and the spotlight panels. One token keeps every dark surface consistent.
  - **`--gradient-brand`**: Figma's Gradient/Blue 5 for primary buttons, from `--color-primary-500` to `#9900e0`. The purple end has no DS token.
  - **`--gradient-hero`**: the hero background. Figma draws it as two `#c7d7fa` shapes blurred by 175px, off the top-left and bottom-right corners. That color is exactly `--color-primary-100`, so the token is two radial gradients of that DS color fading to transparent, with no exported SVG and no new hex. The blur means the shapes never reach full primary-100, so each gradient starts at 75–80% strength (through `color-mix()`). Its size and strength were fitted to Figma's rendered 1440 and 960 frames by sampling pixels, which keeps the middle of the section white, as in the design.
  - **`--shadow-sticky-bottom`**: not in the DS or Figma. An upward shadow for the sticky banner (a design decision of mine, see Interaction & UX decisions). Its color is `--color-neutral-900` at 40% through `color-mix()`, so no raw color.
  - **`--content-max-width`** (1216px): the 1440 frame's content width, shared by the hero, features and spotlights.
  - **`--nav-height`** (76px, 64px from 960): the sticky nav's height in the Figma nav frames. The page's top `scroll-padding` uses it, so focused controls and the form heading stay clear of the nav.
- **Typography:** [`styles/typography.module.css`](styles/typography.module.css) has a class for each Figma text style the page uses at one size (`bodyLarge`, `bodySmall`…), plus role classes for headings that change style per breakpoint (`heroHeading`, `formHeading`…). Components pull these in with `composes:`, so no component sets its own font size and line height.
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

- **Static page, server-first.** Next.js 16 (App Router), React 19, TypeScript in strict mode plus `noUncheckedIndexedAccess`, and ESLint with Next's rules. The page uses no request-time data, so Next prerenders it to HTML at build time (○ in the build output). Every component is a Server Component except `AuthorityForm`, which needs state for its success message. There's no `useEffect` and no client-side fetching anywhere, so there are no loading states and no race conditions.
  - No Tailwind: the design tokens already exist as CSS variables, and a second styling system would compete with them.
  - The starter `index.html` and `script.js` were framework-neutral stubs, so Next.js replaces them (`lang="en"` lives on in `app/layout.tsx`). `tokens.css` and `content.json` stay where they were, unchanged.
- **CORS:** the page reads content on the server at build time through `getContent()` ([`lib/content.ts`](lib/content.ts)) and ships it as HTML, so the browser never calls the CMS and no CORS error can occur. Moving to a real CMS means swapping the JSON import for a server-side `fetch` with `revalidate`; call sites don't change. If content ever had to be fetched in the browser, I'd add a same-origin route handler as a proxy rather than loosen CORS on the CMS.
- **Typed content without zod:** interfaces in [`types/content.ts`](types/content.ts) mirror `content.json`. JSON imports widen string unions (button `variant`, field `type`, `mediaPosition`) to `string`, so `getContent()` asserts the import `as Content`. There's no runtime validation: the content file is fixed for this challenge, so it would guard against a problem I don't have.
- **No Server Action for the form.** With nowhere to send the data, a Server Action would be backend code that throws the data away, and it would still need client state to show the success message. Once there's a real CRM, a Server Action is the upgrade path: the API key stays on the server, and the call is server-to-server, so CORS never comes up.
- **The nav is HTML; the footer is a static image**, as the brief allows.
  - The nav is built from `content.nav` inside `nav[aria-label="Main"]`, with the Figma logo SVG. Links underline on hover; the current page ("Solutions") has `aria-current="page"` and the designed bold underline. The dropdown chevrons are decorative: Figma shows no open dropdowns.
  - The search icon isn't in `content.json` and has no designed behavior, so it's a decorative image (`alt=""`).
  - Below 960 the hamburger is a `<details>`/`<summary>` with no JavaScript (labeled "Menu", which isn't in `content.json`). Figma has no open state, so the links and buttons stack in a simple panel under the bar. It closes on a second tap, not on Escape or outside clicks.
  - Login and Sign up use the shared `Button`: Login is a new `outline` variant. Sign up is a new `solid` variant (`--color-primary-500`, the form submit's fill), because Figma's nav draws it solid blue rather than the gradient; `content.json` calls it `primary`, so the nav maps its primary action to `solid`. Both use the large 12px label from Figma's nav.
  - The footer is a `<picture>` with one Figma render per breakpoint (960, 1440), built with Next's `getImageProps()` so only the matching image downloads, in 1x/2x versions. It shows at its design width on a full-width band in its edge color, so it never stretches.
  - No 360 footer exists, so the 960 footer scales down on phones and its small text gets hard to read.
  - `content.json` has no images, so every image was exported from Figma into [`assets/images`](assets/images): no expiring figma.com URLs.
- **Where Figma disagreed or was silent, `content.json` and consistency won.**
  - Copy: the 360 frame's text for feature cards 1 and 2, and the 960/360 banner's "request a Demo", differ from `content.json`. The page uses `content.json` at every width, so one content source serves every breakpoint.
  - Mobile card type: in the 360 frame, cards 1 and 2 use 16/22 titles with 14/20 text, while card 3 uses 20/24 with 16/22. All three use the majority pair.
  - Dividers: each frame places them differently. The page uses a line between every pair of sections at every width (the 360 set, plus the 1440 frame's line under the hero), as plain `<hr>` elements because each one marks a change of topic.
  - Submit button: it uses the shared `Button` (rendered as a `<button>` when there's no `href`) with the `solid` variant and the large 12px label, the same as the nav's Sign up. Figma's submit has 0.6px tracking and a 22px line height; it takes the nav's 1.5px and 16px, so both 12px buttons share one style.
  - Form gaps: neither Figma nor `content.json` lists select options. "State" lists the 50 US states plus DC; "Company Type" and "Transportation Role" use placeholder lists in [`lib/formOptions.ts`](lib/formOptions.ts). The success message is placeholder copy too, since the design shows no success state.
  - "Authority Needed?" stays as checkboxes, as drawn, inside a `fieldset` with a `legend`. A broker could plausibly need more than one authority type.
- **Responsive layout between frames.**
  - Breakpoints are 960 and 1440, as in the frames. Below 960 the 360 layout continues up to 959px, since no tablet frame exists.
  - From 960 up, hero and spotlight columns split the row in the frames' own ratios (hero 435:405 and 624:544; spotlights 351:449 and 439:705), so the layout stays proportional at widths no frame covers. Below 960 the spotlight media sits above the text; the heading comes first in the HTML, and CSS `order` moves the media.
  - Mobile carousel in CSS only: scroll-snap, with dots driven by CSS scroll-driven animations, so the section stays a server component with no JavaScript. Browsers without support (Firefox today) still swipe and snap but show no dots. The dots are a visual hint only (`aria-hidden`).
  - The feature list needs `tabindex="0"` so keyboard users can scroll the mobile carousel. CSS can't remove that from 960 up, so it's an extra tab stop there.
- **Deliberate approximations.**
  - Feature screenshots share one 16:9 shape on a padded light panel, which reproduces Figma's panel heights at each breakpoint. The taller contract bid screenshot is cropped from the top, as in Figma.
  - Spotlight media is built from parts, not flattened renders: a dark panel, the truck-stop photo at 20% opacity, and the product screenshot on top. Both spotlights share one photo file and reuse the feature screenshots and their alt text. The photo is decorative (`alt=""`) but a `next/image` rather than a CSS background, because the source is a 1.5 MB PNG that `next/image` serves resized as WebP/AVIF.
  - The hero glow is approximated with CSS radial gradients (see Design token usage), and off-scale Figma values are snapped to the spacing scale (37 → 40, 62 → 64, 29 → 24).
  - The hero callout ("Need your authority?") is a paragraph with a bold first line, not a heading, because it's a promo line rather than a section. The hero image loads eagerly because it's the largest element above the fold.
- **Testing kept small.** No unit or browser test suite: it's a static page whose content file is fixed. The QA pass ran by hand:
  - Lint, typecheck and build are clean. The only client component is `AuthorityForm`, and no component CSS has a raw hex value.
  - Headless Chrome at 320, 360, 600, 960, 1280, 1440 and 1920: no horizontal overflow, no broken images, an empty console. One `h1`, every `section` labelled by a heading, every image has `alt`, every control has a label.
  - The hero CTA scrolls the form heading to just below the sticky nav. An empty submit shows native messages with no reload. A valid submit shows the success message, clears the form and leaves the URL unchanged.
  - Lighthouse (mobile): Accessibility 100, Best Practices 100, SEO 100, Performance 97.
  - The only console error was the browser's `/favicon.ico` request, so DAT's own favicon is [`app/icon.png`](app/icon.png).
- **W3C validation.** The built HTML passes the Nu HTML Checker with no HTML errors. Its seven CSS errors are all for the scroll-driven animation properties behind the carousel dots (`timeline-scope`, `view-timeline-name`, `animation-timeline`). They're in the CSS Scroll-driven Animations spec and ship in Chrome and Safari, but the checker's CSS grammar doesn't include them yet.

## If I had more time

<!-- Anything you'd change, refactor, or add. -->

- **Build the footer in HTML** from `content.json`, so it's readable on phones.
- **Send the form somewhere real:** a Server Action posting to the CRM, with server-side validation and rate limiting.
- **Fetch from a real CMS** with `revalidate`, with images and alt text coming from the CMS instead of `lib/media.ts`.
- **Automate the QA pass:** Playwright screenshots at 360, 960 and 1440 compared against the Figma exports, and axe accessibility checks in CI.
- **Inline error messages** in the brand's style, once the design system has error colors.
- **A designed tablet layout** for 600–959px.

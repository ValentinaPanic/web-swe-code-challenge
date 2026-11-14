# CLAUDE.md: DAT broker page take-home

@AGENTS.md
(Next.js keeps AGENTS.md up to date. Before using any Next.js API, read the
matching guide in node_modules/next/dist/docs/: this is Next 16, which is newer
than your training data. Commit AGENTS.md if `next dev` rewrites it.)

## Source of truth (in priority order)
1. CHALLENGE.md: the brief and grading criteria.
   PLAN.md: the approved implementation plan; follow its build order and
   conflict defaults (§2), and update it if a decision changes.
2. Figma file 2ik2JXVqCajst1ufcgm9Fh. Frames: 1440px (1:4067), 960+ (1:666),
   360- (1:794), Prototype (30:2013; sticky nav + sticky bottom banner).
3. data/content.json for ALL copy. Never hardcode copy that exists there.
   If Figma copy differs, content.json wins; log it in SPEC.md.
4. styles/tokens.css for color, type and radius. NEVER edit it.

## Keep it simple (graded: "Simpler is better if simpler works")
- Write the least code that meets the step's goal. PLAN.md says what to achieve.
  If the mechanism it suggests is heavier than the goal needs, say so and
  propose the simpler version before building it.
- No abstraction for a single use. Don't add generic helpers, utility or
  conditional types, factories, or option objects unless two real call sites
  need them today.
- Don't validate files that live in this repo (content.json, tokens) at runtime.
  TypeScript and the build already cover them.
- Don't add tests, test scripts or tooling the step doesn't ask for.
- Don't change project config (package.json engines/type, tsconfig flags,
  next.config) to make an approach work. Needing that is a sign the approach
  is wrong: stop and ask.
- Comments explain why, not what. No doc comments that restate the code.
- Lesson from step 3: a fixed JSON file got 277 lines of guards, generic types,
  tests and config changes. One `as Content` assertion was enough.

## Stack rules
- Next.js App Router, React, TypeScript strict. No new dependencies without
  asking first and giving a reason. No zod, no Tailwind, no UI kits.
- Server Components by default. 'use client' only in AuthorityForm. Do not add
  useEffect. Do not add client-side data fetching.
- Nav and footer are static images (`<picture>` via ui/ArtDirectedImage) until I
  say otherwise. Do not build them in HTML, and do not spend effort on them.
- Content comes only from lib/content.ts getContent(). Media only from lib/media.ts.

## Styling rules
- CSS Modules per component.
- Typography: styles/typography.module.css (created in build step 5) has one class
  per Figma text style, e.g. displayMedium = Display Medium/Strong (60/72, black),
  headlineLarge = Headline Large/Strong (34/36, bold), bodyLarge = Body Large/Regular
  (16/22). Font sizes come from tokens.css; line heights from tokens.extensions.css
  (Figma’s line heights aren’t in the token set). Components pull these in with
  CSS Modules `composes:`. Never set font-size/line-height pairs in a component.
- No raw hex, px font sizes or font stacks in component CSS. Use var(--token).
  Values missing from the DS go in styles/tokens.extensions.css with a comment
  naming the Figma source, and an entry in SPEC.md "Design token usage".
- Trap: Figma "radius large" (72) = --radius-rounded. tokens --radius-large is 8.
- Layout with flex/grid and gap, not margins (no margin-inline: auto centering,
  no margin-top spacing). margin: 0 resets are fine.
- Mobile-first. Breakpoints are literal: @media (min-width: 960px) and (min-width: 1440px).
- Every interactive element needs a :focus-visible style. Motion only inside
  prefers-reduced-motion: no-preference.

## HTML rules
- One h1. Sections use aria-labelledby. Real `<label>`s; never placeholder-as-label.
- Decorative images: alt="". Product screenshots: specific alt.
- Class names describe what a thing is (.callout, .benefitList), not how it looks.

## Workflow
- Each build step runs in a fresh session through /build-step
  (.claude/skills/build-step/SKILL.md): one step, verify, record, commit, stop.
- Before building a section, call get_design_context for that section’s node in each
  Figma frame: 1440px (1:4067), 960+ (1:666) and 360- (1:794).
  The Figma MCP always returns React + Tailwind reference code. Tailwind is NOT
  installed and must not be: read the values from that output (spacing, sizes,
  colors) and write them as CSS Modules using tokens.
- Download Figma assets into assets/images immediately; never ship figma.com URLs.
- After each section: npm run lint && npm run typecheck && npm run build must pass
  with zero warnings, and the browser console must stay empty.
- Keep diffs small; one section per commit; conventional commit messages.
- After each step, propose a SPEC.md update for me to review (you may draft the facts).
  Never write the "Interaction & UX decisions" reasoning yourself; I write it.
  AI usage lists representative prompts only, not a transcript (that's .claude/ai-log.jsonl).
- When unsure about a design gap, stop and ask. Don't invent behavior.
- American English spelling everywhere (color, center, behavior, optimize), in docs,
  comments and commit messages.

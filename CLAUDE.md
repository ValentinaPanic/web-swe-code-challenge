# CLAUDE.md: DAT broker page take-home

## Source of truth (in priority order)
1. CHALLENGE.md: the brief and grading criteria.
   PLAN.md: the approved implementation plan; follow its build order and
   conflict defaults (§2), and update it if a decision changes.
2. Figma file 2ik2JXVqCajst1ufcgm9Fh. Frames: 1440px (1:4067), 960+ (1:666),
   360- (1:794), Prototype (30:2013; sticky nav + sticky bottom banner).
3. data/content.json for ALL copy. Never hardcode copy that exists there.
   If Figma copy differs, content.json wins; log it in SPEC.md.
4. styles/tokens.css for color, type and radius. NEVER edit it.

## Stack rules
- Next.js App Router, React, TypeScript strict. No new dependencies without
  asking first and giving a reason. No zod, no Tailwind, no UI kits.
- Server Components by default. 'use client' only in AuthorityForm. Do not add
  useEffect. Do not add client-side data fetching.
- Nav and footer are static images (<picture> via ui/ArtDirectedImage) until I
  say otherwise. Do not build them in HTML, and do not spend effort on them.
- Content comes only from lib/content.ts getContent(). Media only from lib/media.ts.

## Styling rules
- CSS Modules per component. Type styles come from styles/typography.module.css via
  `composes:`; do not redeclare font-size/line-height pairs.
- No raw hex, px font sizes or font stacks in component CSS. Use var(--token).
  Values missing from the DS go in styles/tokens.extensions.css with a comment
  naming the Figma source, and an entry in SPEC.md "Design token usage".
- Trap: Figma "radius large" (72) = --radius-rounded. tokens --radius-large is 8.
- Mobile-first. Breakpoints are literal: @media (min-width: 960px) and (min-width: 1440px).
- Every interactive element needs a :focus-visible style. Motion only inside
  prefers-reduced-motion: no-preference.

## HTML rules
- One h1. Sections use aria-labelledby. Real <label>s; never placeholder-as-label.
- Decorative images: alt="". Product screenshots: specific alt.
- Class names describe what a thing is (.callout, .benefitList), not how it looks.

## Workflow
- Before building a section: get_design_context for that node at all 3 breakpoints;
  treat output as reference only (convert Tailwind to CSS Modules + tokens).
- Download Figma assets into assets/images immediately; never ship figma.com URLs.
- After each section: npm run lint && npm run typecheck && npm test && npm run build must pass
  with zero warnings, and the browser console must stay empty.
- Keep diffs small; one section per commit; conventional commit messages.
- After each step, propose a SPEC.md update for me to review (you may draft the facts).
  Never write the "Interaction & UX decisions" reasoning yourself; I write it.
  AI usage lists representative prompts only, not a transcript (that's .claude/ai-log.jsonl).
- When unsure about a design gap, stop and ask. Don't invent behavior.

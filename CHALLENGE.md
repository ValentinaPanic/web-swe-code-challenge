# Code Challenge: Build the Page

## What you're building

A static marketing page, built to match the Figma design provided separately
by the team, using the mock CMS content in `data/content.json`.

You have **7 calendar days** from receiving this repo. If anything here is
ambiguous, ask — questions are expected and welcome.

## Constraints

- **Any frontend approach is fine.** Vanilla HTML/CSS/JS, React, Next.js,
  Svelte, whatever you're most effective in. We're moving toward Next.js +
  React, but it is not required for this challenge. (Vue/Angular are
  allowed too, though they're harder for us to evaluate deeply.)
- **No backend/server.** `data/content.json` stands in for a CMS response —
  treat it as data you fetch or import, not something you need to serve.
- **Use the provided design tokens.** `styles/tokens.css` contains color and
  typography tokens standing in for our real design system. Use them —
  don't hardcode raw hex values or font stacks in your own CSS.
- **Build reusable components.** Regardless of framework choice, we want to
  see that repeated UI (e.g. the feature list) is built as a reusable unit,
  not copy-pasted markup/styles. This applies equally to a vanilla-JS
  render function and a React component.

## What we're evaluating

- Visual accuracy against the Figma design (spacing, type, color, layout).
- Design token usage (color and typography, specifically).
- Semantic HTML / W3C compliance — meaningful tags, sensible document
  structure, appropriate class/ID naming. ARIA/WCAG attention is a bonus,
  not a requirement.
- Code quality: DRY, no console errors, no unhandled exceptions, no race
  conditions.
- Appropriate scope — we're specifically **not** looking for a backend
  server, SSR, or framework features (e.g. `useEffect`/`useState`) used
  where they don't add value. Simpler is better if simpler works.
- How you used AI tools — see below.

## On interactions

The design covers layout and visual states, but intentionally doesn't spell
out every interaction in detail. Use your own judgment on things like hover
states, focus behavior, or responsive breakpoints, and explain your
reasoning in `SPEC.md`. We want to see how you make and justify those calls
yourself — not just what an AI tool suggested.

## Using AI

You're encouraged to use AI tools as part of your normal workflow. We care
about how well you direct them: specific, efficient prompts and good
judgment about what to accept, adjust, or reject. Document this in
`SPEC.md` as you go — don't try to reconstruct it at the end.

## Submitting

Push to a GitHub repo (public or with us added as collaborators) or send a
ZIP. Make sure `README.md` and `SPEC.md` are filled in.

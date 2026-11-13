# Code Challenge: New Broker Page Experience

## Problem Statement

As a freight broker who already has my operating authority and uses some DAT products, I'd like to see what other offerings DAT has that might help me grow my business capabilities. I don't want to just pick up a phone and talk to sales; I'd prefer to first do my own reserach online and be able to understand what these products look like and how they work before I talk to a human.

You have **7 calendar days** from receiving this challenge to create a page to show our "marketing stakeholders" what a new customer segment page for our Brokers might look like. If anything here is ambiguous, you can email morgan.whaley@dat.com and I'll help clear up anything.

## Acceptance Criteria

- **Any frontend approach is fine.** Vanilla HTML/CSS/JS, React, Vue,
  Svelte, whatever you're most comfortable in. We're moving toward Next.js + React, but it is not required for this challenge.
- **Any backend approach that is appropriate for the use case.** `data/content.json` stands in for a CMS response. Take what steps are necessary to prevent CORS errors.
- **Use the provided design tokens.** `styles/tokens.css` contains color and typography tokens standing in for our real design system.
- **AI is required** We care about how well you direct them: specific, efficient prompts and good judgment about what to accept, adjust, or reject. Document your AI prompts and usage in `SPEC.md` as you go, it will be eaiser than trying to reconstruct it at the end.
- **Real Enough** Links and buttons don't need to go anywhere if they are not called out in the Figma file. The page navigation bar and footer can be static images. We are most interested to see what you build below the navigation and above the footer. The form also doesn't need to submit anywhere, but does need to have its fields built out.

## What we're evaluating

- Visual accuracy against the Figma design (spacing, type, color, layout, responsive).
- Design token usage.
- Semantic HTML and W3C compliance: Meaningful tags, sensible document
  structure, appropriate class/ID naming. ARIA/WCAG attention is a bonus and not a hard requirement.
- Code quality: DRY, no console errors, no unhandled exceptions, no race conditions.
- AI fluency, token efficiency, and coaching of your preferred agent.
- Appropriate scope: We're not looking for a robust backend
  server, SSR, or framework features (e.g. `useEffect`/`useState`) if they don't add value. Simpler is better if simpler works.

## On interactions

The design covers layout and visual states, but intentionally doesn't spell out every interaction in detail. Use your own judgment on things like hover states and focus behavior, and explain your
reasoning in `SPEC.md`. We want to see how you make and justify those calls yourself, not just what an AI tool suggested.

## Submitting

Push to a GitHub repo (public or with us added as collaborators) or send a
ZIP. Make sure `README.md` and `SPEC.md` are filled in. You can email morgan.whaley@dat.com with the ZIP file or the Github repo link.

# DAT Broker Page: Implementation Plan

## Context

This is a take-home for a Senior Web Engineer role at DAT. The task is a "Solutions for Freight Brokers" segment page built from the Figma file, `data/content.json` (standing in for a CMS) and `styles/tokens.css`. The stack is Next.js App Router, React and strict TypeScript, with no zod and no extra libraries. The submission is a GitHub repo.

**What CHALLENGE.md evaluates, and how this plan answers each point:**

| Criterion | How this plan answers it |
|---|---|
| Visual accuracy (spacing, type, color, layout, responsive) | Built against 3 frames (1440, 960+, 360−) plus the prototype. Exact frame values at each breakpoint. Screenshot comparison at the end. |
| Design token usage | `tokens.css` stays unchanged. A separate, documented extension file holds only what the token set lacks. No raw hex in component CSS. |
| Semantic HTML / W3C | Landmarks, one `h1`, logical heading levels, real labels, fieldset/legend. Checked with the Nu validator. |
| Code quality (DRY, no console errors or exceptions, no races) | No client fetching, so no races. One shared Button, Section and field primitives. Typed content loader that fails loudly at build time. |
| AI fluency | A selection of representative prompts in SPEC.md, kept up after each step (§11). CLAUDE.md and the AI-log hook show how the agent was set up and coached. |
| Appropriate scope | Server Components by default, statically prerendered. Client JS only for the form. No `useEffect`. Nav and footer are static images, so the effort goes where reviewers are looking: everything between them. |

> **Note:** the working-tree `CHALLENGE.md` is newer than the committed one and is uncommitted. It adds the CORS requirement, "AI is required", and nav and footer allowed as images. Build against the working-tree version, and commit it first so the repo shows the brief I worked to.

---

## 1. Starter files: what they signal and how to handle them

| File | Signal | Handling |
|---|---|---|
| `index.html` | Framework-neutral stub: `lang="en"`, viewport meta, a single `#app` mount. Expects a single page. | Delete, and say why in the commit and in SPEC. Carry `lang="en"` and viewport into `app/layout.tsx`. Use the title "Solutions for Freight Brokers \| DAT" plus a meta description from `hero.subheading`. |
| `script.js` | "Replace with your own structure". `content.json` is the source of truth. | Delete. Its job moves to `lib/content.ts`. |
| `styles/tokens.css` | Header says to use the tokens like a real design system and not to hardcode hex values or font stacks. | Keep at its current path, **unchanged**, imported once in the layout. Gaps go in `styles/tokens.extensions.css` (see §2). |
| `data/content.json` | Mock CMS response. It includes nav and footer data even though those may be images. | Keep at its current path, **unchanged**. Read on the server through a typed loader. The `nav` and `footer` data are typed and validated but go unused until the optional HTML nav/footer step (§7, step 13). |
| `README.md` | "Assume the reader may not be technical." | Prerequisites (Node version), copy-paste steps from clone to browser, how to run checks and tests. Replace `[Your Name]`. |
| `SPEC.md` | Five fixed sections. The AI section asks for **representative prompts, not a full transcript**, and should be written as I go. | Fill it in after every build step (see §11). Every prompt goes to the raw hook log; SPEC gets only the 6–10 prompts that best show how I directed the AI, each with what I accepted, adjusted or rejected. |
| `dat.com_broker.fig` (5.7 MB) | Committed by the hiring manager. | Leave it. |

---

## 2. Figma vs content.json vs tokens.css: agreements and conflicts

**What agrees:** section order and all desktop and 960 copy match `content.json`. The callout CTA `#get-authority` matches `authorityForm.id`. Form field names, order, required flags and the `*` markers match. The sticky banner text matches `cta` (the Figma layer *name* is stale, but the rendered text is right). These Figma colors map exactly to tokens: primary-050/100/500/700, neutral-050/100/400/500/1000, and white. The whole font-size scale maps exactly: 60, 48, 34, 24, 20, 16, 14, 12, 10. Radii 4 and 8 map to `--radius-default` and `--radius-large`.

**Conflicts, with the default I'd use:**

| # | Conflict | Default | Ask? |
|---|---|---|---|
| C1 | **Font**: Figma uses Sequel Sans (licensed, with odd weights 305, 325, 375 and 385). Tokens use the system stack. | Use `--font-family-base`. Map weights: Book → regular 400, Bold Body → bold 700, Bold Head → bold 700, Black Head → black 900. Accept that line wraps will differ slightly from Figma, and note it in SPEC. | No |
| C2 | **`#192129`** (Text/Primary, Background/Inverse for nav, banner and spotlight media) is **not in tokens.css**. It sits between neutral-800 `#2d3943` and neutral-1000 `#0a0d10`. | Text: use `--color-neutral-1000` (indistinguishable at text sizes). Dark surfaces: also neutral-1000 for now, as a documented deviation. **Top question for the hiring manager.** | Yes |
| C3 | **Brand gradient** "Gradient/Blue 5" `#0046e0 → #9900e0`. No purple token exists. | Add `--gradient-brand` in `tokens.extensions.css`, using `--color-primary-500` plus one documented gap hex. | Yes (bundle with C2) |
| C4 | **No spacing, line-height or letter-spacing tokens**. Figma uses an 8-px grid (8–120), line heights 72/56/36/28/24/22/20/16, and caps tracking of 1.5px. | Define `--space-*`, `--line-height-*` and `--letter-spacing-caps` in `tokens.extensions.css`, named like the existing scale. Every value comes from Figma. | No |
| C5 | **Radius naming**: Figma's `border_radius-large` is 72 (pill), but `tokens.css` `--radius-large` is 8. | Pills use `--radius-rounded` and cards use `--radius-large`. Note the naming trap in CLAUDE.md. | No |
| C6 | **Mobile feature copy differs**. At 360, cards 1 and 2 say "Evaluate bids using embedded RateView insights…" and "Make & send awards…". Card 3 matches the desktop copy. | `content.json` wins: one content source across breakpoints. The 360 copy looks like stale design copy. | Yes |
| C7 | **Inconsistent mobile card type**. At 360, cards 1 and 2 use 16/22 titles with 14/20 body, while card 3 uses 20/24 with 16/22. | Use 16/22 + 14/20 for all mobile cards (the majority, and consistent). | No |
| C8 | **Divider lines vary by breakpoint**. 1440: under hero, spot1/spot2, spot2/form. 960: features/spot1, spot2/form. 360: features/spot1, spot1/spot2, spot2/form. | Use one rule at all sizes: dividers between features, spot1, spot2 and form (the 360 set). Inset per breakpoint from the frames (62 / 48 / 16 px). | Low |
| C9 | **Submit button** is a detached style: solid `#0046e0`, 12px, 0.6px tracking, full width. Every other primary button uses the gradient at 10px with 1.5px caps tracking. | Match Figma through the shared `Button` with a `solid` variant and `block` width. | Low |
| C10 | **Form row gap is 29px** (the rest of the file sits on an 8px grid). | Use `--space-300` (24px). Likely a nudge in Figma, and the 5px difference is below what reviewers would notice. | No |
| C11 | **Select options are missing** (Company Type, State, Transportation Role). | `lib/formOptions.ts` with US states + DC, plus clearly labelled placeholder options for the other two. | Yes |
| C12 | **"Authority Needed?"** is drawn as square checkboxes, but the legend reads like a single choice. | Use checkboxes as designed, inside `fieldset`/`legend`. Multiple answers are plausible. | Yes |
| C13 | **No images in content.json**, though the design has a hero composite, 3 feature screenshots and 2 spotlight media panels. | Keep a local `lib/media.ts` keyed by section and index, and merge it in the loader so components get `{ src, alt }`. A real CMS would send these. | Yes (FYI) |
| C14 | **No error or success colors in tokens**, and the design shows no error state. | Use native validation bubbles (no color needed). The success message uses existing tokens. | Yes |
| C15 | **No 360 footer**, so there's no mobile footer image. The 360 nav is 76px tall (64 elsewhere). | Below 960, show the 960 footer image scaled to fit the width. Its small text becomes hard to read on a phone, which is acceptable for a placeholder and noted in SPEC. The nav uses the 360 nav image at 76px. | Yes |
| C16 | **Figma Button note: "width should hug text"**. Mobile frames show full-width buttons. | Frames win at their breakpoint. | No |

---

## 3. Architecture

**Data flow (and CORS).** `app/page.tsx` is an async **Server Component** that calls `getContent()` from `lib/content.ts`. Today that function imports `data/content.json`. Swapping in a real CMS later means changing one line to a server-side `fetch(CMS_URL, { next: { revalidate } })`, and no call sites change. **CORS is a browser-only rule. The browser never requests the CMS**, because content is read on the server at build time and shipped as HTML. So no CORS error is possible and no proxy is needed. I'll explain this in SPEC and name the fallback: if content had to be fetched client-side, I'd add a same-origin Route Handler (`app/api/content/route.ts`) as a proxy rather than loosen CORS on the CMS. I won't build that because nothing needs it.

**Rendering.** The page has no dynamic APIs, so Next prerenders it statically (○ in build output). That is static generation, not SSR, which fits the brief's "not looking for SSR". I won't use `output: 'export'`, so `next/image` optimization keeps working with `next start`.

**Typing without zod.** `types/content.ts` holds the interfaces. JSON imports widen string unions such as `variant` and `type` to `string`, so `getContent()` runs small hand-written guards (`isButtonVariant`, `isFieldType`, `isMediaPosition`) and throws a descriptive `Error` if content is malformed. That fails the **build**, not the user's browser. Everything else is narrowed structurally.

**Server vs client components.**
- Server (default): everything except the items below.
- Client: `AuthorityForm` only (submit interception and the success state need `useState` and an `onSubmit` handler).
- **Considered and rejected: Server Actions for the form.** There's nowhere to send the data, so the action would be backend code that throws it away. It would also still need a client wrapper (`useActionState`) to show the success message. Record this in SPEC ("Assumptions & trade-offs"), with Server Actions named as the upgrade path once there's a real CRM destination: the API key stays on the server, and the call is server-to-server, so CORS never comes up.
- No `useEffect` anywhere. The image nav has no hamburger behaviour, so no menu state is needed.

**Nav and footer as static images.**
- Export from Figma at 2x: nav at 1440 (`1:4068`), 960 (`1:667`) and 360 (`1:795`); footer at 1440 (`1:4153`) and 960 (`1:793`).
- Render with art direction: a `<picture>` element with one `<source media>` per breakpoint. Build it with `getImageProps()` from `next/image` (part of Next, no extra library), so each source still gets optimised `srcset`s and fixed dimensions.
- **Sizing rule** (the same for every source): show at most the image's own width, centred on a dark full-width background that matches the image's edge colour.
  - Header height is the same at every width inside a breakpoint (76 / 64 / 64), so `scroll-margin-top` is a simple per-breakpoint value.
  - Between breakpoints the image keeps its size, with dark bands at the sides. Stretching instead would make the nav up to 200px tall at tablet widths.
  - Exception: the 960 footer image shrinks to fit below 960 (see C15).
- Background colours: the nav band is `#192129` (Figma `fill-navigation-default`, the same gap as C2). The footer band colour gets sampled from the export, mapped to the nearest token and recorded in SPEC.
- The header stays sticky as the prototype shows: `position: sticky; top: 0` around the image.

**Styling.**
- CSS Modules per component (built into Next, no extra dependency).
- `styles/tokens.css` (unchanged).
- `styles/tokens.extensions.css` (only the gaps from C3/C4, each commented `not in DS: from Figma <style name>`).
- `styles/typography.module.css`: one class per Figma text style (`displayMedium`, `headlineLarge`, `headlineSmallBlack`, `bodyLarge`, `bodySmall`, `button`…), pulled into components with `composes:` for DRY type.
- `app/globals.css`: minimal reset, body type, `:focus-visible` ring, `.visually-hidden`, reduced motion.
- Mobile-first media queries at `min-width: 960px` and `min-width: 1440px`. These match the frames exactly; CSS variables can't be used inside media queries, so the numbers are literal and documented in CLAUDE.md.
- No Tailwind: it would mean a second token system next to `tokens.css`.

---

## 4. Folder structure, types and components

```
app/
  layout.tsx            server  html lang, metadata, imports tokens + extensions + globals
  page.tsx              server  async; getContent(); composes sections in order
  globals.css
components/
  SiteHeader/           server  sticky <header> + art-directed nav <picture> (static image for now)
  Hero/                 server
  Features/             server  Features + FeatureCard
  Spotlight/            server
  AuthorityForm/        client  form + TextField, SelectField, CheckboxGroup
  CtaBanner/            server  sticky bottom <aside>
  SiteFooter/           server  <footer> + art-directed <picture> (static image for now)
  ui/ArtDirectedImage/  server  getImageProps() -> <picture>; shared by header and footer (DRY)
  ui/Button/            server  <a> when href, else <button>
  ui/Section/           server  <section> + container + optional divider
lib/
  content.ts            getContent(): Promise<Content> + guards
  media.ts              image imports + alt text, keyed by section/index
  formOptions.ts        select options (placeholder; see Q3)
types/content.ts
styles/tokens.css  styles/tokens.extensions.css  styles/typography.module.css
assets/images/          Figma exports, statically imported (width and height known, no layout shift)
data/content.json
```

**Key types:**
- `ButtonVariant = 'primary' | 'outline' | 'ghost' | 'solid'`
- `Link { label; href }`
- `Action extends Link { variant: ButtonVariant }`
- `NavLink extends Link { hasMenu: boolean; current?: boolean }`
- `Feature { title; description }`
- `Spotlight { title; description; benefits: string[]; mediaPosition: 'left' | 'right' }`
- `FormField { name; label; type: 'text' | 'email' | 'tel' | 'select'; required: boolean }`
- `Media { src: StaticImageData; alt: string }`
- `Content`: mirrors the JSON exactly.

**Component props:**
- `Button`: `{ variant; href?; type?; block?; children }`
- `Section`: `{ id?; labelledBy; divider?; className?; children }`
- `Hero`: `{ hero; media }`
- `Features`: `{ heading; items; media[] }`
- `FeatureCard`: `{ item; media }`
- `Spotlight`: `{ spotlight; media; headingId }`
- `AuthorityForm`: `{ form; options }` (passed serializable data only)
- `TextField` and `SelectField`: `{ field; options? }`
- `CheckboxGroup`: `{ legend; name; options }`
- `CtaBanner`: `{ cta }`
- `SiteHeader` and `SiteFooter`: no props for now (images come from `lib/media.ts`). They take `{ nav }` and `{ footer }` if step 13 happens.
- `ArtDirectedImage`: `{ sources: { media: string; src: StaticImageData }[]; fallback: StaticImageData; alt: string; className? }`

---

## 5. Responsive behavior and interaction decisions

**Breakpoints.**
- Base styles follow the 360 frame (works down to 320).
- At 960 and up, use the 960 frame values: 44px gutters, 88px section padding, 48/56 hero `h1`.
- At 1440 and up, use the 1440 values: 112px gutters, 120px section padding, 60/72 `h1`.
- Content max width is 1216px, centered.
- Between 600 and 959px there is no design, so the mobile layout continues. The form is capped at its 576px desktop width and centered, and spotlight media keeps its aspect ratio.

| Area | Mobile (<960) | ≥960 |
|---|---|---|
| Hero | Stack: text → callout (CTA full width) → image | 2 columns (text + 544/405px image), CTA inline in callout |
| Features | **Horizontal scroller**: CSS `overflow-x: auto` + `scroll-snap`, 328px cards with 40px gap. **Deviation:** cards are 85% wide so the next one peeks; Figma's 100% gives no hint that more cards exist. Left-aligned 20/24 heading. | 3 equal columns, centered 34/36 heading |
| Spotlights | Media first, then text, for both | Side by side with a 72px gap; `mediaPosition` sets which side |
| Form | 1 column, checkboxes stacked | 2 columns, checkboxes inline (32px gap) |
| CTA banner | Stacked, full-width buttons (primary first, as in the 360 frame) | Row: text left, buttons right |

**Sticky behavior (from the prototype annotations).**
- The header is `position: sticky; top: 0`.
- `CtaBanner` is `position: sticky; bottom: 0` and placed between `<main>` and `<footer>`. It pins to the viewport bottom, then settles into the flow above the footer. **Zero JS.**
- Anchor targets get `scroll-margin-top` equal to the nav height, so the form heading isn't hidden under the header.

**Hover, focus and motion** (I'll explain these in SPEC in my own words):
- **Focus:** every interactive element gets `:focus-visible` with a `--border-weight-focus` (4px, the DS supplies it) outline in `--color-primary-300` and a 2px offset. On dark surfaces it switches to `--color-primary-200` for contrast. It is keyboard-only, so mouse users don't see rings.
- **Primary (gradient) button:** darkens on hover through a `::after` overlay with opacity (gradients can't transition). `:active` darkens further.
- **Outline button:** on hover it fills with `--color-neutral-000` at low opacity or shifts the border to white.
- **Ghost button:** underlines on hover.
- **Nav and footer:** these are images for now, so they have no hover or focus states. If step 13 happens: nav links underline on hover, and the current page gets `aria-current="page"` with the designed bold underline.
- **Inputs:** on hover the border goes to `--color-neutral-600`. On focus the border is `--color-primary-500`, plus the focus ring.
- **Feature cards and spotlight media are not links**, so they get **no hover effect**. Fake hover would suggest they're clickable.
- `scroll-behavior: smooth` and the 150ms transitions apply only under `prefers-reduced-motion: no-preference`.

**Form behavior:**
- **Labels:** each field has a real `<label>`, drawn inside the field where the design shows its text. It floats up to the top border on focus or when filled, CSS only: `:placeholder-shown` for inputs, and `select:has(option[value=""]:checked)` for selects. Fallback if this proves brittle: a static label above each field, documented as a deviation.
- **Required fields:** the `required` attribute, with the `*` marked `aria-hidden` (the browser already announces "required").
- **Autocomplete:** `given-name`, `family-name`, `email`, `tel`, `organization`, `address-level1`.
- **Phone:** `inputmode="tel"` and **no pattern**, because North American and international formats vary and a strict pattern would reject valid numbers.
- **Validation:** native constraint validation and the browser's own messages (accessible and translated, and no error color is needed; see C14). `onSubmit` calls `preventDefault`. The form has no `action`, which would otherwise reload the page and put personal data in the URL. If valid, show a `role="status"` success message and `reset()`.
- **Placeholder links:** CMS links with `href="#"` stay as delivered (honest to the CMS data). The trade-off, that clicking scrolls to the top, goes in SPEC.

---

## 6. Accessibility and semantic HTML

- **Landmarks:** `header`, `main`, `aside[aria-labelledby]` (banner), `footer`. There is **no `<nav>` while the nav is an image**: a `nav` landmark without real links would mislead screen-reader users. It comes back with real links in step 13. Each content block is a `section` with `aria-labelledby` pointing at its heading.
- **Headings:**
  - `h1` "Solutions for Freight Brokers".
  - `h2` for: features heading, each spotlight title, "Get Your Authority", "Get started today".
  - `h3` for feature card titles.
  - The callout "Need your authority?" is `<p><strong>`, not a heading: it is a promo line, not a section.
- **Lists:** benefits are a `ul` with decorative check icons (`alt=""`). Features are a `ul` of `li > article`.
- **Images:** product screenshots get concise, specific alt text ("DAT One load board search results"). The spotlight background photo and hero gradient are decorative CSS backgrounds. The image placeholders get honest alt text that doesn't promise working links: the nav image gets "DAT Freight & Analytics" (what a logo would announce), and the footer image gets "DAT site footer". SPEC states that they are placeholders the brief allows.
- **Mobile scroller:** `role="region"`, `aria-label`, and `tabindex="0"` so keyboard users can scroll it, with a visible focus ring.
- **Form:** `fieldset` and `legend` for "Authority Needed?". The consent text is tied to submit through `aria-describedby`.
- **Contrast:** all DS pairs pass AA. White text on the gradient's purple end needs checking during the build. Focus rings meet 3:1.
- **Valid IDs:** `get-authority` from content; heading IDs come from `useId`-free deterministic slugs, so there is no hydration mismatch.

---

## 7. Build order: small tasks, riskiest first

1. **Housekeeping:** commit the updated CHALLENGE.md. Add `.gitignore`. Start the SPEC AI log with this planning prompt.
   - **AI-log hook (done):** `.claude/settings.json` runs `.claude/hooks/ai-log.mjs` on `UserPromptSubmit` and `Stop`. The script appends each prompt, and each final reply (truncated at 4,000 characters), to `.claude/ai-log.jsonl`. It has no dependencies, never writes to stdout, and always exits 0, so it can't interrupt a session. It never touches `SPEC.md`, which stays a summary written by hand.
   - Commit `.claude/settings.json`, the hook script and `CLAUDE.md`: they show how the agent was set up, which counts toward "AI fluency". Decide whether the raw `.jsonl` log is committed or gitignored (it may contain more than reviewers need).
2. **Scaffold:** run `create-next-app@latest` (TS, ESLint, App Router, no Tailwind, no src dir) into a **temp dir**, then copy the configs in so README and SPEC aren't overwritten. Confirm `strict: true` and add `noUncheckedIndexedAccess`. Delete `index.html` and `script.js`. Confirm a clean `build`. **Done:** Next.js 16.4.6 with React 19.3, which needs Node 20.9 or newer.
3. **Content contract (risk: strict typing of JSON):** types, `getContent()` with guards, a test of the guards with Node's built-in runner (zero dependencies).
4. **Assets (risk: Figma URLs expire in 7 days):** export every image (hero composite, 3 feature shots, 2 spotlight screenshots and backgrounds, gradient SVG, icons). Also export the nav (1440, 960, 360) and footer (1440, 960) at 2x. Give them meaningful names under `assets/images` (for example `nav-1440@2x.png`), and sample the footer's edge colour.
5. **Token layer:** extensions, typography module, globals, focus ring. Check them on a scratch section.
6. **Page shell + sticky behavior (risk: the prototype's main idea):** `ArtDirectedImage`, then the sticky header (nav image), `main`, the sticky `CtaBanner`, and the footer image. Check three things:
   - The right image appears at each breakpoint (look at the Network panel: only one image downloads per breakpoint).
   - The header stays pinned while scrolling.
   - The banner pins to the bottom and then settles above the footer at every breakpoint.
7. **AuthorityForm (highest interaction risk):** fields, floating labels (including selects), validation, no-reload submit, success state, two- to one-column layout.
8. **Features (risk: mobile scroller):** grid ↔ scroll-snap, keyboard scrolling.
9. **Spotlight:** media composition (dark panel, 20% photo, inset screenshot), `mediaPosition`, mobile stacking.
10. **Hero:** gradient background, callout, image, three type sizes.
11. **Section dividers + full responsive pass** at 320, 360, 600, 960, 1280, 1440 and 1920.
> **Every step from 1 to 13 ends with a short SPEC.md update** to the matching §11 section (a few lines, done while the decision is fresh). Step 12 is then a polish pass, not a write-up from memory.

12. **QA pass** (§8), then polish README and SPEC, push to GitHub, add the reviewer as a collaborator if the repo is private. **The submission is complete at this point.**
13. **Optional, only if time remains: replace the images with real HTML**, one at a time, each in its own commit so it can be dropped.
    - **Nav first** (smaller, and it's on screen the whole time): build `SiteHeader` from `content.nav` inside `header > nav[aria-label="Main"]`. Chevrons are decorative and dropdowns don't open. The current page gets `aria-current="page"`. Below 960 a hamburger needs a small client `MobileMenu` (one `useState` with `aria-expanded`), and its open state isn't designed (Q6).
    - **Footer next**: build it from `content.footer` (columns as lists of links, social links, legal links, copyright). This also gives the missing mobile footer a readable layout.
    - Remove each image export and its `lib/media.ts` entry once its HTML version replaces it, and update SPEC.

---

## 8. Testing and verification

| Criterion | Check |
|---|---|
| Visual accuracy | Side-by-side with the Figma screenshots at 1440, 960 and 360 (DevTools device sizes), section by section. Measure spacing with DevTools against frame values. List known deviations (font, C2, peek) in SPEC. |
| Tokens | `grep -rE '#[0-9a-fA-F]{3,6}\b' components app` returns nothing. Every hex lives in `tokens.css` or (documented) `tokens.extensions.css`. |
| Semantic / W3C | Run the built HTML (`next build && next start`, save page source) through the Nu HTML Checker (validator.w3.org/nu, file upload; the page is public marketing copy). Check the heading outline with a browser outline extension or DevTools Accessibility tree. |
| A11y (bonus) | Lighthouse Accessibility ≥ 95. A keyboard-only pass (tab order, focus ring visible on light and dark, scroller scrolls, form errors announced). VoiceOver spot check of the form and landmarks. axe DevTools as a browser extension (nothing added to the repo). |
| Code quality | `tsc --noEmit`, ESLint, and `next build` all clean with no warnings. Browser console empty (no hydration, `next/image` sizes or key warnings) at all breakpoints. Invalid-content test proves the loader fails loudly. |
| Scope | Only the files marked client above have `'use client'`. Build output shows the route as static (○). |
| Behavior | Hero CTA scrolls to the form below the sticky nav. Submit with empty fields gives native messages and no reload. A valid submit shows the success message, resets the form, and leaves the URL unchanged. |
| Tests | `npm test` uses `node --test` for the content guards (no dependencies). No Playwright or RTL: a static marketing page doesn't justify them, and SPEC notes them under "If I had more time". |

---

## 9. Draft CLAUDE.md

```markdown
# CLAUDE.md: DAT broker page take-home

## Source of truth (in priority order)
1. CHALLENGE.md (working-tree version): the brief and grading criteria.
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
- After each section: npm run lint && npm run typecheck && npm run build must pass
  with zero warnings, and the browser console must stay empty.
- Keep diffs small; one section per commit; conventional commit messages.
- After each step, propose a SPEC.md update for me to review (you may draft the facts).
  Never write the "Interaction & UX decisions" reasoning yourself; I write it.
  AI usage lists representative prompts only, not a transcript (that's .claude/ai-log.jsonl).
- When unsure about a design gap, stop and ask. Don't invent behavior.
```

---

## 10. Open questions

### For the hiring manager (one batched email, sent early since answers can take a day)
1. **Missing tokens:** `#192129` (text, nav, banner and dark panels) and the brand gradient's `#9900e0` aren't in `tokens.css`. Should I map to the nearest token (neutral-1000), or add them as documented extensions? Same question for spacing and line-height, which the token set lacks entirely.
2. **Mobile feature copy** in the 360 frame ("Evaluate bids…", "Make & send awards") differs from content.json. Is content.json canonical?
3. **Select options** for Company Type, State (US only, or US + Canada?) and Transportation Role.
4. **"Authority Needed?"**: multi-select checkboxes as drawn, or a single choice (radio)?
5. **Sticky banner on mobile** is 236px tall (about 35% of a phone screen). Keep it sticky on mobile, make it dismissible, or hide it when the form is in view?
6. **Footer on mobile:** there's no 360 footer, so the 960 footer image is scaled down on phones. Is that acceptable for a placeholder? (If I get to the optional HTML nav: should the hamburger open a menu, given that no open state is designed?)
7. **Submit button** styling (solid, 12px) differs from the shared primary button. Is that intentional?
8. **Success state:** is there preferred confirmation copy after submit?

### Decisions I'll make myself (and document in SPEC)
Framework and rendering, CORS approach, CSS Modules, token-extension strategy, font mapping (C1), divider rule (C8), mobile card type (C7), card peek, focus and hover treatments, native validation, phone without a pattern, nav and footer as static images first (with HTML as an optional last step), testing scope.

### Things I'm unsure of (to verify, not guess)
- The exact 360 type sizes for the hero `h1` and spotlight headings (they appear to be 34/36 and 16/22). Confirm with `get_design_context` when building those sections.
- The divider colour (likely neutral-100 or neutral-200).
- The footer background colour, needed to extend the image edge-to-edge.
- Whether white text on the gradient's purple end passes AA at 10px bold caps.

---

## 11. SPEC.md: what goes in each section

Each SPEC section, what the template asks, and where the plan already supplies the material. Facts can be drafted with AI; **reasoning in "Interaction & UX decisions" is written by me** (CHALLENGE.md: "not just what an AI tool suggested").

### AI usage
*Asks:* which tools, for what, and representative prompts showing how I direct the AI and judge its output.
- **Tools:** Claude Code (planning, scaffolding, implementation, review) and the Figma MCP (reading frames, variables and assets). Also note the setup that directs the agent: `CLAUDE.md` rules and the AI-log hook.
- **Format:** 6–10 entries, each with a prompt excerpt → what came back → **accepted / adjusted / rejected, and why**. Prefer short, specific prompts, which shows token efficiency.
- **Candidates from planning already** (real, from this session):
  - The planning prompt itself: scoped as "plan only", tied to CHALLENGE.md's criteria, asked for every Figma frame including the prototype.
  - **Accepted:** the folder structure as proposed.
  - **Adjusted:** the nav and footer went from HTML to static images first, because the brief allows it and the effort belongs between them.
  - **Rejected:** Server Actions for the form. I asked what would change, weighed the trade-offs, and kept the client component.
  - **Caught a problem:** the agent spotted the `.claude` folder's hooks pointing at a script that didn't exist.
- **Add during the build:** at least one case where AI output was wrong and I corrected it (for example Figma's Tailwind output converted to tokens, or a hardcoded hex that got caught).

### Design token usage
*Asks:* how the tokens were used, and where one didn't quite fit.
- **Approach:** `tokens.css` untouched; `tokens.extensions.css` holds only the gaps; a typography module mirrors the Figma text styles; the hex grep check (§8) proves no raw colours in components.
- **Judgment calls to list** (from §2):
  - C1 font and weight mapping.
  - C2 `#192129` → neutral-1000.
  - C3 gradient purple.
  - C4 spacing, line-height and letter-spacing scales.
  - C5 radius naming trap.
  - C10 the 29px gap snapped to 24px.
  - C14 no error colour, so native validation messages.
  - The nav band and footer band background colours.

### Interaction & UX decisions *(written by me)*
*Asks:* what I decided where the design is silent, and why. Source material is in §5; I write the reasoning.
- Focus ring: token, keyboard-only, contrast on dark surfaces.
- Hover per button variant, and **no hover on non-clickable cards**.
- Reduced motion.
- Sticky header and banner from the prototype, done in CSS only.
- Mobile feature scroller with a peek (a deviation from Figma).
- Floating labels (real `<label>`s, not placeholders).
- Native validation, no reload on submit, success message.
- Phone with no pattern.
- Anchor scroll offset under the sticky header.
- `href="#"` links left as delivered.

### Assumptions & trade-offs
*Asks:* what I assumed, skipped or simplified, and why.
- **CORS:** content is read on the server at build time, so the browser never calls the CMS. A same-origin route handler is the fallback if content ever had to be fetched client-side.
- **Static generation, not SSR;** the form is the only client component.
- **Server Actions** considered and rejected (§3).
- **Nav and footer as images:** allowed by the brief; no `<nav>` landmark while they're images; the footer is scaled down on mobile.
- **content.json wins** over stale Figma copy (C6); mobile card type unified (C7); divider rule (C8); submit button style (C9).
- **Placeholder data:** select options, the success message, and images kept in `lib/media.ts` because the CMS sends none (C11–C13).
- **Checkboxes** kept for "Authority Needed?" (C12).
- **Breakpoints:** 960 and 1440; the mobile layout continues through the undesigned 600–959 range.
- **Testing kept small:** no Playwright or React Testing Library.
- **Hiring manager:** list which questions (§10) were answered, and how.

### If I had more time
*Asks:* what I'd change, refactor or add. Nothing in the plan covered this until now.
- Build the nav and footer in HTML from `content.json` (step 13), including the mobile menu and a readable mobile footer.
- Server Action posting to a real CRM, with server-side validation and rate limiting.
- Real CMS fetch with `revalidate`, typed images and alt text coming from the CMS.
- Visual regression (Playwright screenshots at 360, 960 and 1440 against the Figma exports) and automated a11y checks (axe in CI).
- Custom inline error messages once the design system has error tokens.
- Sticky banner: dismissible, or hidden when the form is in view (pending Q5).
- A designed tablet breakpoint.
- Self-hosting Sequel Sans if licensed, to close the font gap.

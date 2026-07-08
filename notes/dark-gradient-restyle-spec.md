# Style Spec: Dark Gradient Restyle (reference: premvispute.github.io/Portfolio_New)

> Rahul's directive 2026-07-08: **"Full restyling, but the structure remains the same."**
> Replace the editorial light theme (paper/Fraunces/terracotta, commit 59fc989) with the reference's
> dark gradient visual system. Sections, pages, routes, content, and component structure DO NOT change.
> The editorial theme stays recoverable in git history.

## Reference design DNA (extracted from the live site's compiled CSS — exact values)

### Base + atmosphere
- Page background: `#0a0a0f`
- Corner glow blobs (fixed/absolute, pointer-events-none, behind content), from the actual CSS:
  - `radial-gradient(ellipse 60% 50% at 12% 10%, rgba(99,102,241,.18–.22), transparent)` (indigo, top-left)
  - `radial-gradient(ellipse 50% 50% at 88% 18%, rgba(236,72,153,.14–.16), transparent)` (pink, top-right)
  - `radial-gradient(ellipse 40% 40% at 80% 70%, rgba(139,92,246,.14–.16), transparent)` (violet, mid-right)
  - `radial-gradient(ellipse 60% 60% at 50% 95%, rgba(56,189,248,.16), transparent)` (sky, bottom)
- Subtle grid-line pattern on section backgrounds: 1px lines of `hsla(0,0%,100%,.05)` via
  `linear-gradient(90deg, …)` + `linear-gradient(180deg, …)` repeating background (~64px cell)

### Signature gradient (THE brand element)
- `linear-gradient(90deg, #6366f1, #ec4899 50%, #38bdf8)` — indigo-500 → pink-500 → sky-400
- Used for: last keyword of every section heading (bg-clip-text), logo mark, scroll-progress bar,
  active nav pill fill, primary button fills, avatar/image ring borders, small underline accents

### Typography
- Reference uses DIN (commercial, can't use). **Substitute: Barlow** (`@fontsource/barlow`, OFL,
  DIN-derived grotesque) — weights 400/500/600/700. Single family site-wide (reference is single-family).
  Headings: 600/700 tight tracking. Eyebrow labels: 500, ~0.35em letterspacing, all-caps, muted color.
- Heading pattern per section: eyebrow ("ABOUT ME" / "TOOLBOX" / "PORTFOLIO" style) + large heading
  where the final word(s) get the gradient text treatment ("A bit **about me**", "Where I've **shipped**",
  "Selected **projects**").

### Surfaces (glass cards)
- Card: `rgba(255,255,255,.05)`-ish glass over the dark base — e.g. bg `hsla(0,0%,100%,.04–.06)` +
  `backdrop-blur` optional + 1px border `hsla(0,0%,100%,.08)`; on hover, border shifts toward a faint
  gradient (indigo→pink at low alpha) + slight lift
- Large radius (~16–20px cards, ~9999px pills/chips)
- Metadata chips: small pills with icon + text, glass bg (`rgba(0,0,0,.4)` or white/5), muted text
- Status badge (e.g. "Current"/"Live"): `rgba(16,185,129,.15)` bg + emerald text + small dot

### Text colors (dark theme)
- Primary: near-white `#e5e7eb`-class
- Muted: `#9ca3af`-class
- Ensure computed WCAG AA ≥4.5:1 on `#0a0a0f` and on glass surfaces — COMPUTE, don't estimate
  (lesson from Week-3a: three estimates of one pair were all wrong)

### Chrome / flourishes
- **Pill navbar**: centered floating pill (dark glass, full rounding), links inside; ACTIVE link gets a
  gradient-filled pill background (follows scroll-spy). Logo left (gradient square mark + name where the
  surname is gradient text). Keep Rahul's existing nav items/behavior — restyle only.
- **Scroll progress bar**: 3px gradient bar fixed at the very top, width = scroll progress
- **Back-to-top**: floating circular glass button bottom-right, appears after scrolling
- Buttons: primary = gradient or solid indigo fill; secondary = glass/outline. Text-on-fill contrast
  must be computed (dark text if needed, per Week-3a fix).

## Scope rules
1. Structure unchanged: same sections, same pages (including case-study pages), same routes, same data,
   same component files. No renames, no content rewrites. Restyle in place.
2. Case-study/magazine pages get the same dark treatment (dark bg, glass surfaces, gradient accents) —
   keep their layout/typography hierarchy, swap the skin.
3. Existing test suite (~47 tests) must pass; update styling-assertion tests as needed — do NOT delete
   tests to make them pass.
4. All motion behind reduced-motion guards (pattern already exists in the codebase).
5. Lighthouse targets: ≥95 desktop all categories; mobile recorded honestly (Week-3a precedent).
6. Fonts self-hosted via @fontsource (existing pattern). Remove editorial fonts (Fraunces etc.) from
   the bundle when no longer referenced.
7. OG/theme-color meta updated to `#0a0a0f`.

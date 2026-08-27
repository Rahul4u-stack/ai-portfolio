# Design system contract — "Payment Intelligence Network"

Read this before touching any component. Deviating breaks cohesion.

## Concept in one line

Fintech control room meets editorial product case study. Deep ink, warm off-white type, electric
indigo accent, cyan/green used only as *signals*, coral only for tension. Restraint over effects.

## Tokens (defined in `tailwind.config.js` — never hard-code a hex)

| Purpose | Class |
|---|---|
| Page background | `bg-ink` (`#0b0d12`) |
| Raised block / card | `bg-graphite` (`#12151c`) |
| Elevated inner panel | `bg-panel` (`#171b24`) |
| Hairline | `border-rule`, stronger: `border-rule-strong` |
| Body / heading text | `text-text-primary`, `text-text-secondary`, `text-text-muted` |
| Brand accent | `text-indigo-text` for text, `bg-indigo` for fills |
| Routing signal | `text-signal` (cyan) |
| Shipped / positive outcome | `text-status` (green) |
| Tension, trade-off, a hard call | `text-coral` |

`indigo.DEFAULT` is 3.89:1 on ink → **large or bold text and non-text only**. White on it is 5.00:1,
so it is fine as a button fill. Add a `contrastTokens.test.js` assertion for any new text colour.

## Component classes (defined in `src/index.css` `@layer components`)

- `.shell` — page gutter + max width. Every section's inner wrapper.
- `.section` — vertical rhythm (`py-16 sm:py-24`).
- `.label` — **mono, uppercase, tracked.** Metrics, labels, payment states, dates, system signals.
- `.metric` — mono, tabular-nums, for numbers.
- `.card` / `.card-interactive` — bordered graphite surface.
- `.route-rule` — the fading indigo→cyan hairline. Section furniture.
- `.btn-primary` / `.btn-secondary` / `.btn-ghost` — all ≥ 44px tall.
- `.pill-status` / `.pill-signal` / `.pill-indigo` / `.pill-coral` — status pills, all ≥ 28px tall.

## Typography rules

- `font-display` = **Instrument Serif**, single weight. Headlines only. **Never** apply `font-bold`
  to it — there is no bold cut and the browser will synthesise a fake one.
- `font-sans` = **Archivo variable**. All body copy and UI.
- `font-mono` = **JetBrains Mono**. Metrics, labels, payment states, dates, system signals.
  **Never prose.**
- Section headings go through `<SectionHeader>`. Don't hand-roll an `<h2>`.

## Spacing

8px system only: `2 / 4 / 6 / 8 / 10 / 12 / 16 / 20 / 24` in Tailwind units. No odd values.

## Motion rules — these are hard requirements

1. **Wrap entrance animation in `<Reveal>`** (`src/components/ui/Reveal.jsx`). Nothing else.
2. `<Reveal>` animates **opacity + a ≤12px vertical lift only**. Never translate on X — that is
   exactly what clipped full-width mobile cards off the left edge in the previous build.
3. Never write `animate={inView ? {...} : {}}`. An empty animate target strands content at
   `opacity: 0` forever. Use `<Reveal>`.
4. No looping animation. No typewriter. No custom cursor. No aurora/blob backgrounds.
   The only ambient pattern on the site is `bg-ledger bg-grid`.
5. Under `prefers-reduced-motion`, `<Reveal>` renders a plain element with no motion wrapper.
   Check `useReducedMotion()` before adding anything else that moves.
6. Numbers count up **once** via `<CountUp>`, which exposes the final value to screen readers.

## Accessibility requirements

- One `<h1>` on the page (the hero owns it). Sections use `<h2>`, cards `<h3>`. No level skips.
- Every section is `<section id="…" aria-labelledby="…">` pointing at its heading.
- Icon-only controls need `aria-label`. Decorative icons/images need `aria-hidden="true"` / `alt=""`.
- Interactive tap targets ≥ 44×44 (the `.btn-*` and `.pill-*` classes already do this).
- **Never rely on hover** to reveal information. Everything reachable by keyboard and touch.
- **Never communicate state by colour alone** — pair every colour with a text label.
- Expand/collapse uses a real `<button>` with `aria-expanded` and `aria-controls`.
- Filter groups: real `<button>`s with `aria-pressed`, and announce the result count.

## Responsive requirements

Must be correct at **320 / 375 / 390 / 768 / 1024 / 1440**. `document.scrollWidth` must never
exceed the viewport width. Prefer `min-w-0` + `flex-wrap` over fixed widths. Long strings
(emails, URLs) need `break-words` or `truncate` with a title.

## Content rules — non-negotiable

- **Never invent** an employer, date, outcome, metric, testimonial, skill or project claim.
- Every number must trace to `src/data/experience.js`, `src/data/metrics.js`, `src/data/work.js`
  or `src/data/lab.js`. If a number isn't in the data layer, it doesn't go on the page.
- Prose lives in the data layer where it's reused; one-off section copy can be inline.
- **Cap tech lists at 4 items.** Cards argue why the work mattered, not what was installed.

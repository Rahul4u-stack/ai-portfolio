# Rahul Agarwal — portfolio

**Positioning:** the Product Manager and AI Builder who turns complex payment infrastructure
problems into shipped products.

🔗 **Live:** [ai-portfolio-seven-drab.vercel.app](https://ai-portfolio-seven-drab.vercel.app/)

---

## Design concept — "The Payment Intelligence Network"

A payment integration is a routing problem. So the site is built as a routing board.

The hero carries an interactive five-stage network — **Documentation → Extraction → Validation →
Integration → Shipped** — with roughly one packet in four failing validation and being *rerouted*
rather than dropped. That reroute is the argument for keeping human validation gates in an LLM
pipeline, and it dramatises the signature outcome: **integration turnaround 2 weeks → 2 days**.

Visual direction is "fintech control room meets editorial product case study": deep ink surfaces,
warm off-white type, one electric indigo accent, cyan and green used strictly as *signals*, coral
reserved for tension. Editorial serif headlines against a technical grotesk body, with monospace
held back for metrics, labels, payment states, dates and system signals.

Read [`docs/design-system.md`](docs/design-system.md) before changing any component.

## Information architecture

```
Hero               → the claim + the signature visual + 4 proof metrics
01 Selected impact → 6-metric outcome dashboard, each with context and a source
02 Selected work   → 4 case studies as Problem → Constraint → Decision → System → Outcome
   Pull quote
03 Decisions I'd defend → 3 interactive decision records (incl. what I'd reconsider)
04 Experience      → compact expandable timeline, engineering → product → AI building
05 AI & Build Lab  → filterable grid of smaller builds and experiments
06 About           → short and human
07 Contact         → "Let's make it shippable" + a mailto path that cannot fail
```

Case-study routes: `/case-study/payment-intelligence-network` (how this site was built),
`/case-study/personal-chatbot`, `/case-study/youtube-summarizer`, `/case-study/snake` ·
plus `/resume.pdf`. Unknown routes render a real not-found page.

## Stack, and what is deliberately absent

React 18 · Vite 5 · Tailwind 3 · React Router 7 · Vitest · ESLint (strict jsx-a11y) · Prettier.
Self-hosted fonts: Instrument Serif (display), Archivo variable (body), JetBrains Mono (data).
No animation library — see below.

| Considered | Verdict |
|---|---|
| Motion for React / framer-motion | **Removed entirely.** After the redesign the only motion left is an opacity + 12px lift (plain CSS) and one hand-written rAF loop — ~35 kB gzipped of animation runtime bought nothing. `useReducedMotion` is hand-rolled via `useSyncExternalStore`. |
| React Three Fiber + Drei | **Rejected.** The routing visual is 5 nodes and ~9 dots; it does not materially benefit from WebGL. SVG is smaller, keeps node labels as real text, and gives a still frame that cannot drift from the animated one. |
| Lenis | **Rejected.** Smooth-scroll hijacking risks anchors, keyboard paging and `prefers-reduced-motion`. Native scroll already works. |
| Magic UI | Patterns referenced, no dependency added. |
| `three`, `topojson-client`, `world-atlas` | **Removed** — they only served a disabled globe branch. |

## Motion and accessibility rules

- Nothing is revealed by an entrance animation that could fail. `<Reveal>` fails open: reduced
  motion, a missing IntersectionObserver, or an observer that never reports all render content
  immediately.
- `<Reveal>` animates opacity plus a ≤12px vertical lift. **Never** on the X axis — that is what
  clipped full-width mobile cards off the left edge in the previous build.
- No typewriter, no custom cursor, no aurora background, no looping animation. The routing
  network pauses when the tab is hidden and when it scrolls out of view.
- Numbers count up once, via `<CountUp>`, which always exposes the final value to screen readers.
- WCAG 2.1 AA: skip link, landmarks, single `<h1>`, visible focus, 44px targets, no colour-only
  state. Colour contrast is enforced by `src/test/contrastTokens.test.js`.

## Content model

Everything editable lives in `src/data/`:

| File | Owns |
|---|---|
| `siteMeta.js` | canonical URL, titles, availability, `LAST_UPDATED` |
| `metrics.js` | the impact dashboard — every entry names its source role |
| `work.js` | the 4 featured case studies |
| `lab.js` | smaller builds + filter tags |
| `decisions.js` | the 3 decision records |
| `experience.js` | career timeline + education (must match `public/resume.pdf`) |
| `social.js` | email, phone, Formspree ID, social links |

**Rule:** if a number isn't in the data layer, it doesn't go on the page. "Last updated" is
derived from the last git commit date at build time (`vite.config.js`) — never hard-coded.

## Local development

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # production build → dist/
npm run preview      # serve dist/ locally
npm test             # vitest
```

## CI

`.github/workflows/ci.yml` runs `npm ci` → `lint` → `format:check` → `build` → `test` on every push and PR to `main`.

## Built by

[Rahul Agarwal](https://www.linkedin.com/in/rahul-agar/) — Product Manager · Payments · AI Builder.
IIT Roorkee (CS) · IIM Kozhikode (MBA).

Hiring a PM for a payments or AI-forward team?
[Portfolio](https://ai-portfolio-seven-drab.vercel.app/) · [LinkedIn](https://www.linkedin.com/in/rahul-agar/)

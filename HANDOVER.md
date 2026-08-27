# HANDOVER

Everything a new maintainer (human or agent) needs to work on this repo without re-deriving it.
Last substantive change: **2026-08-27** — second improvement pass (case study, 404 route,
phone-width disclosures, ESLint/Prettier, repo pruning) on top of the 2026-08-01 redesign.

> **Read this before `README.md`.** The README is the public-facing description; this is the
> working document — conventions, the reasoning behind decisions, the traps, and what's unfinished.

---

## 1. What this is, and what it's for

Rahul Agarwal's portfolio. Its job is to make a recruiter or hiring manager conclude, within five
seconds, that this is **the Product Manager and AI Builder who turns payment infrastructure problems
into shipped products** — and to still be memorable three days later.

Live: https://ai-portfolio-seven-drab.vercel.app/ · Repo: `Rahul4u-stack/ai-portfolio`

It is a static React SPA. No backend, no database, no auth, no API routes. The only network call
the site makes at runtime is the Formspree POST from the contact form.

---

## 2. Quick start

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # vitest, 191 tests across 13 files
npm run lint     # eslint (react, hooks, strict jsx-a11y)
npm run format:check
npm run build    # → dist/
npm run preview  # serve dist/
```

CI (`.github/workflows/ci.yml`) runs lint → format check → build → test on Node 22 for every
push and PR to `main`. ESLint runs `@eslint/js` recommended + react + react-hooks + **strict
jsx-a11y**; Prettier owns style (`.prettierrc.json`; `src/content/` is deliberately excluded so
prose never gets rewrapped).

**Current state: 109 files uncommitted on `main`.** The redesign has never been committed. Branch
before you commit:

```bash
git checkout -b redesign/payment-intelligence-network && git add -A
```

---

## 3. Repo map

```
src/
├── App.jsx                     routes + homepage section order
├── main.jsx                    font imports live here, not in CSS
├── index.css                   design tokens as @layer components classes
├── data/                       ← ALL editable content. Start here.
│   ├── siteMeta.js             canonical URL, titles, availability, LAST_UPDATED
│   ├── metrics.js              the 6-metric impact rail
│   ├── work.js                 the 4 featured case studies
│   ├── lab.js                  smaller builds + filter tags
│   ├── decisions.js            the 3 decision records
│   ├── experience.js           career timeline + education + ERAS
│   ├── frameworks.js           the 3 "working beliefs"
│   ├── shipped.js              DERIVED project count — see §4
│   └── social.js               email, phone, Formspree ID, social links
├── components/
│   ├── Navbar.jsx              skip link, scroll spy, mobile dialog
│   ├── Footer.jsx
│   ├── CaseStudyPage.jsx       markdown route, lazy-loaded
│   ├── hero/
│   │   ├── Hero.jsx            the claim + proof rail
│   │   └── RoutingNetwork.jsx  the signature visual — read §7 before touching
│   ├── sections/               ImpactRail, SelectedWork, Decisions, Beliefs,
│   │                           Experience, BuildLab, About, Contact
│   └── ui/                     Reveal, SectionHeader, CountUp, PullQuote, BackToTop
├── hooks/                      useRevealed, useReducedMotion, useDocumentMeta
├── lib/routingNetwork.js       pure simulation model (no DOM, no React)
├── content/case-studies/*.md   four long-form case studies (incl. the site's own build)
└── components/NotFound.jsx     catch-all route — unknown paths must never render an empty shell
scripts/
├── serve.mjs                   production-matched local server (USE THIS for Lighthouse)
└── probe.mjs                   CDP responsive probe (true 320–1440px viewports)
```

`docs/design-system.md` is the binding contract for tokens, motion, a11y and content rules.
**Read it before writing any component.**

---

## 4. The content model — the rule that matters most

> **If a number isn't in `src/data/`, it does not go on the page.**
> **Never invent an employer, date, outcome, metric, testimonial, skill or project claim.**

This isn't stylistic. The previous site shipped four claims that didn't survive checking, and a
portfolio that overstates is worse than one that understates. When you find a conflict between two
claims, **flag it — do not pick one and move on.**

### Derived, never typed

`src/data/shipped.js` computes the shipped-project count by counting entries that expose a link a
stranger can open (live demo or public repo). It currently resolves to **8** and deliberately
excludes the internal Paysecure workflow, which is real work with no public artefact. It is
surfaced in the About section. Four tests in `dataIntegrity.test.js` guard it, including one that
recounts independently so the two can't silently drift apart.

`LAST_UPDATED` comes from the last git commit date, injected by `vite.config.js` at build time.
It is never hard-coded and must never become a fake "live" indicator.

### The four claims that were corrected (confirmed by Rahul, 2026-08-01)

| Was | Problem | Now |
|---|---|---|
| "7+ Years in Product" | Product roles start Jun 2021 ≈ 5y2m. ~7y only if you count Infosys + Amazon engineering. | Number kept, **relabelled to years in tech, across engineering and product**. |
| "10+ AI Products Shipped" | The data held 8. | **Derived** via `shipped.js`. Resolves to 8. |
| "…products like Smart Pantry" | No repo, no link, no evidence anywhere. | **Removed.** Re-add the day the repo exists. |
| "$3.4M+ GMV" | Source bullet says "$3.4M", no plus. | Plus dropped. |

`experience.js` must stay in sync with `public/resume.pdf`. `dataIntegrity.test.js` asserts the
specific résumé numbers the rest of the site quotes (300+, 2 weeks → 2 days, −20%, $3.4M, 99.9%),
so if you edit the résumé, that test tells you what else to update.

---

## 5. Design system — the load-bearing parts

Full contract in `docs/design-system.md`. The parts people get wrong:

**Concept.** "Fintech control room meets editorial product case study." Deep ink, warm off-white
type, one electric indigo accent. Cyan and green are *signal* colours (routing state, shipped
outcomes); coral means tension or a hard call. Used sparingly or they stop signalling.

**Type.**
- `font-display` = Instrument Serif, **single weight**. Headlines only. Never apply `font-bold` —
  there is no bold cut and the browser will synthesise a fake one.
- `font-sans` = Archivo Variable. All body copy.
- `font-mono` = JetBrains Mono. **Metrics, labels, payment states, dates, system signals only.
  Never prose.**

> ⚠️ The Tailwind `sans` stack must start with `"Archivo Variable"` — that is the family name
> `@fontsource-variable/archivo` actually registers. It was set to `"Archivo"` for a while, which
> silently fell through to the system sans and the webfont **never downloaded at all**. Green build,
> no console error, looked almost right. `contrastTokens.test.js` now asserts the exact name.

**Colour.** Never hard-code a hex. Every text token is contrast-verified in
`contrastTokens.test.js` — if you add a text colour, add its assertion. `indigo.DEFAULT` is
3.89:1 on ink, so it is large/bold text or non-text only; white *on* it is 5.00:1, so it's fine as
a button fill.

**Spacing.** 8px system only.

**Ambient pattern.** `bg-ledger bg-grid` is the *only* one. No aurora, no blobs, no gradients
behind every section. (`backgroundSize` is named `grid`, not `ledger`, because two theme keys with
the same name both generate `.bg-ledger` and silently collide.)

---

## 6. Motion and accessibility — non-negotiable

These encode real defects that shipped before. Don't relax them without reading §8.

1. **All entrance animation goes through `<Reveal>`.** Nothing else.
2. **`<Reveal>` animates opacity + a ≤12px vertical lift. Never on the X axis.** X-axis animation
   is what clipped full-width mobile cards off the left edge in the previous build.
3. **Never write `animate={inView ? {...} : {}}`.** An empty animate target strands content at
   `opacity: 0` forever.
4. `useRevealed` **fails open**: reduced motion → visible immediately; no IntersectionObserver →
   visible immediately; observer present but silent → a 400ms safety timer reveals anyway.
5. **No looping animation, no typewriter, no custom cursor, no autoplaying media.**
6. Numbers count up **once**, via `<CountUp>`, which always exposes the final value to screen readers.
7. One `<h1>` (the hero owns it). Sections `<h2>`, cards `<h3>`. No level skips.
8. Every section is `<section id aria-labelledby>` pointing at its own heading.
9. **`aria-controls` must point at an element that exists** — render panels always and toggle
   `hidden`, or drop the attribute while the target is unmounted.
10. Interactive targets ≥44×44. (Two exemptions are known and fine: the `sr-only` skip link when
    unfocused, and the inline "Prefer email?" link, which WCAG exempts as in-sentence.)
11. **Never rely on hover** to convey information. **Never convey state by colour alone** — every
    coloured chip carries a text label.

---

## 7. Architecture decisions, and why

### The routing network (`components/hero/RoutingNetwork.jsx`)

The signature visual: packets travel Documentation → Extraction → Validation → Integration →
Shipped; roughly one in four fails validation and is **rerouted, not dropped**. That reroute is the
argument for human validation gates in an LLM pipeline — it's the point of the diagram, not decoration.

- **SVG, not Canvas, not WebGL.** Five nodes and ~9 dots gain nothing from a GPU renderer. SVG keeps
  node labels as real selectable text, and makes the reduced-motion still frame the *same markup*
  with the loop simply never started — so the two can't drift apart.
- `lib/routingNetwork.js` is a **pure model** — topology and timing, no DOM, no React. Geometry
  lives in the renderer, so one simulation drives both the wide and narrow layouts.
- **The packet pool is a memoised, render-once component and the rAF loop owns its attributes
  outright.** If React owns `transform`, every re-render (the shipped counter ticking, a pointer
  moving) snaps every packet back to its start position mid-flight. This is load-bearing.
- The loop pauses when the tab is hidden and when the figure is offscreen. **The still frame renders
  underneath from the start** and the first live frame hides it — so "paused" degrades to "still",
  never to an empty diagram.

### Dependencies — what was rejected and why

Current runtime deps: `react`, `react-dom`, `react-router-dom`, `react-icons`, `react-markdown`,
`remark-gfm`, and three `@fontsource` packages. That's it.

| Considered | Verdict |
|---|---|
| **framer-motion** | **Removed.** After the redesign the only motion was opacity + a 12px lift — plain CSS. It was costing ~37 kB gzipped on the critical path. `useReducedMotion` is now hand-rolled (~30 lines). |
| **React Three Fiber + Drei** | Rejected. See above — no material benefit for this visual. |
| **Lenis** | Rejected. Smooth-scroll hijacking risks anchors, keyboard paging and `prefers-reduced-motion`. Native scroll already works. |
| **Magic UI** | Patterns referenced, no dependency added — importing the library imports its visual identity. |
| `three`, `topojson-client`, `world-atlas` | Removed. They only served a globe branch that had been switched off; the code still *imported* them behind a const-false branch, which kept them alive. |

**Bar for adding anything:** if CSS can do it cleanly, CSS does it.

### Build config (`vite.config.js`)

- Injects `__LAST_UPDATED__` from the last git commit date.
- A small plugin preloads the three latin webfonts. Fonts are referenced from *inside* the CSS
  bundle, so the browser can't discover them until the stylesheet parses; filenames are
  content-hashed, so they're read out of the emitted bundle rather than hard-coded.
- **There is deliberately no `manualChunks`.** Naming the markdown renderer as its own chunk
  promoted it to a top-level chunk, which made Vite emit `<link rel="modulepreload">` for it in
  `index.html` — so every homepage visitor downloaded 43 kB of markdown renderer for a page that
  renders no markdown. The lazy route in `App.jsx` is what actually defers it.

### Deployment

Vercel, auto-deploy from `main`. `vercel.json` holds a rewrite whose negative lookahead lists every
real static file — **if you add a file to `public/`, add it to that lookahead**, or the SPA fallback
will serve `index.html` for it. (That's how `/sitemap.xml` used to return HTML with a 200.)

---

## 8. Bugs that are fixed and must stay fixed

Each has a regression test. If you're changing nearby code and a test here fails, you have
reintroduced a real, user-visible defect — don't delete the test.

| Defect | Root cause | Guarded by |
|---|---|---|
| Mobile cards clipped off the left edge | Entrance animation from `x: -60` on full-width cards | `Reveal.test.jsx` — asserts no negative X translate |
| Content stranded invisible forever | `animate={inView ? {...} : {}}` — empty target keeps `initial` | `Reveal.test.jsx` — fail-open behaviour |
| Packets reset mid-flight | React owned an attribute the rAF loop writes | `RoutingNetworkMotion.test.jsx` — re-renders mid-flight, asserts no backwards movement |
| Skip link announced nothing | `<main>` had no `tabIndex={-1}`; focus stayed on `<body>` | `App.test.jsx` |
| Nav highlight stuck after scrolling back to top | Observer only ever *set* the active section; "no longer intersecting" was ignored | `Navbar.test.jsx` — scroll-spy clears |
| Dangling `aria-controls` | Attribute pointed at a conditionally-mounted element | `Navbar.test.jsx`, `interactions.test.jsx` |
| Body font never loaded | Family name mismatch (`Archivo` vs `Archivo Variable`) | `contrastTokens.test.js` |
| A filter that matched nothing | Removed the only entry carrying a tag, left the filter | `dataIntegrity.test.js` |
| Same outcome printed three times per card | Preview panel + outcome band + stats row all rendered it | `dataIntegrity.test.js` |

### Two self-inflicted regressions worth remembering

- **A "fix" that cost 4 seconds of blocking time.** Adding a synchronous `getBoundingClientRect()`
  in every `Reveal` effect to reveal above-the-fold content instantly = ~30 forced layouts on mount.
  Desktop TBT went 30ms → 600ms, mobile → 3,980ms. **Measure after every performance change, not
  just after features.**
- **`manualChunks` made code-splitting worse** — see §7.

---

## 9. Verification — and the traps that produce fake defects

**Tests pass ≠ it looks right.** The single worst defect found in the redesign was a Build Lab
thumbnail showing a screenshot of the *July light-cream version of this very site*, on a page that
is otherwise entirely dark. No assertion can catch that. Render the page and look at it.

Three traps that each produced a convincing but non-existent bug:

1. **`--window-size` cannot test narrow viewports.** Headless Chrome clamps the CSS viewport to a
   **500px minimum**, so a screenshot at "320" is a crop of a 500px layout and looks catastrophically
   broken. Use CDP `Emulation.setDeviceMetricsOverride` instead. Node 22 has a built-in `WebSocket`,
   so driving CDP needs no library.
2. **A plain static server makes Lighthouse lie.** `python3 -m http.server` sends no compression and
   no cache headers, so the build gets scored for the *server's* shortcomings. Serve through
   something that mirrors Vercel (Brotli/gzip + immutable caching on hashed assets + SPA fallback).
   Also: `--form-factor=desktop` alone keeps **mobile throttling while grading on the desktop
   curve** — use `--preset=desktop`.
3. **Motion cannot be verified by screenshot.** The Claude Code preview pane always reports
   `document.hidden === true`, so a correctly-written rAF loop legitimately pauses there and CSS
   transitions stall mid-way — a screenshot then shows content at ~60% opacity and reads as
   "stranded invisible". `--virtual-time-budget` doesn't reliably advance rAF either. Drive the
   frame loop in a test with a fake clock, and **make the fake `cancelAnimationFrame` actually
   cancel** — otherwise a superseded loop runs beside the live one and looks like a product bug.

There is a fourth trap: **full-page CDP captures show `loading="lazy"` images as blank boxes**
(`captureBeyondViewport` doesn't scroll, so lazy images never load). A screenshot with empty dark
rectangles where the work-card images belong is a capture artifact, not a defect — scroll the card
into view before judging media.

And a fifth, the most instructive: **never compare Lighthouse scores across different serving
conditions.** The redesign case study's first draft compared the old *live* deployment against the
new build on a *local* server — a fact-checking agent rejected it, the old commit (`c6da960`) was
rebuilt and re-measured on the identical rig (evidence: `notes/qa-redesign/baseline-c6da960-*.json`),
and the honest like-for-like gap turned out modest (mobile 92 → 97). The real wins are payload
(403 → 211 KiB mobile transfer), tests, and layout correctness.

Also: **Lighthouse TBT is worthless on a busy machine.** Three consecutive runs of an identical
build read 57 / 97 / 59. Kill orphaned headless Chrome processes first (`pkill -f "Google
Chrome.*--headless"`), then take a median of three.

### Required checks before shipping a change

- `npm test` and `npm run build`
- Widths **320 / 375 / 390 / 768 / 1024 / 1440** — `document.scrollWidth` must never exceed the
  viewport, and no element may extend past either edge
- Keyboard-only: skip link first, focus always visible, dialog traps and restores focus, Escape closes
- `prefers-reduced-motion` — every section readable, nothing animating, still frame labelled
- Console clean, no failed requests
- Lighthouse desktop and mobile

### Current measurements (2026-08-01, median of 3, quiet machine)

| | Perf | A11y | BP | SEO | LCP | CLS | TBT | SI |
|---|---|---|---|---|---|---|---|---|
| Desktop | 100 | 100 | 100 | 100 | 0.55s | 0 | 0ms | 0.38s |
| Mobile | 97 | 100 | 100 | 100 | 2.42s | 0 | 18ms | 1.51s |

Bundle: `index.js` 254.97 kB / **82.72 kB gzipped**. Homepage fetches exactly one script.
Page height: 11,887px @1440, 19,505px @375. Zero horizontal overflow at all six widths.

---

## 10. Open work

**Blocking nothing, but unfinished:**

1. **Commit and deploy.** The redesign plus this second pass have never been committed — the live
   site still serves the July build. Everything else on this list is smaller than this.
2. **Formspree end-to-end** was confirmed working by Rahul (2026-08-27); no action.
3. **`notes/interview-prep.md`** is personal rehearsal notes sitting in a public repo. Rahul's call.
4. **Custom domain** — the Vercel auto-name is still the weakest thing for recall.
5. **Field data** — every performance number is a lab measurement; after deploy, read real-user
   Core Web Vitals (PageSpeed Insights / Vercel analytics) before optimising further.

**Done since the first pass (2026-08-27):** mobile page height −8.3% via per-item disclosures;
catch-all 404 route; fourth case study (`/case-study/payment-intelligence-network`); ESLint +
Prettier wired into CI; `notes/` pruned 41 MB → ~5 MB; verification tools moved into `scripts/`;
`public/.DS_Store` removed; last-updated derives build time on a dirty tree.

**Phase 2 idea, not started:** an "Ask Rahul's Portfolio" experience grounded *only* in `src/data/`
and the four case-study markdown files, refusing anything outside that corpus. The content model
is already the single source of truth, so it needs no new data work — and it would make the "AI as
a delivery system" claim self-demonstrating rather than merely stated.

---

## 11. Working conventions for this repo

- **Non-trivial changes use the 4-agent pattern**: supervisor (read-only strategy) → frontend +
  backend in parallel → testing. Agent definitions live in `~/.claude/agents/`.
- **The testing agent must render and look**, not just assert. Rahul should never be the one to
  spot a visual defect.
- **Every build gets a plan document** at `Plans & Roadmaps/AI Plans/Project Plans/`, written for a
  PM rather than an engineer: glossary, plain-English framing, per-phase Terminal verification
  commands, and an **"Interesting Findings & Blockers (per phase)"** section filled in *as* the
  blockers happen. The plan for this redesign is
  `Week-8_Portfolio-Payment-Intelligence-Network.md` — it has the full findings log.
- **Report what actually happened.** During this build I reported the project count as "now derived
  from the data" when I had only *deleted* the false claim; the derivation didn't exist yet.
  Deleting a wrong claim and replacing it with a right one are different pieces of work, and
  conflating them is its own inaccuracy.

## 12. Where the older history lives

`docs/week6b-strategy.md`, `docs/week6c-strategy.md`, `notes/ui-refresh-strategy.md`,
`notes/dark-restyle-strategy.md`, `notes/dark-gradient-restyle-spec.md` and
`notes/globe-intro-strategy.md` describe superseded versions of this site. They are kept for
context on *why* things were tried, not as descriptions of current behaviour — the globe intro,
the scroll-scrubbed video, the aurora background, the typewriter hero and the testimonials block
are all gone. Recoverable from git history at `c6da960` if ever needed.

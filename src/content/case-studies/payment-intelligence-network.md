# The Payment Intelligence Network — Case Study

*The site you are reading was itself the product. This is how it was rebuilt in a day by a
coordinated team of AI agents — and what that process caught that tests alone never would have.*

---

## 1. One-line pitch

A portfolio rebuilt as a payment-routing control room, by a coordinated team of AI agents.

## 2. Why this exists — the problem

A visitor gives a portfolio about five seconds before deciding whether to keep reading.
The previous version of this site was well-built but generic: a dark theme, a typewriter
headline, a wall of equal-weight sections. Nothing about it said *payments infrastructure*, and
its strongest claim — an AI workflow that cut payment-integration turnaround from two weeks to
two days — was buried as the second bullet of a job entry.

There was a second, quieter problem: the site made claims its own data couldn't back. It said
"10+ AI products shipped" while listing eight. It said "7+ years in product" when the product
roles added up to five. A portfolio that overstates is worse than one that understates, because
the audience is precisely the people whose job is to check.

## 3. AI capability demonstrated

**Multi-agent orchestration with adversarial verification** — decomposing one build into
specialised agent roles (strategy, two parallel builders, testing), then turning independent
agents loose on the result with instructions to *disprove* it: render every viewport and look,
re-measure every performance claim, trace every number back to a source.

## 4. AI tools used

- **Claude Code** — Claude Opus 5 for the rebuild, Claude Fable 5 for the follow-up passes —
  with custom subagent definitions for each role
- A **4-agent build pattern**: read-only supervisor → two builders working different sections in
  parallel (this site has no backend, so both took frontend) → a testing agent briefed that
  "looks wrong but tests pass" counts as a failure
- **Agent-driven browser verification**: headless Chrome over the DevTools Protocol for true
  320–1440px viewport emulation, keyboard-only passes, and reduced-motion audits
- **AI-generated design assets**: the Open Graph card and app icons rendered from the site's own
  design tokens through headless Chrome

## 5. Other tech

React 18 · Vite 5 · Tailwind CSS 3 · Vitest (191 tests at the time of writing) · GitHub Actions CI · Vercel.
Self-hosted fonts: Instrument Serif, Archivo Variable, JetBrains Mono.

## 6. Architecture decisions & trade-offs

### 6.1 Chose hand-rolled SVG over React Three Fiber for the signature visual

The hero's routing network — payment packets travelling Documentation → Extraction → Validation →
Integration → Shipped, with one in four failing validation and being rerouted rather than dropped —
is five nodes and about nine moving dots. A WebGL scene graph buys nothing at that scale and costs
a renderer, a larger bundle, and a harder fallback story. SVG keeps the node labels as real
selectable text, and makes the reduced-motion still frame *the same markup* with the animation
loop simply never started — so the two versions cannot drift apart.

### 6.2 Chose to delete the animation library rather than optimise it

After the redesign, the only motion left on the site was an opacity fade with a 12px lift, one
scroll-progress bar, and the routing loop. That is plain CSS plus one `requestAnimationFrame`.
Removing it cut the homepage JavaScript from ≈117 kB to ≈80 kB gzipped at the time of removal,
and removed a whole class of animation-library edge cases with it. The general form of this decision:
when a dependency's remaining job fits in 30 lines you can read, write the 30 lines.

### 6.3 Chose a render-once packet pool that React never touches

The moving packets are positioned imperatively inside the animation loop. Early versions let React
own the same `transform` attribute — so every re-render, including the "shipped" counter ticking
up, snapped every packet back to its start position mid-flight. The fix was structural: the packet
pool is a memoised component React commits exactly once, and the loop owns its attributes outright.
A regression test re-renders mid-flight and asserts no packet ever moves backwards.

### 6.4 Chose derived claims over typed ones

The shipped-project count on the site is computed from the project data itself — an entry counts
only if it exposes a link a stranger can open (a live demo or a public repository). Internal work,
however real, is excluded. The count can never again disagree with the list below it, because it
*is* the list below it. Four previously published claims were corrected the same way: relabelled,
recomputed, or removed entirely when no public evidence existed.

### 6.5 Chose fail-open entrance animation

Scroll-triggered reveals are the classic way to lose content: an observer that never fires strands
a section at zero opacity forever, and an x-axis slide-in clips full-width cards off a phone
screen — both had shipped in earlier versions of this site. The rebuilt reveal animates opacity
and a small vertical lift only, and fails open: reduced motion, a missing IntersectionObserver, or
a silent observer all render content immediately. Nothing on the page is ever *revealed by* an
animation; animation is only ever a garnish on content that was already going to appear.

### 6.6 Chose to let the lazy route do the code-splitting

An explicit `manualChunks` entry for the markdown renderer looked like an optimisation and did the
opposite: naming the chunk promoted it to a top-level module that Vite preloaded on the homepage,
handing every visitor 43 kB of markdown renderer for a page that renders no markdown. Deleting the
config and letting the lazy case-study route own the split is what actually deferred it. The
homepage now fetches exactly one script.

## 7. What I'd do differently / v2 plans

- **Instrument real users before trusting lab numbers.** Every performance figure below is a
  controlled local measurement. The next step is field data — real-device Core Web Vitals from
  actual visitors — before optimising anything further.
- **Make the portfolio answerable.** A v2 "ask this portfolio" experience, grounded strictly in
  the site's own data files and case studies and refusing anything outside that corpus, would turn
  the content-governance work into a live demonstration instead of a description.

## 8. Outcome

Rebuilt **2026-08-01** — and this page ships with the redesign it describes, so if you are
reading it on [the live site](https://ai-portfolio-seven-drab.vercel.app/), you are looking at the
outcome. Source: [repository](https://github.com/Rahul4u-stack/ai-portfolio).

| Measure — identical local rig, medians of three runs | Old build | Redesign |
| --- | --- | --- |
| Lighthouse, mobile | 92 / 100 / 100 / 100 | **97 / 100 / 100 / 100** |
| Lighthouse, desktop | 100 / 100 / 100 / 100 | **100 / 100 / 100 / 100** |
| Mobile Speed Index | 2.55 s | **1.88 s** |
| Mobile Largest Contentful Paint | 2.70 s | **2.35 s** |
| Homepage JavaScript, gzipped | ≈117 kB | **≈83 kB** |
| Homepage transfer, mobile run | 403 KiB | **211 KiB** |
| Automated tests | 119 | **191** |
| Phone-width layout | content clipped off-screen | **zero overflow at all six test widths** |

A measurement confession that belongs in the open: an earlier draft of this table showed a far more
dramatic Lighthouse gap, using scores taken from the old *live deployment* — where every kilobyte
crossed a real network — against the new build on a local server. A fact-checking pass rejected the
comparison, so the old build was rebuilt from its commit and re-measured on the identical rig you
see above. Like for like, the score gap is modest; the differences that survive honest measurement
are the halved payload, the test coverage, and the phone-width layout going from broken to clean.
That is a smaller headline and a truer one.

## 9. Design questions, answered

**Why does a portfolio need a validation gate in its hero diagram?**
Because the diagram is an argument, not a decoration. The pipeline it draws — AI does the reading,
humans hold the gate — is the same design that cut real payment-integration turnaround from two
weeks to two days across 300+ integrations. The diagram fails one packet in four — a rate chosen
to be visible, not a measured statistic — because what matters is what happens at the gate:
rerouted, never dropped. That reroute *is* the reason the speed was safe to buy.

**If AI agents built the site, what stopped them shipping something wrong?**
Structure, not trust. Every number renders from a single data layer, and tests assert the claims —
including a test that fails if the shipped-project count ever disagrees with an independent recount
of the data. Separate verification agents then attacked the finished build: one of them caught the
"this portfolio" card showing a screenshot of an obsolete version of the very page it sat on — a
defect no assertion could ever express, found only because an agent rendered the page and looked.

**What actually broke during the build?**
Three favourites. The body font silently never loaded, because the font package registers itself
under a different family name than the obvious one — the build stayed green while every paragraph
rendered in a system fallback. A performance "fix" added a synchronous layout measurement to every
section and pushed mobile blocking time to nearly four seconds before the next measurement caught
it. And
headless Chrome turned out to clamp its viewport to a 500px minimum, which made a healthy layout
look catastrophically broken at 320px — a fake defect that cost a real investigation. All three are
now regression-tested or documented traps.

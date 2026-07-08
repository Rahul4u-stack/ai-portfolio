# Strategy: Portfolio Dark Gradient Restyle — Frontend Builder Brief

> Supervisor agent, 2026-07-08. Style spec (exact reference values): `notes/dark-gradient-restyle-spec.md`.
> Directive: full restyle to the dark gradient system; **structure remains the same** (sections, pages, routes, content, component files unchanged).

## 1. Current-state audit

**Baseline (verified)**: `npm run build` green (55KB CSS). `npm run test` → **47/47 passing**, 12 test files. Any regression is attributable to this restyle.

**Stack**: React 18 + Vite 5 + Tailwind 3.4 + Framer Motion 11 + react-router-dom 7. Fonts via `@fontsource*` (Inter 400/500/600/700, `@fontsource-variable/fraunces`, JetBrains Mono 400/500). CI: `.github/workflows/ci.yml` (build + test on push/PR to main).

**Pages/routes**: `/` (Hero, About, Experience, Projects, Skills, Education, Contact, Footer) and `/case-study/:slug` (CaseStudyPage, lazy, ReactMarkdown over `src/content/case-studies/*.md`: `snake`, `personal-chatbot`, `youtube-summarizer`).

**Components** (`src/components/`): Navbar (scroll-spy IntersectionObserver, scroll-progress bar exists at 2px, mobile overlay), Hero, About (animated counters, photo), Experience (alternating timeline), Projects (FeaturedProjectCard/CompactProjectRow/ProjectLinks), Skills, Education, Contact (mailto form), Footer, CaseStudyPage, ui/SectionHeading, ui/GameEmbed, ui/VideoEmbed. Hooks: useReducedMotion (threaded through every animated component), useDocumentMeta.

**Current tokens** (light editorial): `paper #F9F7F3`, `ink`, `neutral.*` (dead code), `warm.*`, `accent` (#d1543e / text #a83a27 / hover #9c3520), semantic surface/text/border aliases. fontFamily: sans Inter, display "Fraunces Variable", mono JetBrains Mono.

**Styling-coupled tests that WILL break**:
- `src/test/contrastTokens.test.js` — hardcodes light-theme values (paper, accent.text, ink-soft, warm.text, vignette #e9e6e4). **Full rewrite required.**
- `src/test/Navbar.test.jsx` — two progress-bar selectors assert `h-\[2px\]` → must become `h-\[3px\]`.
- All other test files assert behavior/structure/text, not classes/colors — should pass untouched.

**Data files** (`src/data/*.js`): projects (8, 4 featured), experience (5 roles; first `period: 'Mar 2025 – Present'`), education, skills, social. **No edits.**

## 2. Token map (contrast COMPUTED via WCAG relative luminance)

```js
// tailwind.config.js — colors, REPLACES the editorial block
colors: {
  surface: '#0a0a0f',
  'surface-raised': '#121218',
  'surface-elevated': '#16161d',
  'border-subtle': 'rgba(255,255,255,0.08)',
  'border-muted': 'rgba(255,255,255,0.16)',
  'text-primary': '#e5e7eb',
  'text-secondary': '#d1d5db',
  'text-muted': '#9ca3af',
  accent: {
    DEFAULT: '#6366f1',   // indigo-500 — NON-TEXT UI only (dots, underlines, thin borders)
    text: '#818cf8',      // indigo-400 — ALL small/body accent TEXT
    hover: '#4f46e5',     // indigo-600 — SOLID button/CTA fill
  },
  emerald: { DEFAULT: '#10b981', bg: 'rgba(16,185,129,0.15)' }, // "Current" badge
},
backgroundImage: {
  'brand-gradient': 'linear-gradient(90deg, #6366f1, #ec4899 50%, #38bdf8)',
},
boxShadow: {
  'glow-indigo': '0 0 24px -4px rgba(99,102,241,0.35)',
  'card-lift': '0 8px 30px -12px rgba(0,0,0,0.5)',
},
```
Remove: `paper`, `paper-raised`, `ink`, `ink-soft`, `neutral.*`, `warm.*`, `backgroundImage.fade-to-raised/fade-from-raised`. Keep `borderRadius.xl2` and the fluid `fontSize` clamp scale unchanged.

**Computed ratios** (key pairs):
| Pair | Ratio | Verdict |
|---|---|---|
| text-primary #e5e7eb on #0a0a0f | 15.95:1 | pass |
| text-primary on glass (#19191d = 6% white composite) | 14.16:1 | pass |
| text-secondary on base | 13.40:1 | pass |
| text-muted #9ca3af on base / glass | 7.78 / 6.90 | pass |
| accent.text #818cf8 on base / glass | 6.62 / 5.88 | pass |
| accent.DEFAULT #6366f1 on base | 4.42:1 | pass 3:1 only → NON-TEXT use |
| **white on #6366f1 fill** | **4.47:1** | **FAILS AA small text** |
| white on pink #ec4899 / sky #38bdf8 fill | 3.53 / 2.14 | fails |
| **white on #4f46e5 (chosen fill)** | **6.29:1** | **pass** |
| emerald text on emerald.bg composite | 6.43:1 | pass |

**KEY DECISION**: the raw tri-gradient has NO text color passing 4.5:1 across all stops. Small-text surfaces (buttons, active nav pill) use SOLID `#4f46e5` + white text. Tri-gradient reserved for: large text ≥24px bold (heading keywords — all three stops individually clear 3:1 on base: 4.42/5.60/9.22) and non-text (logo mark, progress bar, underlines, rings, borders).

## 3. Font plan

- Add `@fontsource/barlow` (confirmed on npm, OFL). Import 400/500/600/700 in `src/main.jsx`.
- Remove Fraunces import from main.jsx AND `npm uninstall @fontsource-variable/fraunces` (~146KB woff2 currently shipped).
- Drop Inter imports entirely; KEEP JetBrains Mono (eyebrow numerals, chips, metrics).
```js
fontFamily: {
  sans: ['Barlow', ...defaultTheme.fontFamily.sans],
  display: ['Barlow', ...defaultTheme.fontFamily.sans], // keep key → zero className renames
  mono: ['JetBrains Mono', ...defaultTheme.fontFamily.mono],
},
```

## 4. Atmosphere plan

**`src/components/ui/Atmosphere.jsx`** (new) — mounted ONCE in App.jsx, `fixed inset-0 -z-10 pointer-events-none overflow-hidden`, static (no reduced-motion guard needed):
- Blob layer, exact spec values: `radial-gradient(ellipse 60% 50% at 12% 10%, rgba(99,102,241,0.20), transparent), radial-gradient(ellipse 50% 50% at 88% 18%, rgba(236,72,153,0.15), transparent), radial-gradient(ellipse 40% 40% at 80% 70%, rgba(139,92,246,0.15), transparent), radial-gradient(ellipse 60% 60% at 50% 95%, rgba(56,189,248,0.16), transparent)` (one div, multi-bg inline style)
- Grid layer on top at `opacity-40`: `linear-gradient(90deg, hsla(0,0%,100%,0.05) 1px, transparent 1px), linear-gradient(180deg, hsla(0,0%,100%,0.05) 1px, transparent 1px)`, backgroundSize `64px 64px`

**Scroll-progress bar**: ALREADY EXISTS in Navbar.jsx (~lines 81-84). Change `h-[2px]` → `h-[3px]`, fill `bg-accent-text` → `bg-brand-gradient`. Update the two Navbar.test.jsx selectors accordingly.

**`src/components/ui/BackToTop.jsx`** (new): circular glass button bottom-right (`bg-white/[0.06] backdrop-blur-md border border-white/[0.08]`), visible when scrollY > 400, scrolls to top, fade gated by useReducedMotion. New test file `src/test/BackToTop.test.jsx` (visibility threshold + click behavior).

**Pill navbar**: keep 100% of Navbar logic. Desktop links wrapped in pill container `rounded-full bg-white/[0.05] backdrop-blur-md border border-white/[0.08] px-2 py-1.5`; active link `bg-[#4f46e5] text-white` (SOLID, not gradient); inactive `text-text-muted hover:text-text-primary`. Logo: `w-8 h-8 rounded-lg bg-brand-gradient` mark + name text with gradient-clipped second part (large/bold, 3:1-safe). Scrolled navbar bg → `bg-surface/80 backdrop-blur-md border-b border-white/[0.05]`. Mobile overlay `bg-paper` → `bg-surface/95 backdrop-blur-xl`.

## 5. Component-by-component changes

- **tailwind.config.js**: colors + fontFamily + backgroundImage/boxShadow per §2/§3.
- **index.css**: `::selection` → new accent.text/surface; scrollbar → border-muted/surface. Body line needs no edit (tokens repoint).
- **index.html**: theme-color `#0d0c0f` → `#0a0a0f`.
- **main.jsx**: font import swap.
- **App.jsx**: add `<Atmosphere />` + `<BackToTop />`.
- **Navbar.jsx**: per §4; progress bar test-coupled (fix Navbar.test.jsx).
- **Hero.jsx**: remove warm-wash blob div (superseded by Atmosphere); role line `text-accent` → `text-accent-text`; primary CTA `bg-accent-hover hover:brightness-110 text-white` (drop text-paper); secondary CTA structure stays.
- **About.jsx**: photo border `border-warm-200` → `border-white/[0.08]`; stats cards → glass `bg-white/[0.05] border-white/[0.08] hover:border-white/[0.16] backdrop-blur-sm`; stat numbers `text-accent` → `text-accent-text`.
- **Experience.jsx**: timeline dot stays `bg-accent`; center line `bg-warm-200` → `bg-white/[0.10]`; cards → glass; **add emerald "Current" badge** on the entry whose `period` includes 'Present' (conditional string-match, no data edit).
- **Projects.jsx**: cards → glass; `bg-paper-raised` → `bg-white/[0.05]`; badges/chips/metric tokens repoint fine.
- **Skills.jsx / Education.jsx**: same glass swap pattern.
- **Contact.jsx**: inputs + `focus:ring-2 focus:ring-accent/40`; submit button same fix as Hero CTA.
- **Footer.jsx**: token repoint only.
- **CaseStudyPage.jsx**: zero edits expected — all classNames already semantic tokens; verify visually on all 3 slugs.
- **ui/SectionHeading.jsx**: split `title` on last space; last word gets `bg-brand-gradient bg-clip-text text-transparent`; rest `text-text-primary`. Ghost numeral: `text-warm-text` → `text-text-muted`. (SectionHeading.test.jsx asserts accessible name — survives the span split.)
- **ui/GameEmbed.jsx**: `bg-ink/40` → `bg-black/40` etc.; Play pill → `text-white`.
- **ui/VideoEmbed.jsx**: token repoint only.

**Tests to update**: contrastTokens.test.js (FULL rewrite: text tokens ≥4.5:1 on surface AND #19191d glass composite; accent.text ≥4.5:1 both; accent.DEFAULT documented 3:1 non-text; white on #4f46e5 ≥4.5:1; each gradient stop ≥3:1 on surface). Navbar.test.jsx (h-[3px]). BackToTop.test.jsx (new). Others: unchanged, re-run to confirm.

**Framer Motion / reduced-motion patterns: unchanged everywhere.** ClassName-only restyle.

## 6. Phases + verification

- **P1 tokens/fonts/meta**: config + main.jsx + index.html + package.json; `npm install`; `npm run build` must pass; `npm run test` — contrastTokens WILL fail (expected, confirms swap).
- **P2 rewrite contrastTokens.test.js**: `npm run test` back to green (Navbar untouched yet).
- **P3 Atmosphere + Navbar + BackToTop** (+ test updates): `npm run test`, `npm run build`, `npm run dev` manual check (blobs, grid, pill nav, solid-indigo active pill, 3px gradient progress bar, back-to-top).
- **P4 sections** (Hero→Footer): targeted `npm run test -- <Name>` per component; full suite + build at end.
- **P5 CaseStudyPage**: render all 3 slugs in dev, confirm dark skin, unchanged hierarchy; `npm run test -- CaseStudyPage`.
- **P6 regression + Lighthouse**: full test suite; `npm run build`; `npm run preview` + `npx lighthouse http://localhost:4173 --preset=desktop` → ≥95 desktop; record mobile honestly (Week-3a precedent).
- **P7 cleanup**: uninstall fraunces if not done; `ls dist/assets | grep -iE 'fraunces|inter'` must be empty; final `npm run test && npm run build`.

## 7. Locked decisions

- Gradient keyword = last word of each SectionHeading title, generic implementation (About **Me**, **Experience**, **Projects**, **Skills**, **Education**, Let's **Connect**). No copy changes.
- Buttons + active nav pill: solid #4f46e5 + white text. NEVER the tri-gradient behind small text.
- Eyebrow ghost numerals ("01"–"06") stay — converting to text labels would be a content change, excluded by directive.
- "Current" badge: conditional render on existing `period` string, allowed flourish.
- `paper/ink/warm/neutral` tokens deleted outright (no shim) — all usages cataloged above.
- Editorial fonts removed from bundle (fraunces uninstalled, Inter imports dropped, Barlow single-family + JetBrains Mono).

## Out of scope
No copy/content changes · no new routes/sections/data fields (beyond the conditional badge) · no CI changes · no OG image regeneration (theme-color meta only).

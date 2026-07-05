# Week 6c Strategy — Portfolio Editorial Redesign (Cosmos-inspired)

Supervisor output for the frontend-builder. Read the approved plan first:
`Plans & Roadmaps/AI Plans/Project Plans/Week-6c_Portfolio-Editorial-Redesign.md`. This doc is the execution spec — every hex value and class name a builder needs is here. No source files were edited to produce this document.

---

## 1. Approved text ramp (contrast-checked)

**Method:** WCAG 2.1 relative-luminance formula, computed directly (not eyeballed). Background = paper `#F9F7F3` unless noted. AA thresholds: body text ≥ 4.5:1, large text (≥24px, or ≥18.66px bold) ≥ 3:1.

| Token | Hex | Ratio vs `#F9F7F3` | Verdict | Approved use |
|---|---|---|---|---|
| `paper` (bg) | `#F9F7F3` | — | — | Page background |
| `paper-raised` (alt bg) | `#f2f1f0` | 1.05:1 vs paper | n/a (bg-on-bg) | Alternating section background / card fill |
| `ink` | `#0d0d0d` | 18.16:1 | PASS (AAA) | Headlines, highest-emphasis text |
| `ink-soft` | `#323131` | 12.12:1 | PASS (AAA) | Body text default, nav links |
| `warm-gray-600` (was mid gray) | `#5a5a5a` | 6.45:1 | PASS (AA, body) | Secondary body text, captions |
| `warm-text` | `#6e6a69` | 5.00:1 | PASS (AA, body — 0.5 margin) | Muted body text, metadata, mono labels on paper |
| `warm-gray-400` | `#919191` | 2.95:1 | **FAIL body**, borderline large-only | Large decorative text ≥24px only, or non-text UI (borders, dividers) — never body copy |
| `warm-text-light` | `#9a9796` | 2.71:1 | **FAIL** — text use | Do not use for any text. OK for hairline borders/dividers only (non-text contrast has no AA text minimum) |
| `warm-gray-200` | `#d0cdcd` | 1.48:1 | **FAIL** — text use | Borders, dividers, hover fills only — never text |
| terracotta (accent, bright) | `#d1543e` | 3.89:1 | **FAIL body (4.5:1)**, PASS large/bold ≥18.66px | Large headline accents, icon fills, focus-ring color, hover backgrounds — NOT small link text |
| **terracotta-text (darkened, NEW)** | **`#b8432e`** | **5.06:1** | **PASS (AA body)** | **All inline links / small terracotta text** — this is the fix for the #1 risk item |

**Action taken:** the plan's bright terracotta `#d1543e` fails AA for body-sized link text (3.89:1 < 4.5:1). I darkened it ~10% to `#b8432e` (5.06:1, PASS) for any terracotta text under 18.66px/bold. Keep `#d1543e` only for large/bold accents, icon glyphs, focus outlines (focus rings have no text-contrast requirement, only the 3:1 non-text UI-component minimum, which it clears against paper). **Do not use `#d1543e` for small inline links or nav text — use `#b8432e`.**

### Final Tailwind color tokens (for `tailwind.config.js`)

```js
colors: {
  paper: '#F9F7F3',
  'paper-raised': '#f2f1f0',
  ink: '#0d0d0d',
  'ink-soft': '#323131',
  warm: {
    600: '#5a5a5a',   // secondary body
    text: '#6e6a69',  // muted body / metadata
    400: '#919191',   // large-only / non-text
    light: '#9a9796', // borders/dividers only, never text
    200: '#d0cdcd',   // borders/dividers/hover fill
  },
  accent: {
    DEFAULT: '#d1543e',   // large/bold accents, icons, focus ring
    text: '#b8432e',      // ALL small terracotta text/links (AA-safe)
    hover: '#9c3520',     // link hover — darker still, 6.67:1, gives clear hover feedback
  },
},
```

---

## 2. Font-swap confirmation

- **Add:** `@fontsource-variable/fraunces` (variable serif, headlines only).
- **Remove:** `@fontsource/space-grotesk` (package.json dependency + all three weight imports in `src/main.jsx` lines 8-10).
- **Keep unchanged:** `@fontsource/inter` (body), `@fontsource/jetbrains-mono` (labels/captions/chips/eyebrows).

**`src/main.jsx` changes:**
- Remove lines 8-10 (`@fontsource/space-grotesk/500.css`, `/600.css`, `/700.css`).
- Add `import '@fontsource-variable/fraunces/standard.css'` (or `/opsz.css` axis file — use the standard build for simplicity; static weight files are not needed since it's a variable font).

**`tailwind.config.js` `fontFamily` changes:**
```js
fontFamily: {
  sans: ['Inter', ...defaultTheme.fontFamily.sans],
  display: ['"Fraunces Variable"', 'Fraunces', 'ui-serif', 'Georgia', ...defaultTheme.fontFamily.serif],
  mono: ['JetBrains Mono', ...defaultTheme.fontFamily.mono],
},
```
`font-display` utility class usage stays identical across all components (Hero.jsx, Navbar.jsx logo, SectionHeading.jsx, CaseStudyPage.jsx markdown h1/h2) — only the underlying font-family value changes. No className renames needed for the font swap itself.

**`package.json`:** add `"@fontsource-variable/fraunces": "^5.x"` to dependencies, remove `"@fontsource/space-grotesk"`.

---

## 3. Full token-swap table (dark → editorial)

### `tailwind.config.js` — `theme.extend.colors`

| Current (dark) | Value | New (editorial) | Value |
|---|---|---|---|
| `primary` | `#0d0c0f` | retire (unused pattern; use `paper`/`ink` directly) | — |
| `secondary` | `#151318` | retire | — |
| `neutral.950` | `#0d0c0f` | `ink` | `#0d0d0d` |
| `neutral.900` | `#151318` | `paper-raised` (repurposed as light "raised" bg) | `#f2f1f0` |
| `neutral.800` | `#211f26` | `warm.200` | `#d0cdcd` |
| `neutral.700` | `#39353f` | `warm.200` | `#d0cdcd` |
| `neutral.600` | `#5a5563` | `warm.400` | `#919191` |
| `neutral.500` | `#8b8593` | `warm.text` | `#6e6a69` |
| `neutral.400` | `#a9a3b0` | `warm.light` | `#9a9796` |
| `neutral.200` | `#dcd9df` | `warm.200` | `#d0cdcd` |
| `neutral.50` | `#f7f6f8` | `paper` | `#F9F7F3` |
| `accent.from` | `#7c5cff` | retire (gradient concept dies) | — |
| `accent.to` | `#00d4c8` | retire | — |
| `accent.DEFAULT` | `#8a6dff` | `accent.DEFAULT` | `#d1543e` |
| `accent.hover` | `#9c84ff` | `accent.hover` | `#9c3520` |
| `surface` | `#0d0c0f` | `paper` | `#F9F7F3` |
| `surface-raised` | `#151318` | `paper-raised` | `#f2f1f0` |
| `surface-elevated` | `#211f26` | `paper-raised` (or `white` for card-on-card lift — use `#ffffff` if a third tier is needed) | `#f2f1f0` / `#ffffff` |
| `text-primary` | `#f7f6f8` | `ink` | `#0d0d0d` |
| `text-secondary` | `#dcd9df` | `ink-soft` | `#323131` |
| `text-muted` | `#a9a3b0` | `warm.text` (body use) — **use `accent.text` never here** | `#6e6a69` |
| `border-subtle` | `#39353f` | `warm.200` | `#d0cdcd` |
| `border-muted` | `#5a5563` | `warm.400` | `#919191` |

**Semantic-name preservation:** keep the *same token names* (`surface`, `text-muted`, `border-subtle`, etc.) mapped to new hex values wherever possible — this means most component className strings (`bg-surface`, `text-text-muted`, `border-border-subtle`) do **not** need to change, only the token definitions in `tailwind.config.js`. This is the Week 3a token-system payoff the plan references. Exceptions requiring className edits are listed per-component in Section 5.

### `tailwind.config.js` — other changes
- `boxShadow.glow-accent`: `'0 0 40px -10px rgba(124,92,255,0.35)'` → retire entirely (no glow effect in editorial look) OR repurpose as a very soft warm shadow `'0 8px 30px -12px rgba(13,13,13,0.12)'` for photo/card lift. Recommend: rename to `boxShadow.card-lift` with the warm value; keep `card` shadow but soften: `'0 4px 24px -8px rgba(13,13,13,0.4)'` → `'0 4px 24px -8px rgba(13,13,13,0.08)'`.
- `keyframes.gradient-x` / `animation.gradient-x`: retire — used only by Hero.jsx's animated gradient text, which retires (Section 5).
- Add new gradient-fade utility for section transitions (Cosmos-style soft bands): implement as a `background-image: linear-gradient(...)` utility via `theme.extend.backgroundImage`, e.g. `'fade-to-raised': 'linear-gradient(to bottom, transparent, #f2f1f0)'`. Exact bands defined in Phase 2 by the builder; supervisor confirms only that `color-mix`/gradient-fade sections replace hard `border-t` dividers currently used in Footer.jsx (`border-t border-border-subtle`) and section boundaries.

### `src/index.css`

| Current rule | Action |
|---|---|
| `body::before` noise overlay (lines 13-21, SVG feTurbulence) | **DELETE entirely.** Editorial look has no noise texture. |
| `::selection` using `accent.DEFAULT / 30%` | Keep pattern, new color resolves to terracotta automatically via token swap — but verify selection text stays readable: `background: theme('colors.accent.DEFAULT / 20%')` (lower opacity works better on light bg), `color: theme('colors.ink')`. |
| `:focus-visible` outline `accent.DEFAULT` | Keep — resolves to `#d1543e` automatically, 3:1+ against paper, passes non-text UI contrast requirement. |
| `::-webkit-scrollbar-track` → `colors.surface` | Resolves automatically to paper. |
| `::-webkit-scrollbar-thumb` → `colors.border-muted`, hover `colors.neutral.500` | Resolves automatically to warm grays — verify visually it isn't invisible on paper (warm.400 `#919191` should be visible enough against `#F9F7F3` bg since it's a UI element with a defined shape, not text). |
| `body` → `bg-surface text-text-primary font-sans antialiased` | No class change needed — token remap handles it. |

---

## 4. Per-component changes (Phases 1–4 mapping)

All className strings below use the **existing semantic token names** — since those tokens are remapped in `tailwind.config.js`, most components need **zero className edits** for color. Edits below are only for: (a) hardcoded non-token colors, (b) gradient/glow effects that must be removed outright, (c) layout changes the plan calls for.

### `src/components/Hero.jsx` (Phase 2)
- Lines 49-50: radial gradient blobs `bg-accent-from/10`, `bg-accent-to/5` — **DELETE** (accent-from/to retire). Replace with nothing or a single soft `bg-warm-200/40 blur-[120px]` wash if the builder wants a subtle background element; plan allows for restraint (Cosmos uses whitespace, not blobs).
- Lines 54-61: grid pattern `rgba(255,255,255,0.1)` lines — **DELETE**, hardcoded white doesn't work on paper. If a grid is kept, use `rgba(13,13,13,0.04)`.
- Line 88: `bg-gradient-to-r from-accent-from to-accent-to bg-clip-text text-transparent` + `animate-gradient-x` — **DELETE the gradient-text treatment.** Replace with static `text-accent` (large bold text, `#d1543e` passes at 3:1+ for this size) or `font-display` serif styling per plan's "large Fraunces headline" direction.
- Line 111: `hover:shadow-lg hover:shadow-glow-accent` — remove or repoint to the new soft `card-lift` shadow.
- Line 162: `bg-gradient-to-b from-accent to-transparent` (scroll indicator line) — fine to keep, single-color-to-transparent isn't a retiring gradient.
- Photo/hero treatment: plan calls for hero photo "treated editorially" — this section currently has no photo (About.jsx has it); confirm with plan intent this refers to About.jsx's photo, not adding one to Hero.

### `src/components/ui/SectionHeading.jsx` (Phase 2)
- Line 18-20: ghost number — `text-transparent` + `WebkitTextStroke: '1px rgba(247,246,248,0.06)'` (hardcoded dark-theme white-based stroke) — **must change.** Either delete the ghost-number visual entirely (plan says "ghost numbers removed") while **keeping the `<span aria-hidden="true">{number}</span>` element in the DOM** (SectionHeading.test.jsx asserts on this element's presence/aria-hidden attribute), or restyle it as a small mono kicker label instead of a giant outlined numeral. Recommend: repurpose as a visible mono eyebrow (`font-mono text-xs uppercase tracking-widest text-warm-text`) positioned above the heading rather than a giant background numeral — satisfies "mono kickers" in the plan and keeps the test's DOM query (`getByText('03')`, `aria-hidden="true"`) passing.
- Line 24: `font-display font-bold text-text-primary` → keep classes, font resolves to Fraunces automatically, color resolves to ink automatically.
- Line 28: `bg-gradient-to-r from-accent-from to-accent-to` underline bar — **DELETE gradient**, replace with solid `bg-accent` (terracotta) or remove the bar entirely per editorial minimalism (Cosmos doesn't use underline bars).

### `src/components/About.jsx` (Phase 2)
- Line 100: `bg-accent/20 rounded-2xl blur-xl` glow behind photo — remove or soften drastically (`bg-warm-200/30`) — glow effects are a dark-theme signature, kill them.
- Line 101: `border-accent/30 shadow-2xl shadow-glow-accent` — replace with a plain thin border (`border border-warm-200`) and the new soft `card-lift` shadow, or no shadow at all (editorial photos often sit flush with a caption below, no glow).
- Line 165: card `hover:border-accent/30` — fine, resolves automatically.
- AnimatedCounter (lines 14-52) and stats data (lines 7-12): **DO NOT TOUCH LOGIC.** This is the crawler-visible stats behavior protected in Section 6. Only its container's classNames (`bg-surface-raised`, `text-accent`, `text-text-muted`) restyle via token remap — zero logic changes.
- Hero photo `src/assets/rahul-hero.webp`: keep as-is, confirmed to already fit editorial look per plan.

### `src/components/Navbar.jsx` (Phase 2)
- Line 82: scroll-progress bar `bg-gradient-to-r from-accent-from to-accent-to` — **DELETE gradient**, replace with solid `bg-accent-text` or `bg-accent`.
- Line 91: `bg-surface/95 backdrop-blur-md` — **remove `backdrop-blur-md`** (glassmorphism retires per plan). Use a plain `bg-paper/95` or fully opaque `bg-paper` with a hairline `border-b border-warm-200` shadow instead.
- Line 130: underline-on-hover gradient `from-accent-from to-accent-to` — **DELETE gradient**, replace with solid `bg-accent`.
- Line 170: mobile overlay `bg-surface/98 backdrop-blur-lg` — **remove `backdrop-blur-lg`**, same reasoning.
- Logo "RA" (line 109) `font-display` — resolves to Fraunces automatically.

### `src/components/Experience.jsx` (Phase 2)
- Line 23: timeline dot `shadow-[0_0_12px_2px_rgba(138,109,255,0.6)]` — hardcoded purple glow, **must change** to a terracotta-based or removed glow: `shadow-[0_0_8px_1px_rgba(209,84,62,0.4)]` or delete for a flat dot.
- Line 26: `before:bg-accent/40 before:animate-ping` pulse — fine to keep, color resolves automatically via token.
- Line 66: `bg-gradient-to-b from-accent-from/50 via-accent-to/30 to-transparent` center line — **DELETE gradient**, replace with solid `bg-warm-200` or `bg-accent/30`.

### `src/components/Skills.jsx` (Phase 2)
- No hardcoded non-token colors found. All classNames (`bg-surface-raised`, `border-accent/20`, `bg-surface-elevated/50`, `text-text-secondary`) resolve automatically via the token remap. No edits required beyond the global swap.

### `src/components/Education.jsx` (Phase 2)
- No hardcoded non-token colors. Same as Skills.jsx — token remap only.

### `src/components/Contact.jsx` (Phase 2)
- Line 56 `inputClasses`: `bg-surface-elevated border border-border-subtle ... focus:border-accent` — resolves automatically. Verify input placeholder text (`placeholder:text-text-muted`) still passes contrast at `warm.text` (5.00:1, PASS) against the input's `paper-raised`/`white` background — recompute if input bg differs from page bg (see Section 1 note: ratios given are against `#F9F7F3`; if inputs sit on `#f2f1f0` the ratio drops marginally to 4.74:1, still PASS).

### `src/components/Footer.jsx` (Phase 2)
- Line 5: `border-t border-border-subtle bg-surface` — resolves automatically to `border-warm-200 bg-paper`. No edit needed.

### `src/components/Projects.jsx` (Phase 3)
- Lines 74, 76: `bg-gradient-to-br from-accent-from/0 to-accent-to/0 hover:from-accent-from hover:to-accent-to` (both `FeaturedProjectCard` and `CompactProjectRow`) — **DELETE gradient-border-on-hover pattern entirely** (this is a dark-theme "glow border" trick). Replace with a simple `border border-warm-200 hover:border-accent transition-colors` on the outer card div — much more editorial.
- Line 76 `before:bg-white/5` — hardcoded white highlight line, **DELETE** (glass-effect relic).
- Line 91: empty-icon fallback `bg-gradient-to-br from-accent-from/10 to-accent-to/10` — **DELETE gradient**, replace with flat `bg-paper-raised` — this is also the **typographic-card fallback slot** for projects without imagery (Section 5 imagery decisions feed directly into this element).
- Line 100: `bg-accent/10 text-accent` "Featured" pill — fine, resolves automatically; verify `text-accent` (bright `#d1543e`) at this small pill-text size — pill text is small/bold-ish; recommend swapping to `text-accent-text` (`#b8432e`) here since it's small text, to stay AA-safe.
- Line 111, 145: `font-mono text-accent text-xs` metric text — **small text using bright accent, FAILS AA** — change to `text-accent-text` (`#b8432e`).
- Lines 41, 52, 61 (`ProjectLinks`), scattered `hover:text-accent` link states across nearly every component (Hero social icons, Navbar links, Footer icons, Contact links, CaseStudyPage markdown links) — **global rule: any small/link-weight text using the accent color must use `text-accent-text` (`#b8432e`), not `text-accent` (`#d1543e`).** This is the single most important cross-cutting fix from the contrast audit — flag it to the builder as a find-and-fix pass across all components, not just Projects.jsx.
- This is also where the **image-led card redesign** happens per Phase 3 of the plan — see Section 5 below for per-project asset decisions and the `image` field addition to `projects.js`.

### `src/components/ui/GameEmbed.jsx` (Phase 3)
- Line 12: `border border-border-subtle` — resolves automatically.
- Line 28: `bg-surface-elevated` — resolves automatically to `paper-raised`.
- Line 37: `bg-gradient-to-br from-accent-from/20 to-accent-to/20` fallback — **DELETE gradient**, replace with flat `bg-paper-raised` or use the project's `coverImage`/typographic fallback per Section 5.
- Line 39: `bg-surface/40 group-hover:bg-surface/20` overlay — resolves automatically to paper-tinted overlay; verify the white/light play button overlay still reads on top of a screenshot (may need to keep this overlay dark/ink-tinted for legibility even on a light theme: consider `bg-ink/40 group-hover:bg-ink/20` instead, since it sits ON TOP of an image, not the page background — this is an exception to the blanket light-token swap).
- Line 40: `bg-accent text-surface` Play button — this is button-on-image, large/bold text, `#d1543e` (3.89:1) is borderline; button also has a solid fill so use `text-paper` (white-ish) on `bg-accent` fill, which is a different contrast pair — background `#d1543e` vs text `#F9F7F3`: verify this pair separately (see Section 1 addendum below).

### `src/components/ui/VideoEmbed.jsx` (Phase 3)
- Line 7: `border border-border-subtle` — resolves automatically. No other changes; video poster (`video-resume-poster.webp`) already exists and fits editorial look per plan — confirm no re-shoot needed.

### `src/components/CaseStudyPage.jsx` (Phase 3)
- Line 97: `bg-surface` page wrapper — resolves automatically to paper.
- Lines 19-79 `markdownComponents`: every heading/text/link/code/table style resolves via token remap **except**:
  - Line 35: `text-accent hover:text-accent-hover underline` — this is inline link text inside prose, **must use `text-accent-text` (`#b8432e`)** not `text-accent`, per the global small-text rule above. `hover:text-accent-hover` should point to the new darker hover value `#9c3520`.
  - `max-w-[70ch]` prose width (line 98) — keep, plan explicitly calls for ~70ch prose width in editorial treatment.
- Headings (`h1`, `h2`, `h3`) using `font-display font-bold text-text-primary` — resolves to Fraunces + ink automatically; this is the "magazine-article treatment" the plan describes — no structural change needed, just the token/font swap cascading through.

---

## 5. Imagery inventory — per-project decision (feeds `projects.js` Phase 3 `image` field)

| Project | Decision | Source | Target path | Notes |
|---|---|---|---|---|
| Snake | **Real screenshot** | Live demo: `https://snake-game-nu-two-85.vercel.app` | `src/assets/projects/snake.webp` | Capture mid-gameplay frame (not blank start screen) via headless browser. Existing `GameEmbed` iframe mechanic stays; this image is the pre-activation cover (`coverImage` prop, currently unused — wire it up). |
| Personal Chatbot with Memory | **Real screenshot** | Live demo: `https://personal-chatbot-rust.vercel.app/` | `src/assets/projects/personal-chatbot.webp` | Capture chat UI with a sample exchange visible (not empty state) if TEST_MODE allows a canned conversation; otherwise capture the empty/welcome state cleanly. |
| AI Video Resume | **Existing asset, reuse** | `public/video/video-resume-poster.webp` (already exists, 20KB) | No new capture needed | `VideoEmbed` already uses this as `posterUrl`. Confirm it also gets referenced as the `image` field for consistency if `projects.js` schema wants one image field per project. |
| YouTube Summarizer | **Real screenshot** | Live demo: `https://youtube-summarizer-plum.vercel.app` | `src/assets/projects/youtube-summarizer.webp` | Capture the summary-output UI with a sample video summarized, not the blank input form, if feasible under TEST_MODE. |
| Calorie Estimator | **Real screenshot** | Live demo: `https://calorie-estimator.vercel.app` | `src/assets/projects/calorie-estimator.webp` | Non-featured (compact row) — smaller image treatment or icon-sized crop is acceptable per Phase 3's "compact rows restyled" language. |
| Personal AI News Assistant (Khabar) | **Typographic card — no screenshot** | N/A | `image: null` in `projects.js` | Telegram bot with no web UI; forcing a screenshot would mean shooting a Telegram chat window, which reads as low-effort. Big serif title on paper per plan's fallback rule ("never a fake/stock image"). |
| AI Portfolio Website | **Real screenshot, self-referential** | The live site itself: `https://ai-portfolio-seven-drab.vercel.app` — **capture AFTER Week 6c ships**, not before (capturing the old dark theme would be wrong) | `src/assets/projects/ai-portfolio.webp` | Sequencing note for the builder: this specific screenshot must be taken post-deploy in Phase 5, or the compact-row entry ships with `image: null` initially and gets a follow-up patch. Flag this explicitly — it's the one image that can't exist until the redesign is live. |

**Format target:** WebP, ≤120KB each, `src/assets/projects/`. Recommend capture at 1600×1000 (or matching aspect used in the featured card layout) then compress; verify with `du -sh` per the Phase 3 verification command in the plan.

**`projects.js` schema addition:** add an `image` key to every project object — either a path string or explicit `null` (the Phase 3 verification script in the plan checks for `undefined`, i.e. every project must make an explicit decision, `null` included).

---

## 6. Protect Week 6b — must NOT change in behavior

- **Case study routes + content:** `/case-study/:slug` routing in `App.jsx`, and `src/content/case-studies/*.md` (snake.md, personal-chatbot.md, youtube-summarizer.md) — content is untouched; only the rendering component's styling changes (`CaseStudyPage.jsx` markdownComponents, Section 4 above).
- **`AnimatedCounter` crawler-visible behavior** (`About.jsx` lines 14-52) — stats values (7+, $3.4M+, 300+, 5), animation logic, `AnimatedCounter` function itself: **zero logic edits.** Only the surrounding div's Tailwind classes restyle.
- **Featured-4 data model:** `featured: true/false` flag and filter logic in `Projects.jsx` (lines 160-161) — untouched. Imagery/layout changes in Section 5 apply within this existing model, not by changing which projects are featured.
- **`VideoEmbed` mechanics:** `preload="none"` (line 11) — must stay exactly as-is (perf-critical, don't autoload video). Only border/frame styling changes.
- **Hero photo:** `src/assets/rahul-hero.webp` — reused as-is, no re-shoot, no crop change. Plan confirms it "fits the editorial look naturally."
- **`vercel.json`** — no changes; SPA rewrite rule is unrelated to this visual pass.
- **Routing / `App.jsx` structure** — not touched beyond whatever cascades from component prop signatures (none should change).

### Tests likely touched by styling changes (read, not logic-coupled — confirmed via grep, zero hits for class-based assertions)
- `src/test/SectionHeading.test.jsx` — asserts on the ghost-number `aria-hidden` DOM element existing and its text content (`getByText('03')`), NOT on its visual stroke/outline style. **Safe** as long as the builder keeps the `<span aria-hidden="true">{number}</span>` element even when restyled as a mono kicker (see Section 4).
- `src/test/Hero.test.jsx`, `Navbar.test.jsx`, `Projects.test.jsx`, `About.test.jsx`, `GameEmbed.test.jsx`, `VideoEmbed.test.jsx`, `CaseStudyPage.test.jsx`, `App.test.jsx` — all grep-confirmed to contain **zero** className/color/font assertions. They test rendered text content, ARIA roles/labels, links' `href`s, and interactive behavior (button clicks, iframe activation). **None should break from the retheme** unless a builder accidentally removes/renames an element the tests query by role or text — keep all existing text content, `aria-label`s, and interactive element structures intact.
- No test file needs pre-emptive updating for styling reasons. Testing agent (Phase 5) should still re-run the full suite after each phase per the plan's verification commands, and may add a contrast smoke test if feasible.

---

## 7. Current test setup (confirmed)

- Runner: Vitest 3.2.6, jsdom 29.1.1, `@testing-library/react` 16.3.2 + `@testing-library/user-event` 14.6.1 + `@testing-library/jest-dom` 6.9.1.
- Config: `npm test` = `vitest run` (no watch). 10 test files, ~596 lines total, currently 42 tests total per the plan (test count to be confirmed by testing agent at Phase 5 baseline run before changes).
- `src/test/setup.js` and `src/test/mocks.js` exist for shared fixtures — no styling-related mocks found; safe to leave untouched.
- Build tool: Vite 5.0.8, Tailwind 3.4.0, PostCSS 8.4.32, autoprefixer 10.4.16 — standard, no changes needed to build config itself, only `tailwind.config.js` content (Section 3) and `package.json` dependencies (Section 2).

---

## 8. Addendum — solid-fill button contrast pair (flagged during Section 4 review)

The Play button in `GameEmbed.jsx` (line 40, `bg-accent text-surface`) and Contact's submit button (`Contact.jsx` line 134, `bg-accent hover:bg-accent-hover text-surface`) use **text-on-solid-fill**, a different contrast pair than text-on-paper:

```
text-surface (#F9F7F3) on bg-accent (#d1543e) = 3.89:1
```

This is the *same* 3.89:1 ratio computed earlier (contrast is symmetric), so it **fails AA for body/button text** (buttons follow the 4.5:1 body-text rule unless the label is ≥18.66px bold — these are `font-medium` at base/sm size, under that threshold). **Resolved fix (computed, not a flag):** swap the default button fill to `bg-accent-hover` (`#9c3520`) instead of `bg-accent` (`#d1543e`):

```
paper text (#F9F7F3) on accent-hover fill (#9c3520) = 6.67:1  → PASS (AA, comfortable margin)
paper text (#F9F7F3) on bright accent fill (#d1543e) = 3.89:1 → FAIL
```

**Action:** in `GameEmbed.jsx` (Play button) and `Contact.jsx` (submit button), make `#9c3520` (current `accent-hover` token) the **default** fill, and use the bright `#d1543e` only as the *hover/active* state (inverted from today's dark-theme convention, where the brighter color was default and an even-brighter tint was hover). Update `Contact.jsx` line 134 classes to `bg-accent-hover hover:bg-accent text-paper` and `GameEmbed.jsx` line 40 to the same pattern.

---

## Summary for the builder

1. Token remap in `tailwind.config.js` + `index.css` does ~80% of the work automatically because semantic names are preserved (Section 3).
2. The #1 manual fix required everywhere: **swap `text-accent` → `text-accent-text` (`#b8432e`) on all small/body-weight text and links** (Section 4's cross-cutting note). Keep bright `#d1543e` only for large/bold accents and non-text UI (borders, focus rings, icon fills).
3. Delete every `bg-gradient-to-*` from `accent-from`/`accent-to`, all `backdrop-blur-*`, the noise overlay, and all `shadow-glow-accent`/purple glow effects — full list in Section 4 per-component.
4. Ghost numerals in `SectionHeading.jsx` restyle to mono kickers but keep the same DOM element for test compatibility.
5. Imagery decisions and target paths are locked in Section 5 — capture screenshots before Phase 3 starts, except the self-referential AI Portfolio Website shot, which must wait until after deploy.
6. Nothing in Section 6 changes behavior — only className/token values touch those files.

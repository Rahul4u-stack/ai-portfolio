# Week 6b Strategy — Portfolio Recruiter-Lens Upgrade

**For:** frontend-builder (Phases 1–4). Testing agent picks up Phase 5.
**Source of truth:** `Plans & Roadmaps/AI Plans/Project Plans/Week-6b_Portfolio-Recruiter-Lens-Upgrade.md` — all decisions below are locked; this doc is execution detail, not a re-negotiation.
**Repo:** `AI Portfolio Projects/ai-portfolio` (React 18 + Vite 5 + Tailwind + Framer Motion, no router today, 26 Vitest tests).

> Glossary: see the plan doc's glossary table (SPA, crawler, useInView, react-router, react-markdown, lazy loading, poster frame, meta/OG tags, Lighthouse). Not repeated here.

---

## Repo facts the builder needs (verified 2026-07-05)

- `src/App.jsx` renders one flat tree: `Navbar, Hero, About, Experience, Projects, Skills, Education, Contact, Footer` — no router.
- Anchor nav is `href="#section"` + `scrollIntoView`, implemented independently in `Hero.jsx` (`handleScroll`) and `Navbar.jsx` (`handleLinkClick`). Navbar also has scroll-spy via `IntersectionObserver` (`activeSection` state) and a scroll-progress bar.
- Test runner: **Vitest** (jsdom env), config lives inline in `vite.config.js` (`test: {...}`), setup file `src/test/setup.js` installs `IntersectionObserver`/`matchMedia` mocks (`src/test/mocks.js`) and stubs `scrollIntoView`/`scrollTo` (jsdom doesn't implement them). `beforeEach` resets the IO mock and sets `prefersReducedMotion(false)`. New component tests should reuse these mocks, not reinvent them.
- `src/hooks/useReducedMotion.js` is a 3-line wrapper around Framer Motion's `useReducedMotion` — reuse this hook anywhere new motion is gated, do not call Framer's hook directly.
- **Discrepancy found:** `src/assets/rahul-hero.webp` (480×480, 20KB, verified WebP) already exists but is **not imported anywhere**. `About.jsx` currently renders `<img src="/profile.jpg" .../>` pointing at `public/profile.jpg`, which is a **1.2MB JPEG** (1024×1536) — a real Lighthouse/LCP risk hiding in plain sight. Phase 1 must swap this reference, not just "add a photo."
- `public/case-studies/Week-3_Personal-Chatbot-with-Memory.pdf` is the orphaned PDF referenced in the plan — delete in Phase 2, and remove its dangling link in the case-study Acknowledgements section (see below).
- `index.html` has OG/Twitter meta pointing at `/profile.jpg` too — leave homepage meta alone (out of scope), but new case-study pages need their own via the new hook (Phase 2).

---

## Video resume (Decision 6)

- File: `AI Portfolio Projects/video-resume/renders/video-resume_2026-05-16_14-00-02.mp4`
- Probed specs: **5.4 MB** (5,695,848 bytes) · H.264 1920×1080 · AAC audio · 94.0s · combined bitrate ~485 kbps.
- **Already under the ~10MB threshold — no GitHub-raw fallback needed.** Recommend a light re-encode anyway for margin and faster click-to-play (target ~3–4MB, visually identical at portfolio-embed size):
  ```bash
  ffmpeg -i "video-resume_2026-05-16_14-00-02.mp4" \
    -vf "scale=1280:-2" -c:v libx264 -crf 26 -preset slow \
    -c:a aac -b:a 96k -movflags +faststart \
    public/video/video-resume.mp4
  ```
  `-movflags +faststart` matters for web playback (moov atom up front). Verify output ≤10MB with `ls -lh public/video/video-resume.mp4` before committing.
- **Poster frame** (grab a mid-video frame, e.g. 40s in, avoids black intro/outro; convert straight to WebP, no separate cwebp needed since ffmpeg 8.1 encodes WebP natively):
  ```bash
  ffmpeg -ss 00:00:40 -i public/video/video-resume.mp4 -frames:v 1 \
    -vf "scale=1280:-2" -q:v 75 public/video/video-resume-poster.webp
  ```
  Check `ls -lh public/video/video-resume-poster.webp` ≤100KB; bump `-q:v` down (e.g. 60) if over.
- Embed as native `<video poster="/video/video-resume-poster.webp" preload="none" controls>` — never `autoplay`, never remove `preload="none"` (Lighthouse guardrail, and explicit Phase 4 verification greps for this string).

---

## Hero photo (Decision 7) — resolved, just wire it in

- Asset: `src/assets/rahul-hero.webp`, 480×480, 20KB, confirmed valid WebP. Already under the 50KB budget — no further compression needed.
- Import it in `Hero.jsx` (not `About.jsx`'s old `/profile.jpg` — decide one canonical location per Phase 1 task below) as an ES module import (`import heroPhoto from '../assets/rahul-hero.webp'`) so Vite fingerprints/hashes it, rather than referencing a `public/` path.
- Render with explicit `width={480} height={480}` (or Tailwind fixed-size classes) to avoid CLS, and `loading="eager"` since it's above the fold (per plan Phase 1 note).

---

## Case study source adaptation (Decision 1–2)

Target: `src/content/case-studies/{snake,personal-chatbot,youtube-summarizer}.md`

| Source | Lines | Adaptation needed |
|---|---|---|
| `snake-game/CASE_STUDY.md` | 54 | Clean as-is — no internal notes, no images, no relative links. Copy verbatim. Shortest of the three (good "quick read" case study). |
| `personal-chatbot/CASE_STUDY.md` | 232 | Has one relative-ish link: `[9-section AI PM framework](https://github.com/Rahul4u-stack/ai-portfolio)` (absolute, fine) and a link to the plan PDF in **Acknowledgements**: `../public/case-studies/Week-3_Personal-Chatbot-with-Memory.pdf` — **this PDF is being deleted in Phase 2**. Strip or rewrite that final Acknowledgements paragraph so it doesn't 404 (e.g. replace with plain text, no link). No other meta/internal notes. |
| `youtube-summarizer/CASE_STUDY.md` | 175 | Two relative links to `../AI Plans/Project Plans/Week-2_YouTube-Summarizer.pdf` (in "Findings worth knowing" section and the closing italic line) — these point outside the repo and will 404 on the live site. Strip the links, keep the surrounding prose as plain text (don't delete the content, just de-link it). No images in any of the three files. |

All three already follow the 9-section framework and are recruiter-voiced — no rewriting needed beyond the two link fixes above. Render via `react-markdown` + `remark-gfm` (tables appear in personal-chatbot and youtube-summarizer case studies — `remark-gfm` is required, not optional).

---

## Data model changes — `src/data/projects.js`

Add to **every** project object:
- `metric: '<one-line bold outcome/usage signal>'` (string)

Add to the 3 with case studies only:
- `caseStudy: '<slug>'` (`'snake' | 'personal-chatbot' | 'youtube-summarizer'`)

Set `featured: true` on exactly these 4 (per Decision 4) — note current data already has `featured: true` on Snake only; Personal Chatbot is currently `featured: false` and must flip to `true`; the other 5 have no `featured` key today (treated as falsy) — Video Resume and YouTube Summarizer must gain `featured: true`; Calorie Estimator, Khabar, and AI Portfolio Website get explicit `featured: false`:

1. Snake — `featured: true`, `caseStudy: 'snake'`
2. Personal Chatbot with Memory — `featured: true`, `caseStudy: 'personal-chatbot'`
3. AI Video Resume — `featured: true` (no case study yet)
4. YouTube Summarizer — `featured: true`, `caseStudy: 'youtube-summarizer'`
5. Calorie Estimator — `featured: false`
6. Personal AI News Assistant (Khabar) — `featured: false`
7. AI Portfolio Website — `featured: false`

### Draft 2-line descriptions + metric callouts (all 7)

Use these as the starting draft; builder may tighten wording but must preserve the bolded number/signal in each metric and keep descriptions to 2 lines at the card's actual rendered width (test visually, not just by character count):

**1. Snake**
- Description: "Classic Snake rebuilt from first principles — playable right in the card. Fixed-timestep game loop, pure-function rules, hand-shaded pseudo-3D look on plain Canvas 2D."
- Metric: `Shipped in 1 day · 25/25 tests in CI`

**2. Personal Chatbot with Memory**
- Description: "A payments-domain chatbot that remembers who you are across sessions, built on Anthropic's Memory Tool. Streaming SSE, per-user sandboxed memory, prompt-cached system prompt."
- Metric: `~90% cost cut on repeat turns · 82 tests (43 pytest + 39 vitest)`

**3. AI Video Resume**
- Description: "A 94-second video resume coded with Hyperframes, narrated by Kokoro TTS, captioned via Whisper — orchestrated end-to-end with Claude Code."
- Metric: `94s coded video · 7 scenes · shipped in a week`

**4. YouTube Summarizer**
- Description: "Paste a YouTube URL, get a structured AI summary — executive summary, key insights, action items. Long-context Claude with prompt caching, no chunking."
- Metric: `~90% cost cut on repeat lookups via prompt caching`

**5. Calorie Estimator**
- Description: "Upload a food photo, get instant calorie estimates powered by Claude's Vision API. React + Flask, deployed on Vercel + Render."
- Metric: `Single-photo → structured nutrition estimate in one Vision API call`

**6. Personal AI News Assistant (Khabar)**
- Description: "A Hermes 3 agent that DMs a 5-story AI news brief to Telegram every morning at 9 AM IST. LLM-driven web search, not brittle RSS feeds."
- Metric: `Running daily since 2026-05-12`

**7. AI Portfolio Website**
- Description: "This portfolio itself — built end-to-end by a 4-agent Claude Code system (supervisor, frontend, backend, testing) working in parallel."
- Metric: `Built entirely by orchestrated AI agents, zero hand-written boilerplate`

The existing long `description` paragraphs move to case-study pages (already there for the 3 that have them) or are simply retired for the 4 that don't — do not delete the source prose from case study `.md` files, only from `projects.js`.

---

## Phase-by-phase file map

### Phase 1 — Crawler-visible stats + hero photo
- `src/components/About.jsx`: `AnimatedCounter` — change `useState(0)` to `useState(value)` as initial state; gate the count-up `useEffect` on `inView && !prefersReducedMotion` (import `useReducedMotion` from `src/hooks/useReducedMotion.js`, already used elsewhere in this file's siblings). When motion is disabled or not yet in view, render the final value directly — never 0. Also replace the `<img src="/profile.jpg">` block — either remove it here or leave a single canonical photo in `Hero.jsx` per below (avoid duplicating the same photo in two sections; recommend keeping About's two-column photo but pointing it at the new asset, OR moving the photo to Hero only — builder's call, but pick one and don't show `/profile.jpg` anywhere in JSX after this phase).
- `src/components/Hero.jsx` and/or `src/components/About.jsx`: import `rahul-hero.webp`, render with explicit dimensions, `loading="eager"` if above the fold.
- New test: assert `AnimatedCounter`/`About` renders the real final numbers (`7+`, `$3.4M+`, `300+`, `5`) with `inView` mocked false — this is the literal crawler-bug regression test the plan calls for.
- Do not touch `public/profile.jpg` deletion in this phase unless no code references it anymore — confirm with `grep -rn "profile.jpg" src/ index.html` (index.html's OG tags reference it too; leave OG tags alone per out-of-scope, so the file itself must stay even if JSX stops using it).

### Phase 2 — Case study pages
- `package.json`: add `react-router-dom`, `react-markdown`, `remark-gfm` — these are the **only** new deps for the whole build.
- `src/main.jsx`: wrap `<App />` in `<BrowserRouter>`.
- `src/App.jsx`: convert to `<Routes>` — `/` renders the existing tree unchanged (same component, same behavior, same tests); `/case-study/:slug` renders `<CaseStudyPage />` via `React.lazy` + `<Suspense fallback=...>`.
- `src/components/CaseStudyPage.jsx` (new): reads slug from `useParams()`, maps slug → markdown file (static import map, e.g. `import.meta.glob` or an explicit `{snake: ..., 'personal-chatbot': ..., 'youtube-summarizer': ...}` object), renders via `<ReactMarkdown remarkPlugins={[remarkGfm]}>`. Style the prose container manually with existing Tailwind tokens (~70ch max width, `font-mono` for code fences, existing `text-text-primary`/`text-text-muted`/`text-accent` classes) — no new design tokens, no `@tailwindcss/typography` plugin (would be a 4th new dep beyond what's approved; ask before adding if truly needed, but manual prose styling should suffice for these markdown files which are mostly headings/paragraphs/tables). Include a "← Back to Projects" link that goes to `/#projects` (see routing note below) and its own `<title>`/meta via the new hook.
- `src/hooks/useDocumentMeta.js` (new): small hook, `useEffect` that sets `document.title` and upserts a `<meta name="description">` tag on mount, resets/restores on unmount (or resets to the site default — builder's call, but must not leak into the homepage when navigating back).
- **Cross-page anchor nav:** `Navbar.jsx`'s `handleLinkClick` and `Hero.jsx`'s `handleScroll` currently assume they're always on `/` (`document.querySelector(href)` + `scrollIntoView`). From `/case-study/:slug`, this does nothing (no `#about` element exists on that page). Fix: in both handlers, check `useLocation().pathname !== '/'` (or equivalent) — if not on `/`, `navigate('/' + href)` (React Router `navigate`, e.g. `/#projects`) instead of `scrollIntoView`; the browser's default hash-scroll on load handles the rest, OR do the two-step (`navigate('/')` then `scrollIntoView` after a short delay/`useEffect` on mount watching for a stored target hash) if instant hash-jump proves unreliable after route change. Recommend the simplest working version first (rely on native `#hash` scroll after navigation) and only add the manual scroll effect if testing shows it's needed.
- `src/data/projects.js`: add `caseStudy` field per data model section above.
- `src/components/Projects.jsx`: in `ProjectLinks`, add a third link when `project.caseStudy` is set — `<Link to={\`/case-study/${project.caseStudy}\`}>Case Study</Link>` (React Router `Link`, not `<a>`, so it doesn't full-reload) alongside existing Code/Live.
- Delete `public/case-studies/Week-3_Personal-Chatbot-with-Memory.pdf` and the now-empty `public/case-studies/` directory.
- Copy the 3 adapted markdown files into `src/content/case-studies/` per the adaptation notes above (strip the two dead relative links in personal-chatbot and youtube-summarizer).

### Phase 3 — Projects restructure
- `src/data/projects.js`: apply `featured` flags and `metric` fields exactly as specified above; rewrite all 7 `description` fields to the 2-line drafts above (builder may lightly edit for line-length fit).
- `src/components/Projects.jsx`: `FeaturedProjectCard` gains a `metric` callout (style with existing `font-mono`/`text-accent` tokens, e.g. near `highlight`). Non-featured projects (`restProjects`) render as a **compact single-row list** (title, one-liner, metric, Code/Live/Case-Study links) rather than today's full `ProjectCard` grid tile — this is a layout change within existing tokens (no new colors/fonts), likely a new lightweight row component or a `compact` variant added directly to `ProjectCard`. Verify featured count is exactly 4 via the Phase 3 terminal check in the plan.

### Phase 4 — Video embed
- `public/video/video-resume.mp4` + `public/video/video-resume-poster.webp` per compress commands above.
- `src/data/projects.js`: AI Video Resume project — decide whether `live` field still points to the raw GitHub URL (keep as "Live"/external fallback link) or is repurposed; the in-card player is separate from that link. Recommend adding a `videoUrl`/`posterUrl` pair of fields rather than overloading `embedUrl` (which `GameEmbed` already uses for iframes) — a new small `VideoEmbed.jsx` component in `src/components/ui/` mirrors `GameEmbed.jsx`'s activate-on-click pattern but renders `<video poster=... preload="none" controls>` instead of an iframe.
- `src/components/Projects.jsx`: `FeaturedProjectCard` renders `VideoEmbed` when `project.videoUrl` is set, same slot where `GameEmbed` renders today.

---

## Constraints (apply to every phase)

- **No visual theme changes** — reuse existing Tailwind tokens/classes (`bg-surface`, `text-accent`, `font-mono`, `rounded-xl2`, etc.) exclusively. No new fonts, no new colors, no `@tailwindcss/typography`.
- `prefers-reduced-motion` must be respected by anything new (use `src/hooks/useReducedMotion.js`).
- Lighthouse guardrail: desktop ≥ 94 perf / 100 / 100 / 100 — biggest risk is the video and photo; both must lazy-load / never preload.
- All 26 existing Vitest tests must keep passing unmodified in behavior (route wrapping must not change `/` output — `App.test.jsx` renders `<App/>` directly today and will need `<BrowserRouter>` added around it in the test itself if `App.jsx` calls router hooks; check this first thing in Phase 2).
- Only 3 new deps total: `react-router-dom`, `react-markdown`, `remark-gfm`.
- Remove orphaned `public/case-studies/` PDF in Phase 2.

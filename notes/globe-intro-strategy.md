# Strategy: Scroll-Scrubbed WebGL Transaction Network Globe — Frontend Builder Brief

> Supervisor agent, 2026-07-08. Feature approved by Rahul (concept "#1 global transaction network dive", path "B2 code-built").
> Baseline verified: build green, 56/56 tests, main chunk 339.32 kB (gzip 110.47), lazy CaseStudyPage chunk 199.89 kB.

## 1. Current-state audit

- `src/App.jsx`: inline `HomePage` renders `<Hero/><About/>…<Footer/>`; Hero imported statically.
- `src/components/Hero.jsx`: self-contained (greeting, h1, role, one-liner, CTAs, socials, scroll indicator, router-aware `handleScroll`), `<section className="relative min-h-screen … bg-surface">`.
- `src/components/Navbar.jsx`: scroll-spy IntersectionObserver on section ids (`about`…`contact`, no `hero` id — unaffected). Progress bar = `scrollY / (scrollHeight - innerHeight)` — automatically correct with a runway; **NO Navbar changes**.
- `src/test/mocks.js`: installs IntersectionObserver + matchMedia mocks; matchMedia only branches on `prefers-reduced-motion` today (returns false for other queries).
- Verified: jsdom `canvas.getContext('webgl')` → `null` ⇒ WebGL check false under Vitest ⇒ **all existing tests naturally take the static-Hero path with zero new mocking**.
- Vite default code-splitting on dynamic `import()` — no manualChunks needed.

## 2. Architecture

**`src/hooks/useIntroMode.js`** (single source of truth) → `'scrub' | 'static'`:
- reduced motion → static; `(max-width: 767px)` → static; `(pointer: coarse)` → static; `!isWebGLAvailable()` → static; else scrub.
- `isWebGLAvailable()` in `src/three/webglSupport.js` (try/catch webgl/experimental-webgl, never throws).

**Component tree**:
```
HomePage → HomeIntro.jsx (branches on useIntroMode)
  'static' → <Hero/>                       (unchanged standalone)
  'scrub'  → <IntroScrub/>
               runway div (h-[280vh], relative, aria-label="Intro")
               └ sticky div (sticky top-0 h-screen)
                   ├ <GlobeCanvas/> (canvas aria-hidden)
                   └ <div ref={overlayRef}><HeroContent/></div>
```
- **Hero refactor**: move ALL existing markup/behavior verbatim into new `src/components/HeroContent.jsx`; `Hero.jsx` becomes a 3-line shell wrapping `<HeroContent/>` in the existing section. DOM identical ⇒ Hero.test.jsx passes untouched. IntroScrub reuses the same HeroContent (no content drift).
- **App.jsx**: `<Hero/>` → `<HomeIntro/>` (one-line swap).

**Module split (testability)**:
- `src/three/timeline.js` — PURE, no three import. Exports `PHASES`, `getPhase(t)`, easings, `updateAtProgress(t)` → `{ globeRotationY, cameraRadius, cameraTarget, pulsePhases[], bloomOpacity, bloomScale, heroOverlayOpacity, heroOverlayTranslateY }`. Deterministic: same t ⇒ same output (no wall-clock state).
- `src/three/nodes.js` — PURE. City list + `latLonToVec3(lat, lon, radius)` → plain {x,y,z}.
- `src/three/globeScene.js` — imports `three` + pure modules. `buildScene(canvas)` → object with `render(t)` (applies updateAtProgress to real Object3Ds) and `dispose()`.
- `src/components/GlobeCanvas.jsx` — React wrapper; in useEffect: `const { buildScene } = await import('../three/globeScene')` — this single dynamic import creates the Vite chunk boundary pulling `three` into a lazy chunk. NO React.lazy/Suspense (hero overlay must paint immediately).

**Scroll wiring (NO GSAP)**:
- `useScroll({ target: runwayRef, offset: ['start start','end end'] })` → 0→1 across runway, natively reversible.
- `useMotionValueEvent(scrollYProgress, 'change', v => targetProgressRef.current = v)` — ref write, no re-renders.
- GlobeCanvas owns the ONLY rAF loop: `smoothed = lerp(smoothed, target, 0.08)`; calls `scene.render(smoothed)`; writes overlay opacity/transform imperatively (`overlayRef.current.style…`) from `updateAtProgress(smoothed)`.
- rAF PAUSES (not skips) when `document.hidden` or runway out of view (IntersectionObserver); resumes on return. `setPixelRatio(min(devicePixelRatio, 1.5))`. Full dispose (geometry/materials/textures/renderer) on unmount.

## 3. Globe scene spec

- Points: Fibonacci sphere, 2000 pts, r=2.5, `THREE.Points` + BufferGeometry (position+color attrs), `PointsMaterial({ size:0.03, vertexColors:true, transparent:true, opacity:0.85, blending:AdditiveBlending, depthWrite:false })`. Colors round-robin i%3: #6366f1 / #ec4899 / #38bdf8.
- Atmosphere: sphere r=2.65, `MeshBasicMaterial({ color:0x6366f1, transparent:true, opacity:0.06, side:BackSide })`.
- Nodes (8): Mumbai (19.076,72.877) **[dive target]**, Dubai (25.204,55.271), London (51.507,-0.128), Frankfurt (50.110,8.682), Singapore (1.352,103.820), Bengaluru (12.972,77.594), New York (40.713,-74.006), Nairobi (-1.292,36.822).
- Arcs (10): Mumbai–Dubai, Mumbai–Singapore, Mumbai–London, Mumbai–Bengaluru, Dubai–London, Dubai–Frankfurt, Dubai–Nairobi, London–Frankfurt, Singapore–New York, Frankfurt–New York. `QuadraticBezierCurve3` (control pushed out ~0.4r), 64 samples, `Line` + `LineBasicMaterial({ transparent, opacity:0.5, blending:AdditiveBlending })`, hue rotating through the 3 brand colors.
- Pulses: one Sprite per arc (10), shared radial-gradient canvas texture, `SpriteMaterial({ blending:AdditiveBlending, transparent:true })`, positioned `curve.getPointAt(pulsePhases[i])`; `pulsePhases[i] = (t*6 + i*0.37) % 1` — pure function of t (exact reversal).
- Bloom fake: one Sprite (same texture) at Mumbai, scale/opacity per phases. NO postprocessing.
- Camera: `PerspectiveCamera(50, aspect, 0.1, 100)`; renderer `alpha:true`, `setClearColor(0x0a0a0f, 1)`.

**Phase timeline** (t = smoothed progress):
| Phase | t | Behavior |
|---|---|---|
| Orbit | 0–0.5 | rotationY eases (easeInOutSine) ~108°; camera radius 6; pulses always animating |
| Hero fade | 0.35–0.55 | overlay opacity 1→0, translateY 0→-40px, easeInCubic |
| Dive | 0.5–0.85 | camera radius easeInCubic 6→1.2, lookAt → Mumbai |
| Bloom in | 0.85–0.95 | Mumbai sprite scale 1→40, opacity 0→1 (easeInQuad) |
| Bloom out | 0.95–1.0 | opacity 1→0 → fades to #0a0a0f for seamless About handoff |

## 4. Test plan

- `src/test/mocks.js`: extend matchMedia mock to branch on `max-width` / `pointer: coarse`; add `setViewportMobile(bool)`, `setCoarsePointer(bool)` (mirror setPrefersReducedMotion pattern).
- `src/test/useIntroMode.test.jsx` (new): 4 static branches (reduced motion, mobile width, coarse pointer, webglSupport mocked false) + scrub branch.
- `src/test/timeline.test.js` (new, pure): getPhase boundaries; `updateAtProgress(0).heroOverlayOpacity===1`; `(0.6).heroOverlayOpacity===0`; `(1).bloomOpacity===0`; camera radius strictly decreasing across dive; determinism (same t twice, any order ⇒ identical output).
- `src/test/nodes.test.js` (new, pure): latLonToVec3 known point; 8 nodes incl. Mumbai dive target; arcs reference valid nodes only.
- `src/test/HomeIntro.test.jsx` (new): mock useIntroMode; 'static' → Hero content, no runway; 'scrub' → IntroScrub stub rendered.
- `src/test/IntroScrub.test.jsx` (new): mock globeScene; asserts runway aria-label, canvas aria-hidden, HeroContent name/CTA/socials present.
- Existing: Hero.test.jsx unaffected (identical DOM); App/Navbar tests unaffected (jsdom → static path). Target ≈71 passing.

## 5. Files

New: `src/hooks/useIntroMode.js`, `src/three/{webglSupport,timeline,nodes,globeScene}.js`, `src/components/{HeroContent,GlobeCanvas,IntroScrub,HomeIntro}.jsx`, 5 test files.
Edit: `src/components/Hero.jsx` (shell), `src/App.jsx` (swap), `src/test/mocks.js`, `package.json` (+`three`).

## 6. Phases + verification

1. Pure modules + tests → `npm run test -- timeline nodes`
2. Hero refactor → `npm run test -- Hero` (unchanged pass), `npm run build`
3. useIntroMode + HomeIntro + App wiring → `npm run test -- useIntroMode HomeIntro App`, `npm run build`, full `npm run test`
4. `npm install three`; GlobeCanvas + globeScene + IntroScrub → `npm run test -- IntroScrub`, `npm run build`; confirm separate three chunk; main chunk growth ≤5KB gzip
5. Manual visual pass (`npm run dev`, ≥768px real WebGL): orbit→dive→bloom→handoff, scroll reversal, navbar progress OK; reduced-motion + <768px → static Hero
6. Full regression: `npm run test` (~71/71), `npm run build`, `npm run preview` + Lighthouse desktop (no regression vs 100/98/100/100)

## 7. Locked decisions
768px breakpoint · lerp 0.08 · runway 280vh · phases 0.5/0.85 · hero fade 0.35–0.55 · 8 nodes/10 arcs · Mumbai dive target · bloom→0 by t=1 · Navbar untouched · `three` = only new dep.

## Out of scope
About-through-Footer, case-study pages, routes, copy, CI — all unchanged.

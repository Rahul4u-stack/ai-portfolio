# Case Study: Snake — Game-Loop Fundamentals

## 1. One-line pitch

A playable, fully tested Snake game — embedded live on my portfolio, built in a day.

## 2. Why this exists — the problem

My portfolio was entirely chat-shaped: useful AI apps a visitor can only evaluate by reading. Playable software is assessable in five seconds — and building it requires the real-time fundamentals (game loop, collision, input handling) that my upcoming AI-game projects (natural-language level generation, a 3D voxel sandbox) all build on. Snake is the first of four small games, each shipped as its own repo with one distinct engineering lesson; Snake's is the **game loop**.

## 3. AI capability demonstrated

**Multi-agent orchestration of the development process itself** — a supervisor agent (read-only strategy + code review), a builder agent, and a testing agent with strictly separated roles, coordinated by Claude Code, with me acting as PM and final QA. The AI is in how it was built, measurably (see §6, §9) — not bolted into a Snake clone as a gimmick.

## 4. AI tools used

- **Claude Code (Claude Fable 5)** running the 4-agent pattern: supervisor → frontend-builder → testing agent
- **Static review by the supervisor caught a real bug before the code ever ran**: the high-score save silently reported success when localStorage was blocked (private browsing) — an error path no happy-path test would hit
- **Deterministic browser verification**: `requestAnimationFrame` stubbed and driven with fabricated timestamps, so an agent could simulate exact milliseconds of gameplay in a frozen background tab — possible only because of the fixed-timestep design

## 5. Other tech

Vanilla JavaScript + Canvas 2D (no engine, no libraries) · Vite · Vitest (25 headless tests) · GitHub Actions CI · Vercel static hosting · localStorage.

## 6. Architecture decisions & trade-offs

- **Chose vanilla JS + Canvas over Phaser** because the goal was learning what engines abstract; the next game project uses an engine *from an informed position*. Build-vs-buy is a PM call — this project makes it consciously in both directions.
- **Chose a fixed-timestep loop over frame-based movement** because otherwise game speed tracks the player's monitor — a 144 Hz display runs 2.4× faster than a 60 Hz laptop with the same code. Decoupling rules-time from render-time also made the game testable with simulated clocks.
- **Chose pure-function game logic split from rendering** because rules become a headless state machine (`init → update → isGameOver`) that 25 Vitest specs cover in CI — the difference between a demo and a product.
- **Chose pseudo-3D shading on Canvas 2D over a Three.js rewrite** when a "real snake" look was requested: a fixed light source, cylindrical highlight passes, and drop shadows delivered the volume illusion in ~30 minutes with zero new dependencies — true 3D is deliberately saved for the voxel-sandbox project.
- **Chose localStorage over a backend leaderboard** because the product need (your own best score) doesn't justify auth + a service + hosting cost. $0 infra, and the whole game deploys as static files.

## 7. What I'd do differently

- **Game feel ("juice") was descoped** — eat animations, screen shake, richer sound. Flappy Bird (game #4) owns that lesson, but Snake would land better with a taste of it.
- **Tune difficulty from data, not gut**: the speed ramp hits max after 10 apples — a constant chosen by feel in a throttled test tab. With real players I'd log run lengths and tune the ramp against actual quit points.

## 8. Outcome

- **Shipped:** 2026-07-02 — same day the project was green-lit (plan → 4-agent build → tests → deploy)
- **Live:** https://snake-game-nu-two-85.vercel.app — also playable inside the featured card on [my portfolio](https://ai-portfolio-seven-drab.vercel.app/)
- **Repo:** https://github.com/Rahul4u-stack/snake-game — 25/25 tests in CI (~20 s per push)
- **Footprint:** ~10.5 kB of JavaScript (3.7 kB gzipped), no backend, no runtime dependencies

## 9. The hardest bug

Pause looked like it corrupted state — resuming "restarted" the game. Root cause: pausing stopped the game loop, but keyboard input was only processed *inside* the loop, so every overlay made the keyboard deaf, and the only clickable button was Restart. The fix inverted the model: never stop the loop; gate the *simulation* instead. The design lesson: pause the simulation, never the machinery that listens for un-pausing.

There's a meta-lesson too. After 25 tests were green and a scripted browser bot passed, it took a human play-test to catch this — the bot clicked buttons instead of trusting the key labels. Each verification layer catches something specific, and each has things it structurally cannot see. All tests green ≠ works.

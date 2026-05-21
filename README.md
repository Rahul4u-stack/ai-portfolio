# AI Portfolio Website

A personal portfolio site built end-to-end by 4 specialized AI agents working in parallel — the site is both the artifact and the demonstration.

🔗 **Live:** [ai-portfolio-seven-drab.vercel.app](https://ai-portfolio-seven-drab.vercel.app/)

---

## Why this exists

Every other project in this 9-week AI portfolio depends on a polished landing surface. Recruiters scan a portfolio in 10–30 seconds before clicking into individual project links — if the gateway artifact is weak, they don't reach the case studies. Built this with a 4-agent Claude Code pipeline (supervisor + frontend + backend + testing) for two reasons: rehearse the multi-agent workflow before applying it to complex projects, and let the site itself signal "this candidate doesn't just talk about orchestrating AI — here's a thing they orchestrated AI to build."

## What this demonstrates

**Multi-agent orchestration** — decomposing a single product build into specialized roles and coordinating them in parallel. Proves understanding of agent decomposition, parallel-vs-sequential delegation, and where the multi-agent overhead does and doesn't pay off.

## AI tools used

- **Claude Code** with custom sub-agent definitions
- **4-agent pipeline:**
  - `supervisor` — read-only strategy + clarifying questions
  - `frontend-builder` — React/Vite/Tailwind implementation
  - `backend-builder` — Anthropic SDK–aware (uses the `claude-api` skill)
  - `testing` — pytest/Vitest, runs CI

## Tech stack

React 18 · Vite · Tailwind CSS · Framer Motion · Inter font · `react-icons` for FA glyphs · Vercel free-tier deploy · GitHub Actions CI on every push.

## Architecture decisions

- **Vanilla React + Vite over Next.js** — site is fully static. No SSR, no API routes, no auth. Vite ships smaller bundles and rebuilds in <1s; Next.js would have added framework weight without buying anything.
- **Framer Motion over CSS keyframes** for the Hero typing animation — needed both delay sequencing and spring physics on entry. CSS can do one or the other but not both cleanly.
- **Data layer extracted to `src/data/`** (during polish pass) — projects, experiences, skills, education, social all live as importable modules. Updates touch one file, not five.
- **IntersectionObserver active-section nav highlight** over scroll-position math — declarative, handles resize correctly, and the `rootMargin: -40% 0px -55% 0px` trick shifts active state at the natural reading point.
- **Embedded the video resume as raw MP4 from GitHub** instead of YouTube. File is 5.4 MB so GitHub serves it inline with no rate issues; avoids maintaining a separate platform.

## What's next / v2

- Custom domain (`rahulagarwal.dev` or similar) — the Vercel auto-name is the weakest single thing on the site for recruiter recall.
- Deep-dive case-study pages at `/projects/<slug>` — currently project descriptions are inline cards.
- Generate a proper 1200×630 OG image with name + role + key links for cleaner LinkedIn shares.

## Sections

Hero · About · Experience (timeline) · Projects · Skills · Education · Contact · Footer

Mobile responsive, dark theme, OG + Twitter meta tags.

## Project structure

```
src/
├── components/        # Hero, About, Experience, Projects, Skills,
│                      # Education, Contact, Navbar, Footer
├── data/              # Single source of truth — edit content here
│   ├── projects.js    # project cards (updated each week as projects ship)
│   ├── experience.js
│   ├── education.js
│   ├── skills.js
│   └── social.js
├── App.jsx
└── main.jsx

public/
├── favicon.svg
├── profile.jpg        # also doubles as OG image
└── resume.pdf
```

## Local development

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # production build → dist/
npm run preview      # serve dist/ locally
```

## CI

`.github/workflows/ci.yml` runs `npm ci && npm run build` on every push and PR to `main`.

## Built by

[Rahul Agarwal](https://www.linkedin.com/in/rahul-agar/) — Product Manager · AI Builder · 7 years in fintech & payments.

Hiring a PM for a payments or AI-forward team? [Portfolio](https://ai-portfolio-seven-drab.vercel.app/) · [LinkedIn](https://www.linkedin.com/in/rahul-agar/)

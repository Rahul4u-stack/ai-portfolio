import snakeImage from '../assets/projects/snake.webp'
import breakoutImage from '../assets/projects/breakout.webp'
import calorieEstimatorImage from '../assets/projects/calorie-estimator.webp'
import aiPortfolioImage from '../assets/projects/ai-portfolio.webp'

/**
 * AI & Build Lab — smaller builds and experiments.
 *
 * Filter tags must come from LAB_FILTERS. A build can carry several.
 * `note` is one line on why the build exists — not a feature list.
 */
/**
 * Filters must only list tags something in `labProjects` actually carries — a filter that returns
 * "0 of 5" reads as a broken control. The payments work all sits in Selected work, so there is
 * deliberately no Payments filter here.
 */
export const LAB_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'ai', label: 'AI systems' },
  { id: 'automation', label: 'Automation' },
  { id: 'experiments', label: 'Experiments' },
  { id: 'games', label: 'Games' },
]

export const labProjects = [
  {
    title: 'AI Video Resume',
    note: '94 seconds of coded animation — Hyperframes scenes, Kokoro TTS narration, Whisper captions, orchestrated with Claude Code.',
    stat: '94s · 7 scenes · 1 week',
    tags: ['ai', 'experiments'],
    links: [
      { label: 'Code', href: 'https://github.com/Rahul4u-stack/video-resume' },
      {
        label: 'Watch',
        href: 'https://github.com/Rahul4u-stack/video-resume/raw/main/renders/video-resume_2026-05-16_14-00-02.mp4',
      },
    ],
    videoUrl: '/video/video-resume.mp4',
    posterUrl: '/video/video-resume-poster.webp',
  },
  {
    title: 'Snake',
    note: 'Snake from first principles — fixed-timestep loop, pure-function rules, hand-shaded pseudo-3D on plain Canvas 2D. Playable in the card.',
    stat: '1 day · 25/25 tests',
    tags: ['games', 'experiments'],
    links: [
      { label: 'Case study', href: '/case-study/snake', internal: true },
      { label: 'Play', href: 'https://snake-game-nu-two-85.vercel.app' },
      { label: 'Code', href: 'https://github.com/Rahul4u-stack/snake-game' },
    ],
    image: snakeImage,
    embedUrl: 'https://snake-game-nu-two-85.vercel.app',
  },
  {
    title: 'Breakout',
    note: 'The whole renderer swapped to Three.js and the 2D physics stayed pure functions — zero logic lines and zero tests changed.',
    stat: '1 day · 33/33 tests · 60fps',
    tags: ['games', 'experiments'],
    links: [
      { label: 'Play', href: 'https://breakout-game-delta.vercel.app' },
      { label: 'Code', href: 'https://github.com/Rahul4u-stack/breakout-game' },
    ],
    image: breakoutImage,
  },
  {
    title: 'Calorie Estimator',
    note: 'One food photo in, a structured nutrition estimate out, in a single Vision API call.',
    stat: 'One-call vision pipeline',
    tags: ['ai', 'experiments'],
    links: [
      { label: 'Live', href: 'https://calorie-estimator.vercel.app' },
      { label: 'Code', href: 'https://github.com/Rahul4u-stack/calorie-estimator' },
    ],
    image: calorieEstimatorImage,
  },
  {
    title: 'This portfolio',
    note: 'Built and rebuilt end-to-end by coordinated Claude Code agents — a supervisor, two section builders in parallel, and an adversarial testing agent.',
    stat: 'Orchestrated AI build',
    tags: ['ai', 'automation'],
    links: [
      {
        label: 'Case study',
        href: '/case-study/payment-intelligence-network',
        internal: true,
      },
      { label: 'Code', href: 'https://github.com/Rahul4u-stack/ai-portfolio' },
    ],
    image: aiPortfolioImage,
  },
]

/*
 * Deliberately NOT listed here: the Paysecure developer-documentation rewrite.
 * It is already the featured PSP workflow case study and an entry in the impact rail; a third
 * appearance in the Lab would read as padding rather than range.
 */

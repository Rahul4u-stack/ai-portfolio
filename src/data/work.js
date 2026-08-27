import personalChatbotImage from '../assets/projects/personal-chatbot.webp'
import youtubeSummarizerImage from '../assets/projects/youtube-summarizer.webp'

/**
 * Selected work — the four pieces that carry the positioning.
 *
 * Scannable shape: Problem → Constraint → Decision → System → Outcome.
 * Every number in `outcome` / `stats` traces to `experience.js` (for the Paysecure workflow) or to
 * the shipped repo's own README and CI (for the AI builds). `tech` is capped at four entries —
 * cards argue why the work mattered, not what was installed.
 */
export const selectedWork = [
  {
    slug: 'psp-integration-workflow',
    title: 'AI-assisted PSP integration workflow',
    kind: 'Payments · Work',
    subtitle: 'The pipeline that turned a two-week integration into a two-day one',
    problem:
      'Every new payment provider arrived as a different pile of developer documentation. Reading it by hand was the bottleneck on the entire integration roadmap.',
    constraint:
      'An extraction mistake does not stay a documentation mistake — it becomes a failed payment in production. Nothing unreviewed could reach an integration.',
    decision:
      'Automate the reading, not the judgment. An LLM extraction pipeline drafts the integration spec; humans keep explicit validation gates before anything ships.',
    system:
      'Documentation in, structured spec out — Claude, ChatGPT and Gemini extracting endpoints, payment methods and error semantics, with a human sign-off gate between extraction and integration. The developer docs were rebuilt in the same pass, as products rather than manuals.',
    outcome:
      '2 weeks → 2 days turnaround across 300+ integrations, and 20% fewer merchant integration errors.',
    stats: [
      { value: '2 wks → 2 days', label: 'Turnaround' },
      { value: '300+', label: 'Integrations led' },
      { value: '−20%', label: 'Merchant errors' },
    ],
    tech: ['Claude', 'ChatGPT', 'Gemini', 'Human validation gates'],
    links: [],
    // Internal work: there is deliberately no repo or demo to link. Say so rather than leave a gap.
    note: 'Internal Paysecure work — no public repository.',
    accent: 'indigo',
  },
  {
    slug: 'personal-chatbot',
    title: 'Personal Chatbot with Memory',
    kind: 'AI system',
    subtitle: 'A payments-domain assistant that remembers you across sessions',
    problem:
      'A domain assistant that forgets everything between sessions makes the user re-explain their context on every single turn.',
    constraint:
      "Persistence means the model writes to disk. One user must never be able to reach another user's memory, and a long-lived system prompt must not be re-billed on every turn.",
    decision:
      "Let the model manage its own memory through Anthropic's Memory Tool instead of hand-rolling a retrieval layer — then sandbox it per user and adversarially test the boundary.",
    system:
      'Streaming SSE tool-use loop, per-user filesystem sandbox, prompt-cached system prompt. 82 tests across the Flask backend and React frontend.',
    outcome: '~90% cost cut on repeat turns via prompt caching. 82 tests green in CI.',
    stats: [
      { value: '~90%', label: 'Cost cut, repeat turns' },
      { value: '82', label: 'Tests in CI' },
    ],
    tech: ['Anthropic Memory Tool', 'Claude Sonnet 4.6', 'Flask', 'SSE streaming'],
    links: [
      { label: 'Case study', href: '/case-study/personal-chatbot', internal: true },
      { label: 'Live demo', href: 'https://personal-chatbot-rust.vercel.app/' },
      { label: 'Code', href: 'https://github.com/Rahul4u-stack/personal-chatbot' },
    ],
    image: personalChatbotImage,
    accent: 'signal',
  },
  {
    slug: 'khabar',
    title: 'Personal AI News Assistant',
    kind: 'Automation',
    subtitle: 'Khabar — an agent that has DMed a news brief every morning since May 2026',
    problem:
      'Staying current on AI meant either a daily manual sweep or an RSS pipeline that breaks quietly every time a source changes its markup.',
    constraint:
      'A personal habit has to cost roughly nothing to run, or it gets switched off within a month.',
    decision:
      'Skip the frontier model. A free open-weight model over LLM-driven web search is good enough for summarization — good enough beats gold-plated when the alternative is not running it at all.',
    system:
      'Hermes 3 via OpenRouter doing LLM-driven retrieval rather than fixed feeds, scheduled to deliver five stories to Telegram at 9 AM IST.',
    outcome: 'Running daily since 2026-05-12 at roughly zero monthly cost.',
    stats: [
      { value: 'Daily', label: 'Since 2026-05-12' },
      { value: '~$0/mo', label: 'Running cost' },
    ],
    tech: ['Hermes 3', 'OpenRouter', 'Telegram Bot API', 'Cron'],
    links: [{ label: 'Code', href: 'https://github.com/Rahul4u-stack/khabar' }],
    accent: 'status',
  },
  {
    slug: 'youtube-summarizer',
    title: 'YouTube Summarizer',
    kind: 'AI system',
    subtitle: 'Long-context summarization without a chunking pipeline',
    problem:
      'Long transcripts are normally split, embedded and re-stitched — a lot of moving parts, and the summary loses the thread of the argument.',
    constraint:
      'Sending a full 15-minute transcript on every request is the obvious approach and the expensive one.',
    decision:
      'Keep the whole transcript in context and pay for it once. Prompt caching makes the naive approach the cheap approach, so the chunking layer never needs to exist.',
    system:
      'yt-dlp + Whisper.cpp for transcripts, long-context Claude with prompt caching, Pydantic-validated structured output — executive summary, key insights, action items.',
    outcome: '~90% cost cut on repeat lookups. 55 tests across frontend and backend.',
    stats: [
      { value: '~90%', label: 'Cost cut, repeat lookups' },
      { value: '55', label: 'Tests in CI' },
    ],
    tech: ['Claude Sonnet 4.6', 'Prompt caching', 'Whisper.cpp', 'Pydantic'],
    links: [
      { label: 'Case study', href: '/case-study/youtube-summarizer', internal: true },
      { label: 'Live demo', href: 'https://youtube-summarizer-plum.vercel.app' },
      { label: 'Code', href: 'https://github.com/Rahul4u-stack/youtube-summarizer' },
    ],
    image: youtubeSummarizerImage,
    accent: 'indigo',
  },
]

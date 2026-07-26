export const decisions = [
  {
    title: 'AI-assisted PSP integrations',
    tradeoff: 'Manual doc-reading accuracy vs. delivery speed.',
    call: 'Built an LLM extraction pipeline (Claude, ChatGPT, Gemini) with human validation gates.',
    outcome: '2 weeks → 2 days',
  },
  {
    title: 'Developer-docs revamp',
    tradeoff: 'New features vs. fixing integration friction.',
    call: 'Rewrote 10+ doc modules as products, not manuals.',
    outcome: '–20% merchant integration errors',
  },
  {
    title: 'Personal AI News Assistant (Khabar)',
    tradeoff: 'Frontier-model quality vs. zero running cost for a daily personal news agent.',
    call: 'Free open-weight model (Hermes 3 via OpenRouter) + Telegram delivery — good enough beats gold-plated for summarization.',
    outcome: 'Daily 9AM brief · ~$0/mo',
  },
];

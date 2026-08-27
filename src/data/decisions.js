/**
 * Decisions I'd defend.
 *
 * Each record is Context → Trade-off → Decision → Why it worked → What I'd reconsider.
 * `outcome` values trace to `experience.js` (Paysecure) or the shipped repo (Khabar).
 * `reconsider` is reflection on a call already described — it introduces no new facts or numbers.
 */
export const decisions = [
  {
    id: 'psp-pipeline',
    title: 'Let AI read the docs. Keep humans on the gate.',
    domain: 'Payments · AI pipeline',
    context:
      "Integrating a new payment provider started with a human reading that provider's developer documentation end to end. Across a roadmap of hundreds of providers, the reading was the bottleneck — not the engineering.",
    tradeoff:
      'Manual doc-reading accuracy against delivery speed. Fully manual was defensibly correct and far too slow. Fully automated was fast and put extraction errors straight into live payment flows.',
    decision:
      'Automate the reading, not the judgment. An LLM pipeline across Claude, ChatGPT and Gemini drafts the integration spec; explicit human validation gates sit between extraction and anything that ships.',
    whyItWorked:
      'The gate is what made the speed safe. Reviewing a drafted spec is a fundamentally cheaper task than reading raw documentation, so accuracy stayed a human decision while the slow part collapsed.',
    reconsider:
      'The gate is still a person reading prose. I would push harder on machine-checkable validation — schema and contract tests that fail loudly — so review effort concentrates on genuine ambiguity instead of re-reading confident, correct output.',
    outcome: '2 weeks → 2 days',
    outcomeLabel: 'Turnaround, across 300+ integrations',
    tone: 'status',
  },
  {
    id: 'docs-as-product',
    title: 'Fix the docs before shipping more features.',
    domain: 'Developer experience',
    context:
      'Merchants were making the same mistakes during integration. Each one arrived as a support thread, and the roadmap had features queued behind it.',
    tradeoff:
      'New payment features against fixing integration friction. Features are visible and easy to point at in a roadmap review. Documentation work is invisible right up until it stops being a problem.',
    decision:
      'Treat the documentation as the product. Rebuilt 10+ modules — Google Pay, Apple Pay, recurring payments, crypto on/off-ramp — around what a merchant is actually trying to do.',
    whyItWorked:
      'The errors were a product defect wearing a support-ticket costume. Removing the cause cut merchant integration errors by 20% and stopped the same thread being answered twice.',
    reconsider:
      'I measured the outcome after the rewrite. Instrumenting where merchants abandoned an integration first would have told me which modules to prioritise, instead of rebuilding ten and inferring it afterwards.',
    outcome: '−20%',
    outcomeLabel: 'Merchant integration errors',
    tone: 'status',
  },
  {
    id: 'good-enough-model',
    title: 'Pick the free model when the task is easy.',
    domain: 'AI cost engineering',
    context:
      'Khabar is a personal agent that DMs a five-story AI news brief to Telegram every morning. It is a habit, not a product — it has to survive indefinitely on no budget.',
    tradeoff:
      'Frontier-model quality against zero running cost. A frontier model summarizes marginally better; at daily cadence it also gives a personal habit a monthly bill and a reason to be switched off.',
    decision:
      'Free open-weight model — Hermes 3 via OpenRouter — with LLM-driven web search rather than fixed RSS feeds. Good enough beats gold-plated for summarization.',
    whyItWorked:
      'Model quality was never the constraint on this task; the constraint was whether it kept running. It has delivered daily since 2026-05-12 at roughly zero cost.',
    reconsider:
      'I chose once and left it. Retrieval, summarization and ranking have different quality bars, and I would now route only the step that actually rewards a stronger model rather than treating the pipeline as one choice.',
    outcome: '~$0/mo',
    outcomeLabel: 'Daily since 2026-05-12',
    tone: 'signal',
  },
]

/**
 * Selected impact — the outcome dashboard.
 *
 * EVERY entry here must trace to a bullet in `experience.js`. `source` names that bullet so the
 * claim can be checked in one hop. No metric ships without context — a bare number is a vanity number.
 *
 * `to`/`from` drive the one-shot count-up; `value` is the string always rendered for
 * reduced-motion, no-JS and screen-reader users.
 */
export const impactMetrics = [
  {
    value: '300+',
    to: 300,
    suffix: '+',
    label: 'PSP integrations led',
    context: 'End-to-end, with global PSPs, acquirers and card networks.',
    source: 'Paysecure Technology Ltd.',
    tone: 'indigo',
  },
  {
    value: '2 wks → 2 days',
    label: 'Integration turnaround',
    context: 'LLM extraction pipeline with human validation gates replaced manual doc reading.',
    source: 'Paysecure Technology Ltd.',
    tone: 'status',
    emphasis: true,
  },
  {
    value: '−20%',
    to: -20,
    suffix: '%',
    prefix: '−',
    label: 'Merchant integration errors',
    context: 'Rebuilt 10+ developer documentation modules as products, not manuals.',
    source: 'Paysecure Technology Ltd.',
    tone: 'status',
  },
  {
    value: '99.9%',
    to: 99.9,
    suffix: '%',
    decimals: 1,
    label: 'Uptime supported',
    context: '20+ root-cause analyses authored, 50+ corrective actions executed.',
    source: 'Juspay Technologies',
    tone: 'signal',
  },
  {
    value: '$3.4M',
    to: 3.4,
    prefix: '$',
    suffix: 'M',
    decimals: 1,
    label: 'GMV orchestrated',
    context: 'Global payment integrations across SEA and MENA.',
    source: 'Juspay Technologies',
    tone: 'indigo',
  },
  {
    value: '+5%',
    to: 5,
    prefix: '+',
    suffix: '%',
    label: 'Payment success rate',
    context: '5+ B2B SaaS payment features across 10+ payment methods.',
    source: 'Juspay Technologies',
    tone: 'signal',
  },
]

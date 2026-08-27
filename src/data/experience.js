/**
 * Career timeline.
 *
 * Companies, roles, periods, locations and highlight bullets are unchanged from the résumé —
 * do not edit the facts here without editing `public/resume.pdf` to match.
 *
 * `era` drives the engineering → product → AI-building progression rail.
 * `summary` is the one line shown collapsed; `highlights` expand on demand.
 * `defaultOpen` marks the roles that carry the positioning (Paysecure, Juspay).
 */
export const ERAS = {
  engineering: { label: 'Engineering', tone: 'muted' },
  product: { label: 'Product', tone: 'signal' },
  ai: { label: 'Product + AI building', tone: 'indigo' },
}

export const experiences = [
  {
    company: 'Paysecure Technology Ltd.',
    role: 'Technical Product Manager',
    period: 'Mar 2025 – Present',
    location: 'Remote',
    era: 'ai',
    current: true,
    defaultOpen: true,
    summary: 'Payment integrations at scale, and the LLM pipeline that made them fast.',
    highlights: [
      'Led 300+ end-to-end integrations with global PSPs, acquirers, and networks',
      'Automated gateway integrations using LLMs (Claude, ChatGPT, Gemini), reducing turnaround from 2 weeks to 2 days',
      'Documented 10+ PRDs covering GooglePay, ApplePay, recurring payments, and crypto on-ramp/off-ramp solutions',
      'Revamped 10+ developer documentation modules, reducing merchant integration errors by 20%',
    ],
  },
  {
    company: 'Juspay Technologies',
    role: 'Technical Product Manager',
    period: 'Aug 2022 – Feb 2025',
    location: 'Bangalore, India',
    era: 'product',
    defaultOpen: true,
    summary: 'Payment orchestration across SEA and MENA — reliability as a product surface.',
    highlights: [
      'Orchestrated global payment integrations ($3.4M GMV) across SEA and MENA regions',
      'Delivered 5+ B2B SaaS payment features across 10+ payment methods, achieving 5% increase in Success Rate',
      'Authored 20+ RCAs and executed 50+ actions, ensuring 99.9% uptime',
    ],
  },
  {
    company: 'Shaadi.com',
    role: 'Associate Product Manager',
    period: 'Jun 2021 – Aug 2022',
    location: 'Mumbai, India',
    era: 'product',
    summary: 'Consumer product discovery at volume — 150+ user calls, 12 surveys.',
    highlights: [
      'Conducted 150+ user calls and 12 surveys, boosting user engagement by 5%',
      'Spearheaded integration of 3 new features, driving 15% growth in DAU',
    ],
  },
  {
    company: 'Infosys Ltd.',
    role: 'Specialist Programmer',
    period: 'Jun 2017 – Apr 2019',
    location: 'Pune, India',
    era: 'engineering',
    summary: 'Where the automation instinct started.',
    highlights: [
      'Automated report generation parsing 1M+ SQL query logs, reducing man-hours from 8 hours to 15 mins',
    ],
  },
  {
    company: 'Amazon',
    role: 'Software Development Engineer Intern',
    period: 'May 2016 – Jul 2016',
    location: 'Hyderabad, India',
    era: 'engineering',
    summary: 'First production system, on the delivery side.',
    highlights: [
      "Migrated Amazon's Delivery Rule Portal using Java Spring MVC, reducing system downtime by 30%",
    ],
  },
]

export const education = [
  {
    institution: 'IIM Kozhikode',
    degree: 'MBA',
    period: '2019 – 2021',
  },
  {
    institution: 'IIT Roorkee',
    degree: 'B.Tech, Computer Science & Engineering',
    period: '2013 – 2017',
  },
]

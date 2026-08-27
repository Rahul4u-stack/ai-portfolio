/**
 * Single source of truth for site-level metadata.
 *
 * `BUILD_LAST_UPDATED` is injected by Vite (see vite.config.js) from the last git commit date,
 * falling back to build time. It is real repository metadata — never a hard-coded "live" indicator.
 */

export const SITE_URL = 'https://ai-portfolio-seven-drab.vercel.app'

export const SITE_TITLE = 'Rahul Agarwal — Payments Product Manager & AI Builder'

export const SITE_DESCRIPTION =
  'Product Manager with deep fintech experience. Led 300+ PSP integrations and built the AI workflow that cut payment integration turnaround from two weeks to two days.'

export const ROLE_LINE = 'Product Manager · Payments · AI Builder'

export const AVAILABILITY = 'Open to product roles · Building AI systems weekly'

export const LOCATION = 'Jaipur, India — remote worldwide'

/**
 * Resolved at module load so every consumer shows the same value.
 * __LAST_UPDATED__ is a Vite `define` replacement, so this is a literal at build time.
 */
export const LAST_UPDATED =
  typeof __LAST_UPDATED__ === 'string' && __LAST_UPDATED__ ? __LAST_UPDATED__ : ''

export function formatLastUpdated(iso = LAST_UPDATED) {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

import { experiences } from '../data/experience'

// Résumé-traced figures that must appear verbatim somewhere in the data. These guard
// against silent rewording of the numbers that back up the case-study claims.
const RESUME_FIGURES = [
  '2 weeks to 2 days',
  '300+',
  '4.2%',
  '31%',
  '$50M',
  '$3.4M',
  '366.6',
  '98% statistical validity',
  '150+',
  '4.1 to 4.25',
  '1M+',
  '8 hours to 15 minutes',
]

function flattenText(entry) {
  return [entry.company, entry.role, entry.period, entry.location, entry.summary, ...entry.highlights].join(' ')
}

describe('experience data', () => {
  it('has exactly 4 entries in the exact expected order', () => {
    expect(experiences).toHaveLength(4)
    expect(experiences.map((e) => e.company)).toEqual([
      'Paysecure Technology Ltd.',
      'Juspay Technologies',
      'Shaadi.com',
      'Infosys Ltd.',
    ])
  })

  it('gives every entry a non-empty summary and at least 3 highlights', () => {
    for (const entry of experiences) {
      expect(typeof entry.summary).toBe('string')
      expect(entry.summary.trim().length).toBeGreaterThan(0)
      expect(Array.isArray(entry.highlights)).toBe(true)
      expect(entry.highlights.length).toBeGreaterThanOrEqual(3)
    }
  })

  it('never mentions Amazon anywhere (the old internship entry was intentionally removed)', () => {
    const allText = experiences.map(flattenText).join(' ')
    expect(allText).not.toMatch(/Amazon/i)
  })

  it('marks only the first entry as the current ("Present") stint', () => {
    const presentFlags = experiences.map((e) => e.period.includes('Present'))
    expect(presentFlags).toEqual([true, false, false, false])
  })

  it.each(RESUME_FIGURES)('includes the résumé-traced figure "%s" verbatim', (figure) => {
    const allText = experiences.map(flattenText).join(' ')
    expect(allText).toContain(figure)
  })
})

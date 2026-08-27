import { describe, expect, it } from 'vitest'
import { LAB_FILTERS, labProjects } from '../data/lab'
import { selectedWork } from '../data/work'
import { impactMetrics } from '../data/metrics'
import { decisions } from '../data/decisions'
import { experiences } from '../data/experience'
import { shippedCount, shippedProjects } from '../data/shipped'
// Vite serves ?raw imports for any file, including outside src/.
import sitemap from '../../public/sitemap.xml?raw'

/**
 * Guards on the content model itself. These catch the class of defect that is invisible to a
 * component test — a filter that matches nothing, a metric with no attribution, a claim that
 * drifted out of sync with the résumé.
 */

describe('Build Lab filters', () => {
  it('offers no filter that would return an empty grid', () => {
    const used = new Set(labProjects.flatMap((project) => project.tags))
    for (const filter of LAB_FILTERS) {
      if (filter.id === 'all') continue
      expect(used.has(filter.id), `filter "${filter.label}" matches nothing`).toBe(true)
    }
  })

  it('tags every build with at least one filterable tag', () => {
    for (const project of labProjects) {
      expect(project.tags?.length, project.title).toBeGreaterThan(0)
    }
  })

  it('gives every build either links or an explicit note about why there are none', () => {
    for (const project of labProjects) {
      const hasLinks = project.links?.length > 0
      expect(hasLinks || Boolean(project.note2), project.title).toBe(true)
    }
  })
})

describe('Selected work', () => {
  it('leads with the payments workflow', () => {
    expect(selectedWork[0].slug).toBe('psp-integration-workflow')
  })

  it('holds exactly four items — more than that stops being "selected"', () => {
    expect(selectedWork).toHaveLength(4)
  })

  it('fills every field the Problem → Constraint → Decision → System → Outcome format needs', () => {
    for (const item of selectedWork) {
      for (const field of ['problem', 'constraint', 'decision', 'system', 'outcome']) {
        expect(item[field]?.trim().length, `${item.slug}.${field}`).toBeGreaterThan(20)
      }
    }
  })

  it('never restates the outcome inside another field — the outcome band is the only place for it', () => {
    for (const item of selectedWork) {
      for (const field of ['problem', 'constraint', 'decision', 'system']) {
        expect(item[field], `${item.slug}.${field}`).not.toBe(item.outcome)
      }
      // A stats row that just repeats the outcome sentence would read as duplication too.
      for (const stat of item.stats ?? []) {
        expect(stat.value.length, `${item.slug} stat "${stat.label}"`).toBeLessThan(24)
      }
    }
  })

  it('caps tech lists at four — cards argue why the work mattered, not what was installed', () => {
    for (const item of selectedWork) {
      expect(item.tech?.length ?? 0, item.slug).toBeLessThanOrEqual(4)
    }
  })

  it('gives every item either links or a note explaining their absence', () => {
    for (const item of selectedWork) {
      const hasLinks = item.links?.length > 0
      expect(hasLinks || Boolean(item.note), item.slug).toBe(true)
    }
  })
})

describe('Impact metrics', () => {
  it('divides exactly into both the 2- and 3-column grids, so no empty track shows', () => {
    expect(impactMetrics.length % 2).toBe(0)
    expect(impactMetrics.length % 3).toBe(0)
  })

  it('gives every metric context and a source — a bare number is a vanity number', () => {
    for (const metric of impactMetrics) {
      expect(metric.context?.trim().length, metric.label).toBeGreaterThan(20)
      expect(metric.source?.trim().length, metric.label).toBeGreaterThan(0)
    }
  })

  it('attributes every metric to a company that actually appears in the timeline', () => {
    const companies = new Set(experiences.map((role) => role.company))
    for (const metric of impactMetrics) {
      expect(companies.has(metric.source), metric.source).toBe(true)
    }
  })

  it('marks exactly one signature outcome', () => {
    expect(impactMetrics.filter((metric) => metric.emphasis)).toHaveLength(1)
  })
})

describe('Decision records', () => {
  it('completes every part of the record, including what would be reconsidered', () => {
    for (const decision of decisions) {
      for (const field of ['context', 'tradeoff', 'decision', 'whyItWorked', 'reconsider']) {
        expect(decision[field]?.trim().length, `${decision.id}.${field}`).toBeGreaterThan(40)
      }
      expect(decision.outcome?.trim().length, decision.id).toBeGreaterThan(0)
      expect(decision.outcomeLabel?.trim().length, decision.id).toBeGreaterThan(0)
    }
  })

  it('keeps three records — this is a judgment sample, not a changelog', () => {
    expect(decisions).toHaveLength(3)
  })
})

describe('Timeline claims stay traceable', () => {
  it('keeps the résumé numbers that the rest of the site quotes', () => {
    const paysecure = experiences.find((role) => role.company === 'Paysecure Technology Ltd.')
    const juspay = experiences.find((role) => role.company === 'Juspay Technologies')

    expect(paysecure.highlights.join(' ')).toMatch(/300\+ end-to-end integrations/)
    expect(paysecure.highlights.join(' ')).toMatch(/2 weeks to 2 days/)
    expect(paysecure.highlights.join(' ')).toMatch(/errors by 20%/)
    expect(juspay.highlights.join(' ')).toMatch(/\$3\.4M GMV/)
    expect(juspay.highlights.join(' ')).toMatch(/99\.9% uptime/)
  })

  it('assigns every role to a known era so the engineering → product → AI rail is complete', () => {
    for (const role of experiences) {
      expect(['engineering', 'product', 'ai'], role.company).toContain(role.era)
    }
  })
})

describe('Shipped project count is derived, not asserted', () => {
  it('counts only entries a stranger can actually open', () => {
    for (const project of shippedProjects) {
      const openable = project.links.filter(
        (link) => !link.internal && /^https?:\/\//.test(link.href)
      )
      expect(openable.length, project.title ?? project.slug).toBeGreaterThan(0)
    }
  })

  it('excludes internal work that has no public artefact', () => {
    const titles = shippedProjects.map((p) => p.title)
    // The Paysecure integration workflow is real work with no repo — it must not inflate the count.
    expect(titles).not.toContain('AI-assisted PSP integration workflow')
  })

  it('matches an independent recount of the data, so it cannot silently drift', () => {
    const expected = [...selectedWork, ...labProjects].filter((entry) =>
      (entry.links ?? []).some((link) => !link.internal && link.href?.startsWith('http'))
    ).length
    expect(shippedCount).toBe(expected)
  })

  it('is a real number greater than zero and never the old inflated claim', () => {
    expect(shippedCount).toBeGreaterThan(0)
    // The previous site said "10+ AI Products Shipped" against eight actual projects.
    expect(shippedCount).toBeLessThan(10)
  })
})

describe('Sitemap covers every published route', () => {
  const caseStudyLinks = [...selectedWork, ...labProjects]
    .flatMap((entry) => entry.links ?? [])
    .filter((link) => link.internal && link.href.startsWith('/case-study/'))

  it('lists the homepage', () => {
    expect(sitemap).toContain('<loc>https://ai-portfolio-seven-drab.vercel.app/</loc>')
  })

  it('lists every case study that the homepage links to', () => {
    expect(caseStudyLinks.length).toBeGreaterThan(0)
    for (const link of caseStudyLinks) {
      expect(sitemap, link.href).toContain(
        `<loc>https://ai-portfolio-seven-drab.vercel.app${link.href}</loc>`
      )
    }
  })

  it('contains no URL for a case study that does not exist in the data layer', () => {
    const listed = [...sitemap.matchAll(/case-study\/([a-z0-9-]+)</g)].map((m) => m[1])
    const known = new Set(caseStudyLinks.map((link) => link.href.split('/').pop()))
    for (const slug of listed) {
      expect(known.has(slug), `sitemap lists unknown case study "${slug}"`).toBe(true)
    }
  })
})

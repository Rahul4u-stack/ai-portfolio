import { render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import App from '../App'
import { selectedWork } from '../data/work'
import { labProjects } from '../data/lab'
import { impactMetrics } from '../data/metrics'
import { decisions } from '../data/decisions'
import { experiences } from '../data/experience'

const SECTION_IDS = ['impact', 'work', 'decisions', 'experience', 'lab', 'about', 'contact']
const NAV_LABELS = ['Work', 'Decisions', 'Experience', 'Lab', 'About', 'Contact']

function renderApp(initialEntries = ['/']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <App />
    </MemoryRouter>
  )
}

describe('page structure', () => {
  it('renders every anchored section', () => {
    const { container } = renderApp()
    for (const id of SECTION_IDS) {
      expect(container.querySelector(`section#${id}`), `section#${id}`).toBeInTheDocument()
    }
  })

  it('leads with the positioning claim, not a name or a job title', () => {
    renderApp()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      /I turn payment complexity into shipped AI products/i
    )
  })

  it('has exactly one h1', () => {
    renderApp()
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
  })

  it('exposes landmark structure: header, main, footer', () => {
    const { container } = renderApp()
    expect(container.querySelector('header')).toBeInTheDocument()
    expect(container.querySelector('main#main')).toBeInTheDocument()
    expect(container.querySelector('footer')).toBeInTheDocument()
  })

  it('offers a skip-to-content link that targets main', () => {
    renderApp()
    expect(screen.getByRole('link', { name: /skip to content/i })).toHaveAttribute('href', '#main')
  })

  it('makes the skip-link target focusable, so activating it actually moves focus', () => {
    // Regression: without tabIndex="-1" on <main>, following the skip link leaves
    // document.activeElement on <body> and a screen reader announces nothing.
    const { container } = renderApp()
    const main = container.querySelector('main#main')
    expect(main).toHaveAttribute('tabindex', '-1')

    main.focus()
    expect(document.activeElement).toBe(main)
  })

  it('labels every section by its own heading', () => {
    const { container } = renderApp()
    for (const id of SECTION_IDS) {
      const section = container.querySelector(`section#${id}`)
      const labelledBy = section.getAttribute('aria-labelledby')
      expect(labelledBy, `section#${id} aria-labelledby`).toBeTruthy()
      expect(container.querySelector(`#${labelledBy}`), `#${labelledBy} target`).toBeInTheDocument()
    }
  })

  it('never skips a heading level', () => {
    renderApp()
    const levels = screen.getAllByRole('heading').map((h) => Number(h.tagName.slice(1)))
    for (let i = 1; i < levels.length; i += 1) {
      expect(levels[i] - levels[i - 1], `${levels[i - 1]} → ${levels[i]}`).toBeLessThanOrEqual(1)
    }
  })
})

describe('hero proof', () => {
  it('shows the signature outcome above the fold without interaction', () => {
    const { container } = renderApp()
    expect(container.textContent).toMatch(/2 wks → 2 days|two weeks to two days/i)
  })

  it('offers both hero CTAs', () => {
    renderApp()
    expect(screen.getByRole('link', { name: /explore selected work/i })).toHaveAttribute(
      'href',
      '#work'
    )
    expect(screen.getAllByRole('link', { name: /résumé/i })[0]).toHaveAttribute(
      'href',
      '/resume.pdf'
    )
  })

  it('offers a theme toggle in the header with a destination-stating name', () => {
    renderApp()
    expect(
      screen.getAllByRole('button', { name: /switch to (light|dark) theme/i }).length
    ).toBeGreaterThan(0)
  })

  it('links LinkedIn and GitHub from the hero with accessible names', () => {
    renderApp()
    expect(screen.getByRole('link', { name: /Rahul Agarwal on LinkedIn/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Rahul Agarwal on GitHub/i })).toBeInTheDocument()
  })
})

describe('navigation', () => {
  it('links to every navigable section', () => {
    renderApp()
    const nav = screen.getAllByRole('navigation', { name: 'Sections' })[0]
    for (const label of NAV_LABELS) {
      expect(within(nav).getByRole('link', { name: label })).toHaveAttribute(
        'href',
        `#${label.toLowerCase()}`
      )
    }
  })

  it('every nav target actually exists on the page', () => {
    const { container } = renderApp()
    for (const label of NAV_LABELS) {
      expect(container.querySelector(`#${label.toLowerCase()}`), label).toBeInTheDocument()
    }
  })
})

describe('content is rendered from the data layer', () => {
  it('renders all six impact metrics with their context and source', () => {
    const { container } = renderApp()
    const rail = within(container.querySelector('section#impact'))
    for (const metric of impactMetrics) {
      expect(rail.getByText(metric.label), metric.label).toBeInTheDocument()
      expect(rail.getByText(metric.context), metric.context).toBeInTheDocument()
      // A number without an attributable source is a vanity number.
      expect(rail.getAllByText(metric.source).length, metric.source).toBeGreaterThan(0)
    }
  })

  it('renders all four featured work items', () => {
    renderApp()
    for (const item of selectedWork) {
      expect(screen.getByText(item.title), item.title).toBeInTheDocument()
    }
  })

  it('leads selected work with the payments pipeline, not a game', () => {
    const { container } = renderApp()
    const workSection = container.querySelector('section#work')
    const firstHeading = workSection.querySelector('h3')
    expect(firstHeading).toHaveTextContent(/AI-assisted PSP integration workflow/i)
  })

  it('renders all three decision records', () => {
    renderApp()
    for (const decision of decisions) {
      expect(screen.getByText(decision.title), decision.title).toBeInTheDocument()
    }
  })

  it('renders every role in the timeline', () => {
    const { container } = renderApp()
    const timeline = within(container.querySelector('section#experience'))
    for (const role of experiences) {
      expect(timeline.getByText(role.company), role.company).toBeInTheDocument()
    }
  })

  it('keeps the hero readout wording distinct from the impact rail, so it does not read as repetition', () => {
    const { container } = renderApp()
    const heroLabels = [...container.querySelectorAll('section:first-of-type dt')].map((el) =>
      el.textContent.trim()
    )
    const railLabels = impactMetrics.map((m) => m.label)
    for (const label of heroLabels) {
      expect(railLabels, `hero label "${label}" duplicated verbatim in the rail`).not.toContain(
        label
      )
    }
  })

  it('renders every lab build', () => {
    renderApp()
    for (const item of labProjects) {
      expect(screen.getByText(item.title), item.title).toBeInTheDocument()
    }
  })
})

describe('case studies', () => {
  it('links to all four case studies from the homepage', () => {
    renderApp()
    const hrefs = screen
      .getAllByRole('link')
      .map((link) => link.getAttribute('href'))
      .filter((href) => href?.startsWith('/case-study/'))
    expect(new Set(hrefs)).toEqual(
      new Set([
        '/case-study/personal-chatbot',
        '/case-study/youtube-summarizer',
        '/case-study/snake',
        '/case-study/payment-intelligence-network',
      ])
    )
  })

  it('renders the case study page at /case-study/:slug', async () => {
    renderApp(['/case-study/snake'])
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: /Case Study: Snake/i })).toBeInTheDocument()
    )
  })

  it('redirects an unknown case study slug home rather than showing an empty page', async () => {
    renderApp(['/case-study/does-not-exist'])
    await waitFor(() => expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument())
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/payment complexity/i)
  })
})

describe('unknown routes', () => {
  it('renders a real not-found page, never an empty shell', () => {
    // Regression: with no catch-all route, /anything rendered navbar + footer around a blank main.
    renderApp(['/this/path/does/not/exist'])
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/doesn.t reach a node/i)
    expect(screen.getByRole('link', { name: /back to the homepage/i })).toHaveAttribute('href', '/')
  })

  it('keeps the not-found page inside the normal chrome, with one h1', () => {
    renderApp(['/nope'])
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getAllByRole('navigation', { name: 'Sections' }).length).toBeGreaterThan(0)
  })
})

describe('claims removed for being unverifiable', () => {
  it('does not mention Smart Pantry — no repo, no link, no evidence', () => {
    const { container } = renderApp()
    expect(container.textContent).not.toMatch(/smart pantry/i)
  })

  it('never claims 7 years *in product* — product roles start Jun 2021', () => {
    const { container } = renderApp()
    expect(container.textContent).not.toMatch(/7\+?\s*years?\s+in\s+product/i)
  })

  it('does not inflate the shipped-project count past what the data holds', () => {
    const { container } = renderApp()
    expect(container.textContent).not.toMatch(/10\+\s*AI Products Shipped/i)
  })
})

describe('external links are safe', () => {
  it('every external link opens in a new tab with noopener', () => {
    renderApp()
    const external = screen
      .getAllByRole('link')
      .filter((link) => link.getAttribute('href')?.startsWith('http'))
    expect(external.length).toBeGreaterThan(0)
    for (const link of external) {
      expect(link, link.getAttribute('href')).toHaveAttribute('target', '_blank')
      expect(link.getAttribute('rel')).toContain('noopener')
    }
  })
})

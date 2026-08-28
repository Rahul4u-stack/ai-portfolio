import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'

const SECTION_IDS = ['about', 'experience', 'projects', 'skills', 'education', 'contact']

function renderApp(initialEntries = ['/']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <App />
    </MemoryRouter>
  )
}

describe('App', () => {
  it('renders the hero, all six anchored sections, and the footer', () => {
    const { container } = renderApp()

    // Hero (no section id — identified by the name headline)
    expect(screen.getAllByText(/Rahul Agarwal/).length).toBeGreaterThan(0)

    for (const id of SECTION_IDS) {
      expect(container.querySelector(`section#${id}`)).toBeInTheDocument()
    }

    expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument()
  })

  it('renders the navbar with links to every section', () => {
    renderApp()
    for (const id of SECTION_IDS) {
      const label = id.charAt(0).toUpperCase() + id.slice(1)
      expect(screen.getByRole('link', { name: label })).toHaveAttribute('href', `#${id}`)
    }
  })

  it('renders at least 3 links to case study pages on the homepage', () => {
    renderApp()
    const caseStudyLinks = screen
      .getAllByRole('link')
      .filter((link) => link.getAttribute('href')?.startsWith('/case-study/'))
    expect(caseStudyLinks.length).toBeGreaterThanOrEqual(3)
  })

  it('renders the case study page at /case-study/:slug', async () => {
    renderApp(['/case-study/snake'])
    await waitFor(
      () => expect(screen.getByRole('heading', { name: /Case Study: Snake/i })).toBeInTheDocument(),
      // Pre-existing flake: the lazy-loaded CaseStudyPage chunk can take longer than the
      // default 1000ms waitFor timeout to resolve under full-suite load (many workers
      // contending for CPU). This test is not related to the Experience section changes.
      { timeout: 5000 }
    )
  })

  it('renders the new Decisions and Frameworks sections (content sections, deliberately not in nav)', () => {
    const { container } = renderApp()
    expect(container.querySelector('section#decisions')).toBeInTheDocument()
    expect(container.querySelector('section#frameworks')).toBeInTheDocument()
    // deliberate scope call: no nav link for either (matches Testimonials precedent)
    expect(screen.queryByRole('link', { name: 'Decisions' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Frameworks' })).not.toBeInTheDocument()
  })

  it('renders the section ghost numerals in visual order 01 through 08 with no duplicates or gaps', () => {
    renderApp()
    const expectedOrder = ['01', '02', '03', '04', '05', '06', '07', '08']
    const ghosts = expectedOrder.map((n) => screen.getByText(n))
    for (const ghost of ghosts) {
      expect(ghost).toHaveAttribute('aria-hidden', 'true')
    }
    const positions = ghosts.map((el) => {
      const rectTop = Array.from(document.body.querySelectorAll('*')).indexOf(el)
      return rectTop
    })
    // DOM-order position should be strictly increasing since the numerals are
    // rendered in document order top-to-bottom.
    for (let i = 1; i < positions.length; i++) {
      expect(positions[i]).toBeGreaterThan(positions[i - 1])
    }
  })

  it('renders both pull quotes (after Decisions, before Contact)', () => {
    renderApp()
    expect(
      screen.getByText(/The best payment integration is the one your merchant never notices/)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/AI doesn't replace product judgment/)
    ).toBeInTheDocument()
  })
})

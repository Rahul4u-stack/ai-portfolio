import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import CaseStudyPage from '../components/CaseStudyPage'

function renderAtSlug(slug) {
  return render(
    <MemoryRouter initialEntries={[`/case-study/${slug}`]}>
      <Routes>
        <Route path="/" element={<div>Homepage</div>} />
        <Route path="/case-study/:slug" element={<CaseStudyPage />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('CaseStudyPage', () => {
  it('renders the markdown content for a valid slug', () => {
    renderAtSlug('snake')
    expect(
      screen.getByRole('heading', { name: /Case Study: Snake/i })
    ).toBeInTheDocument()
    expect(screen.getAllByText(/game loop/i).length).toBeGreaterThan(0)
  })

  it('renders each of the three known case studies without crashing', () => {
    for (const slug of ['snake', 'personal-chatbot', 'youtube-summarizer']) {
      const { unmount } = renderAtSlug(slug)
      expect(screen.getAllByRole('heading').length).toBeGreaterThan(0)
      unmount()
    }
  })

  it('redirects to the homepage for an unknown slug', () => {
    renderAtSlug('not-a-real-project')
    expect(screen.getByText('Homepage')).toBeInTheDocument()
  })

  it('renders a Back to Projects link pointing at the homepage projects anchor', () => {
    renderAtSlug('snake')
    expect(screen.getByRole('link', { name: /Back to Projects/i })).toHaveAttribute(
      'href',
      '/#projects'
    )
  })
})

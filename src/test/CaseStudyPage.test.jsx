import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
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
    expect(screen.getByRole('heading', { name: /Case Study: Snake/i })).toBeInTheDocument()
    expect(screen.getAllByText(/game loop/i).length).toBeGreaterThan(0)
  })

  it('renders each of the four case studies without crashing', () => {
    for (const slug of [
      'snake',
      'personal-chatbot',
      'youtube-summarizer',
      'payment-intelligence-network',
    ]) {
      const { unmount } = renderAtSlug(slug)
      expect(screen.getAllByRole('heading').length).toBeGreaterThan(0)
      unmount()
    }
  })

  it('redirects to the homepage for an unknown slug', () => {
    renderAtSlug('not-a-real-project')
    expect(screen.getByText('Homepage')).toBeInTheDocument()
  })

  it('links back to the selected-work anchor, which exists in the new IA', () => {
    renderAtSlug('snake')
    expect(screen.getByRole('link', { name: /Back to selected work/i })).toHaveAttribute(
      'href',
      '/#work'
    )
  })

  it('sets a case-study-specific document title', () => {
    renderAtSlug('personal-chatbot')
    expect(document.title).toMatch(/Personal Chatbot with Memory — Case study — Rahul Agarwal/)
  })

  it('resolves the redesign case study title from the lab data, not a hard-coded string', () => {
    renderAtSlug('payment-intelligence-network')
    expect(document.title).toMatch(/This portfolio — Case study — Rahul Agarwal/)
  })

  it('publishes the redesign case study with the public framing, never the private prep sections', () => {
    renderAtSlug('payment-intelligence-network')
    // The build-prep framework ends in an "Interview defense" section that must never ship.
    expect(screen.queryByText(/interview defense/i)).not.toBeInTheDocument()
    expect(screen.getByText(/Design questions, answered/i)).toBeInTheDocument()
    // And its numbers must match the site's own story.
    expect(screen.getAllByText(/100 \/ 100 \/ 100 \/ 100/).length).toBeGreaterThan(0)
  })
})

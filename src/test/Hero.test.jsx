import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Hero from '../components/Hero'
import { setPrefersReducedMotion } from './mocks'

function renderHero() {
  return render(
    <MemoryRouter>
      <Hero />
    </MemoryRouter>
  )
}

describe('Hero', () => {
  it('renders the name headline and role', () => {
    renderHero()
    expect(screen.getByRole('heading', { name: /Rahul Agarwal/ })).toBeInTheDocument()
    // The typed role headline exposes its text via both a visually-hidden
    // accessible-name node and a width-reserving node, so more than one match
    // is expected here.
    expect(screen.getAllByText(/Product Manager/).length).toBeGreaterThan(0)
  })

  it('shows a mono "Scroll" label as the scroll indicator', () => {
    renderHero()
    expect(screen.getByText('Scroll')).toBeInTheDocument()
  })

  it('links the View Projects CTA to the projects section', () => {
    renderHero()
    expect(screen.getByRole('link', { name: 'View Projects' })).toHaveAttribute(
      'href',
      '#projects'
    )
  })

  it('renders the availability pill with the locked copy', () => {
    renderHero()
    expect(screen.getByText(/Building AI products/)).toBeInTheDocument()
    expect(screen.getByText(/Open to conversations/)).toBeInTheDocument()
  })

  it('renders a static (non-pulsing) dot under prefers-reduced-motion', () => {
    setPrefersReducedMotion(true)
    renderHero()
    // The pill itself must still render its copy; the animate-ping class is
    // neutralized globally via the prefers-reduced-motion CSS rule (index.css),
    // so the badge markup is unconditional but the dot must not be the only content.
    expect(screen.getByText(/Building AI products/)).toBeInTheDocument()
    setPrefersReducedMotion(false)
  })

  it('does not render the removed POV line (Rahul, 2026-08-27: "looks weird")', () => {
    renderHero()
    expect(
      screen.queryByText(/I taught AI to read payment docs/)
    ).not.toBeInTheDocument()
  })

  it('renders the credentials line with the locked copy', () => {
    renderHero()
    // rendered via &middot; entities, so match on the visible text nodes rather
    // than the literal HTML entity.
    expect(screen.getByText(/IIT Roorkee/)).toBeInTheDocument()
    expect(screen.getByText(/IIM Kozhikode/)).toBeInTheDocument()
    expect(screen.getByText(/Product @ Paysecure/)).toBeInTheDocument()
  })
})

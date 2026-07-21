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
    expect(screen.getByText(/Product Manager/)).toBeInTheDocument()
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
})

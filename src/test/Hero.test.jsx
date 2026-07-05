import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Hero from '../components/Hero'

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
})

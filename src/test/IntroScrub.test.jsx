import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import IntroScrub from '../components/IntroScrub'

vi.mock('../three/globeScene', () => ({
  buildScene: vi.fn(() => ({
    render: vi.fn(),
    resize: vi.fn(),
    dispose: vi.fn(),
  })),
}))

function renderIntroScrub() {
  return render(
    <MemoryRouter>
      <IntroScrub />
    </MemoryRouter>
  )
}

describe('IntroScrub', () => {
  it('renders the runway with an accessible "Intro" label', () => {
    renderIntroScrub()
    expect(screen.getByLabelText('Intro')).toBeInTheDocument()
  })

  it('hides the canvas from assistive tech', () => {
    const { container } = renderIntroScrub()
    expect(container.querySelector('canvas')).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders the real HeroContent name, CTA, and socials', () => {
    renderIntroScrub()
    expect(screen.getByRole('heading', { name: /Rahul Agarwal/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'View Projects' })).toHaveAttribute('href', '#projects')
    expect(screen.getByText('Scroll')).toBeInTheDocument()
  })
})

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

  it('hides the scrub medium (video or canvas) from assistive tech', () => {
    const { container } = renderIntroScrub()
    const video = container.querySelector('video')
    const canvas = container.querySelector('canvas')
    const medium = video || canvas
    expect(medium).not.toBeNull()
    // the medium itself or its wrapper must be aria-hidden
    expect(
      medium.getAttribute('aria-hidden') === 'true' ||
        medium.closest('[aria-hidden="true"]') !== null
    ).toBe(true)
  })

  it('scrub video is muted, inline, and preloaded for scrubbing', () => {
    const { container } = renderIntroScrub()
    const video = container.querySelector('video')
    expect(video).not.toBeNull()
    expect(video.muted).toBe(true)
    expect(video).toHaveAttribute('playsinline')
    expect(video).toHaveAttribute('preload', 'auto')
    expect(video.getAttribute('src')).toMatch(/intro-scrub\.mp4$/)
  })

  it('renders the real HeroContent name, CTA, and socials', () => {
    renderIntroScrub()
    expect(screen.getByRole('heading', { name: /Rahul Agarwal/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'View Projects' })).toHaveAttribute('href', '#projects')
    expect(screen.getByText('Scroll')).toBeInTheDocument()
  })
})

import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import HomeIntro from '../components/HomeIntro'
import useIntroMode from '../hooks/useIntroMode'

vi.mock('../hooks/useIntroMode')
vi.mock('../components/IntroScrub', () => ({
  default: () => <div data-testid="intro-scrub-stub" aria-label="Intro" />,
}))

function renderHomeIntro() {
  return render(
    <MemoryRouter>
      <HomeIntro />
    </MemoryRouter>
  )
}

describe('HomeIntro', () => {
  it('renders the static Hero content with no runway when mode is static', () => {
    useIntroMode.mockReturnValue('static')
    renderHomeIntro()
    expect(screen.getByRole('heading', { name: /Rahul Agarwal/ })).toBeInTheDocument()
    expect(screen.queryByTestId('intro-scrub-stub')).not.toBeInTheDocument()
  })

  it('renders IntroScrub when mode is scrub', () => {
    useIntroMode.mockReturnValue('scrub')
    renderHomeIntro()
    expect(screen.getByTestId('intro-scrub-stub')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /Rahul Agarwal/ })).not.toBeInTheDocument()
  })
})

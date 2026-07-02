import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import GameEmbed from '../components/ui/GameEmbed'

const EMBED_URL = 'https://example.com/snake'

describe('GameEmbed', () => {
  it('renders nothing when embedUrl is null', () => {
    const { container } = render(<GameEmbed embedUrl={null} title="Snake" />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders nothing when embedUrl is undefined', () => {
    const { container } = render(<GameEmbed title="Snake" />)
    expect(container).toBeEmptyDOMElement()
  })

  it('shows a Play facade without an iframe before activation', () => {
    const { container } = render(<GameEmbed embedUrl={EMBED_URL} title="Snake" />)
    expect(screen.getByRole('button', { name: 'Play Snake' })).toBeInTheDocument()
    expect(container.querySelector('iframe')).toBeNull()
  })

  it('mounts the iframe only after clicking Play', async () => {
    const user = userEvent.setup()
    const { container } = render(<GameEmbed embedUrl={EMBED_URL} title="Snake" />)

    await user.click(screen.getByRole('button', { name: 'Play Snake' }))

    const iframe = container.querySelector('iframe')
    expect(iframe).not.toBeNull()
    expect(iframe).toHaveAttribute('src', EMBED_URL)
    expect(iframe).toHaveAttribute('title', 'Snake')
    // The facade button is gone once the game is live
    expect(screen.queryByRole('button')).toBeNull()
  })
})

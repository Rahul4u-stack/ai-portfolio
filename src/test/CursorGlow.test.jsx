import { render, screen, waitFor } from '@testing-library/react'
import CursorGlow from '../components/ui/CursorGlow'
import { setCoarsePointer, setViewportMobile } from './mocks'

describe('CursorGlow', () => {
  afterEach(() => {
    setCoarsePointer(false)
    setViewportMobile(false)
  })

  it('renders the glow on fine-pointer desktop', async () => {
    render(<CursorGlow />)
    await waitFor(() => {
      expect(screen.getByTestId('cursor-glow')).toBeInTheDocument()
    })
    const glow = screen.getByTestId('cursor-glow')
    expect(glow).toHaveAttribute('aria-hidden', 'true')
    expect(glow.className).toContain('pointer-events-none')
  })

  it('renders nothing on coarse-pointer (touch) devices', () => {
    setCoarsePointer(true)
    const { container } = render(<CursorGlow />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders nothing on mobile viewports', () => {
    setViewportMobile(true)
    const { container } = render(<CursorGlow />)
    expect(container).toBeEmptyDOMElement()
  })
})

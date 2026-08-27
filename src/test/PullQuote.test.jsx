import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import PullQuote from '../components/ui/PullQuote'

describe('PullQuote', () => {
  it('renders the given quote wrapped in curly quotation marks', () => {
    render(
      <PullQuote quote="The best payment integration is the one your merchant never notices." />
    )
    const blockquote = screen.getByText(
      /The best payment integration is the one your merchant never notices\./
    )
    expect(blockquote.tagName.toLowerCase()).toBe('blockquote')
    expect(blockquote.textContent).toMatch(/^“.*”$/)
  })

  it('is a rhythm element, not a titled section — no heading of its own', () => {
    const { container } = render(<PullQuote quote="Test quote." />)
    expect(screen.getByLabelText('Point of view')).toBeInTheDocument()
    expect(container.querySelector('h2, h3')).not.toBeInTheDocument()
  })

  it('carries no attribution — it is a stated point of view, never a testimonial', () => {
    const { container } = render(<PullQuote quote="Test quote." />)
    expect(container.querySelector('cite')).not.toBeInTheDocument()
    expect(container.querySelector('footer')).not.toBeInTheDocument()
  })
})

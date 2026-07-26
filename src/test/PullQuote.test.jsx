import { render, screen } from '@testing-library/react'
import PullQuote from '../components/ui/PullQuote'

describe('PullQuote', () => {
  it('renders the given quote wrapped in curly quotation marks', () => {
    render(<PullQuote quote="The best payment integration is the one your merchant never notices." />)
    const blockquote = screen.getByText(
      /The best payment integration is the one your merchant never notices\./
    )
    expect(blockquote.tagName.toLowerCase()).toBe('blockquote')
    expect(blockquote.textContent).toMatch(/^“.*”$/)
  })

  it('renders the longer quote (b) without needing to truncate the copy', () => {
    const quote =
      "AI doesn't replace product judgment — it removes everything standing between judgment and shipping."
    render(<PullQuote quote={quote} />)
    expect(screen.getByText(new RegExp(quote.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))).toBeInTheDocument()
  })

  it('renders as a labelled section with no ghost numeral (rhythm element, not a titled section)', () => {
    const { container } = render(<PullQuote quote="Test quote." />)
    expect(screen.getByLabelText('Pull quote')).toBeInTheDocument()
    expect(container.querySelector('h2')).not.toBeInTheDocument()
  })
})

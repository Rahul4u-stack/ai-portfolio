import { render, screen } from '@testing-library/react'
import SectionHeading from '../components/ui/SectionHeading'

describe('SectionHeading', () => {
  it('renders the title as a heading', () => {
    render(<SectionHeading title="Projects" number="03" />)
    expect(screen.getByRole('heading', { name: 'Projects' })).toBeInTheDocument()
  })

  it('renders an aria-hidden ghost numeral when a number prop is passed', () => {
    const { container } = render(<SectionHeading title="Projects" number="03" />)
    const ghost = screen.getByText('03')
    expect(ghost).toHaveAttribute('aria-hidden', 'true')
    // Sanity check it's not mistakenly exposed as the accessible heading text.
    expect(container.querySelector('h2')).toHaveTextContent('Projects')
  })

  it('does not render a ghost numeral when the number prop is omitted', () => {
    render(<SectionHeading title="About" />)
    expect(screen.queryByText(/^0\d$/)).not.toBeInTheDocument()
  })
})

import { render, screen } from '@testing-library/react'
import Decisions from '../components/Decisions'
import { decisions } from '../data/decisions'

describe('Decisions', () => {
  it('has exactly 3 decision stories in the data file', () => {
    expect(decisions).toHaveLength(3)
  })

  it('renders a card with title, tradeoff, call, and outcome badge for every story', () => {
    render(<Decisions />)
    for (const decision of decisions) {
      expect(screen.getByRole('heading', { name: decision.title })).toBeInTheDocument()
      expect(screen.getByText(decision.tradeoff)).toBeInTheDocument()
      expect(screen.getByText(decision.call)).toBeInTheDocument()
      expect(screen.getByText(decision.outcome)).toBeInTheDocument()
    }
  })

  it('renders the section heading with number 04', () => {
    render(<Decisions />)
    expect(screen.getByRole('heading', { name: 'High-Stakes Decisions' })).toBeInTheDocument()
    const ghost = screen.getByText('04')
    expect(ghost).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders the section with id="decisions" for anchor-scroll consistency', () => {
    const { container } = render(<Decisions />)
    expect(container.querySelector('section#decisions')).toBeInTheDocument()
  })
})

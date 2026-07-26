import { render, screen } from '@testing-library/react'
import Frameworks from '../components/Frameworks'
import { frameworks } from '../data/frameworks'

describe('Frameworks', () => {
  it('has exactly 3 framework cards in the data file', () => {
    expect(frameworks).toHaveLength(3)
  })

  it('renders all three beats (most people think / reality / why it matters) for every card', () => {
    render(<Frameworks />)
    for (const framework of frameworks) {
      expect(screen.getByRole('heading', { name: framework.title })).toBeInTheDocument()
      expect(screen.getByText(framework.mostPeopleThink)).toBeInTheDocument()
      expect(screen.getByText(framework.reality)).toBeInTheDocument()
      expect(screen.getByText(framework.whyItMatters)).toBeInTheDocument()
    }
  })

  it('labels each beat with its small-caps mono heading', () => {
    render(<Frameworks />)
    // Labels are repeated once per card (3 cards), so assert the count matches.
    expect(screen.getAllByText('Most people think')).toHaveLength(frameworks.length)
    expect(screen.getAllByText('Reality')).toHaveLength(frameworks.length)
    expect(screen.getAllByText('Why it matters')).toHaveLength(frameworks.length)
  })

  it('renders the section heading with number 06', () => {
    render(<Frameworks />)
    expect(screen.getByRole('heading', { name: 'How I Think' })).toBeInTheDocument()
    const ghost = screen.getByText('06')
    expect(ghost).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders the section with id="frameworks" for anchor-scroll consistency', () => {
    const { container } = render(<Frameworks />)
    expect(container.querySelector('section#frameworks')).toBeInTheDocument()
  })
})

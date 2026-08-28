import { render, screen } from '@testing-library/react'
import Experience from '../components/Experience'
import { experiences } from '../data/experience'

describe('Experience', () => {
  it('renders all 4 company names', () => {
    render(<Experience />)
    for (const entry of experiences) {
      expect(screen.getByRole('heading', { name: entry.company })).toBeInTheDocument()
    }
  })

  it('renders all 4 summaries', () => {
    render(<Experience />)
    for (const entry of experiences) {
      expect(screen.getByText(entry.summary)).toBeInTheDocument()
    }
  })

  it('renders exactly one "Current" badge, on the first (Paysecure) stint', () => {
    render(<Experience />)
    const badges = screen.getAllByText('Current')
    expect(badges).toHaveLength(1)
  })

  it('renders 4 "Key impact" micro-labels, one per card', () => {
    render(<Experience />)
    expect(screen.getAllByText('Key impact')).toHaveLength(4)
  })

  it('renders the expected role titles', () => {
    render(<Experience />)
    expect(screen.getAllByText('Technical Product Manager')).toHaveLength(2)
    expect(screen.getByText('Associate Product Manager')).toBeInTheDocument()
    expect(screen.getByText('Specialist Programmer')).toBeInTheDocument()
  })

  it('renders a total of 15 impact bullets across all cards', () => {
    render(<Experience />)
    const totalHighlights = experiences.reduce((sum, e) => sum + e.highlights.length, 0)
    expect(totalHighlights).toBe(15)

    for (const entry of experiences) {
      for (const highlight of entry.highlights) {
        expect(screen.getByText(highlight)).toBeInTheDocument()
      }
    }
  })

  it('renders the section with id="experience" for anchor-scroll consistency', () => {
    const { container } = render(<Experience />)
    expect(container.querySelector('section#experience')).toBeInTheDocument()
  })
})

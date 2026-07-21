import { render, screen } from '@testing-library/react'
import About from '../components/About'

describe('About', () => {
  it('renders the final stat values on first render, before any scroll/inView', () => {
    render(<About />)

    expect(screen.getByText('7+')).toBeInTheDocument()
    expect(screen.getByText('$3.4M+')).toBeInTheDocument()
    expect(screen.getByText('300+')).toBeInTheDocument()
    expect(screen.getByText('10+')).toBeInTheDocument()
  })

  it('renders the recruiter-lens v2 stat labels', () => {
    render(<About />)

    expect(screen.getByText('Years in Product')).toBeInTheDocument()
    expect(screen.getByText('AI Products Shipped')).toBeInTheDocument()
    expect(screen.getByText('PSP Integrations Led')).toBeInTheDocument()
    expect(screen.getByText('GMV Managed')).toBeInTheDocument()
  })

  it('renders the profile photo with explicit dimensions and eager loading', () => {
    render(<About />)
    const img = screen.getByAltText(/Rahul Agarwal/i)
    expect(img).toHaveAttribute('width', '480')
    expect(img).toHaveAttribute('height', '480')
    expect(img).toHaveAttribute('loading', 'eager')
    expect(img.getAttribute('src')).not.toMatch(/profile\.jpg/)
  })
})

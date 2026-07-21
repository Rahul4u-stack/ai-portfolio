import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'

// Testimonials.jsx reads SHOW_TESTIMONIALS + testimonials from this data module at
// render time, so each test mocks the module fresh (via a dynamic import after
// vi.doMock) to exercise flag-off, flag-on-empty, and flag-on-with-data states
// without touching the real (flag-off, empty) production data file.
describe('Testimonials', () => {
  afterEach(() => {
    vi.doUnmock('../data/testimonials')
    vi.resetModules()
  })

  it('renders nothing when the flag is off', async () => {
    vi.resetModules()
    vi.doMock('../data/testimonials', () => ({
      SHOW_TESTIMONIALS: false,
      testimonials: [
        { quote: 'Should not render', name: 'Nobody', title: 'X', company: 'Y' },
      ],
    }))
    const { default: Testimonials } = await import('../components/Testimonials')
    const { container } = render(<Testimonials />)

    expect(container).toBeEmptyDOMElement()
  })

  it('renders nothing when the flag is on but the data array is empty', async () => {
    vi.resetModules()
    vi.doMock('../data/testimonials', () => ({
      SHOW_TESTIMONIALS: true,
      testimonials: [],
    }))
    const { default: Testimonials } = await import('../components/Testimonials')
    const { container } = render(<Testimonials />)

    expect(container).toBeEmptyDOMElement()
  })

  it('renders testimonial cards with name/title/company/quote when the flag is on with data', async () => {
    vi.resetModules()
    vi.doMock('../data/testimonials', () => ({
      SHOW_TESTIMONIALS: true,
      testimonials: [
        {
          quote: 'Rahul is one of the sharpest product minds I have worked with.',
          name: 'Jane Doe',
          title: 'VP Product',
          company: 'Example Corp',
        },
        {
          quote: 'A rare PM who can also ship code.',
          name: 'John Smith',
          title: 'CTO',
          company: 'Acme Inc',
        },
      ],
    }))
    const { default: Testimonials } = await import('../components/Testimonials')
    render(<Testimonials />)

    expect(document.querySelector('section#testimonials')).toBeInTheDocument()
    expect(screen.getByText(/sharpest product minds/)).toBeInTheDocument()
    expect(screen.getByText('Jane Doe')).toBeInTheDocument()
    expect(screen.getByText(/VP Product/)).toBeInTheDocument()
    expect(screen.getByText(/Example Corp/)).toBeInTheDocument()
    expect(screen.getByText('JD')).toBeInTheDocument()
    expect(screen.getByText('John Smith')).toBeInTheDocument()
  })
})

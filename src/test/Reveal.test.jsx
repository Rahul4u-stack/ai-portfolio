import { act, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Reveal from '../components/ui/Reveal'
import CountUp from '../components/ui/CountUp'
import { setPrefersReducedMotion, triggerIntersection } from './mocks'

/**
 * Regression tests for the defect this component exists to prevent: the previous build could
 * strand content at opacity 0 forever when an IntersectionObserver never fired, and animated
 * full-width mobile cards in from x:-60 so their text was clipped off the left edge.
 */
describe('Reveal', () => {
  it('renders its children into the document immediately', () => {
    render(<Reveal>visible content</Reveal>)
    expect(screen.getByText('visible content')).toBeInTheDocument()
  })

  it('under reduced motion, renders a plain element with no motion transform', () => {
    setPrefersReducedMotion(true)
    render(<Reveal>no motion here</Reveal>)
    const el = screen.getByText('no motion here')
    // The animated variant sets an inline transform; the reduced-motion one must not.
    expect(el.style.transform).toBe('')
    expect(el.style.opacity).toBe('')
  })

  it('never animates on the X axis — that is what clipped mobile cards off the left edge', () => {
    render(<Reveal>mobile safe</Reveal>)
    const el = screen.getByText('mobile safe')
    expect(el.style.transform || '').not.toMatch(/translateX\(-/)
  })

  it('reveals when the observer reports the element as intersecting', async () => {
    render(<Reveal>observed</Reveal>)
    act(() => triggerIntersection(true))
    await waitFor(() => {
      const el = screen.getByText('observed')
      expect(el.style.opacity === '' || el.style.opacity === '1').toBe(true)
    })
  })

  it('fails open: reveals content even if the observer never reports', async () => {
    render(<Reveal safetyMs={10}>fail open</Reveal>)
    // Deliberately never call triggerIntersection.
    await waitFor(
      () => {
        const el = screen.getByText('fail open')
        expect(el.style.opacity === '' || el.style.opacity === '1').toBe(true)
      },
      { timeout: 2000 }
    )
  })

  it('renders the requested element type', () => {
    render(<Reveal as="section" aria-label="wrapped" />)
    expect(screen.getByLabelText('wrapped').tagName).toBe('SECTION')
  })
})

describe('CountUp', () => {
  it('renders the canonical value string before any animation runs', () => {
    render(<CountUp value="300+" to={300} suffix="+" />)
    expect(screen.getByText('300+')).toBeInTheDocument()
  })

  it('renders the exact value under reduced motion and never counts', () => {
    setPrefersReducedMotion(true)
    render(<CountUp value="99.9%" to={99.9} suffix="%" decimals={1} />)
    expect(screen.getByText('99.9%')).toBeInTheDocument()
  })

  it('renders non-numeric values verbatim', () => {
    render(<CountUp value="2 wks → 2 days" />)
    expect(screen.getByText('2 wks → 2 days')).toBeInTheDocument()
  })
})

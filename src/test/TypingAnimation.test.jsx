import { act, render } from '@testing-library/react'
import { describe, it, expect, afterEach, vi } from 'vitest'
import TypingAnimation from '../components/ui/TypingAnimation'
import { setPrefersReducedMotion } from './mocks'

// The component renders the full text invisibly (to reserve layout width) and
// overlays the typed portion, so assertions read the overlay span directly.
const typedText = (container) =>
  container.querySelector('.absolute').textContent.replace(/_$/, '')

// Each animation step schedules the next timeout from an effect after
// re-render, so timers must be advanced in small increments (with effects
// flushed by act between them) rather than in one jump.
const advanceBy = (ms, step = 10) => {
  for (let t = 0; t < ms; t += step) {
    act(() => {
      vi.advanceTimersByTime(step)
    })
  }
}

describe('TypingAnimation', () => {
  afterEach(() => {
    setPrefersReducedMotion(false)
    vi.useRealTimers()
  })

  it('types the text out character by character', () => {
    vi.useFakeTimers()
    const { container } = render(
      <TypingAnimation text="AI PM" charDurationMs={10} startDelayMs={0} />
    )

    expect(typedText(container)).toBe('')

    advanceBy(30)
    expect(typedText(container)).toBe('AI ')

    advanceBy(50)
    expect(typedText(container)).toBe('AI PM')
  })

  it('exposes the full text to assistive tech while typing', () => {
    vi.useFakeTimers()
    const { container } = render(
      <TypingAnimation text="AI PM" charDurationMs={10} startDelayMs={0} />
    )
    expect(container.querySelector('[aria-label="AI PM"]')).toBeInTheDocument()
  })

  it('renders the full text immediately under reduced motion', () => {
    setPrefersReducedMotion(true)
    const { container } = render(<TypingAnimation text="AI PM" />)
    expect(typedText(container)).toBe('AI PM')
  })

  it('loops: holds the full text, deletes it, then types again', () => {
    vi.useFakeTimers()
    const { container } = render(
      <TypingAnimation
        text="AI PM"
        charDurationMs={10}
        startDelayMs={0}
        holdMs={100}
        deleteCharDurationMs={10}
        restartDelayMs={20}
      />
    )

    // type out fully (5 chars × 10ms)
    advanceBy(50)
    expect(typedText(container)).toBe('AI PM')

    // hold, then delete two chars (100ms hold + 2 × 10ms)
    advanceBy(120)
    expect(typedText(container)).toBe('AI ')

    // finish deleting (3 × 10ms), wait restart delay, retype two chars
    advanceBy(30 + 20 + 20)
    expect(typedText(container)).toBe('AI')
  })

  it('does not loop when loop is disabled', () => {
    vi.useFakeTimers()
    const { container } = render(
      <TypingAnimation
        text="AI PM"
        charDurationMs={10}
        startDelayMs={0}
        loop={false}
        holdMs={100}
      />
    )

    advanceBy(50)
    expect(typedText(container)).toBe('AI PM')

    advanceBy(1000)
    expect(typedText(container)).toBe('AI PM')
  })
})

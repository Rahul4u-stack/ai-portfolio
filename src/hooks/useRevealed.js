import { useEffect, useRef, useState } from 'react'
import useReducedMotion from './useReducedMotion'

/**
 * Fail-open "has this scrolled into view yet" hook.
 *
 * The previous build lost content to entrance animations: an element whose IntersectionObserver
 * never fired stayed at `opacity: 0` forever, and one section animated cards in from `x: -60`,
 * which clipped full-width mobile cards off the left edge.
 *
 * Rules encoded here:
 *  1. Reduced motion  → revealed immediately, no animation at all.
 *  2. No IntersectionObserver → revealed immediately.
 *  3. Observer present but silent → a short (400ms) safety timer reveals anyway.
 * Content is never hidden behind an animation that didn't run, and never for long.
 */
const SAFETY_MS = 400

export default function useRevealed({ amount = 0.12, safetyMs = SAFETY_MS } = {}) {
  const ref = useRef(null)
  const prefersReducedMotion = useReducedMotion()
  const supportsObserver = typeof IntersectionObserver !== 'undefined'

  const [observed, setObserved] = useState(false)
  // Fail-open cases are derived, not synced into state — no setState-in-effect, and a
  // mid-session switch to reduced motion reveals everything on the very next render.
  const revealed = observed || prefersReducedMotion || !supportsObserver

  useEffect(() => {
    if (prefersReducedMotion || !supportsObserver) return undefined

    const node = ref.current
    let settled = false
    const reveal = () => {
      if (settled) return
      settled = true
      setObserved(true)
    }
    if (!node) {
      // No element to observe (consumer never attached the ref) — show the content.
      const orphanTimer = setTimeout(reveal, 0)
      return () => clearTimeout(orphanTimer)
    }

    // Deliberately does NOT measure the element to decide whether it's already on screen.
    // Calling getBoundingClientRect() here forces a synchronous layout, and with ~30 Reveals
    // mounting at once that measured out at 600ms total blocking time on desktop and ~4s on
    // mobile. The observer already reports in-view elements within a frame of mount, and the
    // safety timer below covers the case where it doesn't.
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          reveal()
          observer.disconnect()
        }
      },
      { threshold: amount }
    )
    observer.observe(node)

    // Fail open: if the observer never reports (unsupported thresholds, zero-height parent,
    // a browser quirk), show the content anyway.
    const timer = setTimeout(reveal, safetyMs)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [amount, prefersReducedMotion, safetyMs, supportsObserver])

  return [ref, revealed, prefersReducedMotion]
}

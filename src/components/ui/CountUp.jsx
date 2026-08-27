import { useEffect, useRef, useState } from 'react'
import useRevealed from '../../hooks/useRevealed'

/**
 * Counts to a number exactly once, the first time it enters the viewport.
 *
 * The final string (`value`) is what renders for reduced motion, before the animation starts,
 * and for assistive tech — the animated digits are marked aria-hidden and the real value is
 * exposed via a visually-hidden span, so a screen reader never hears a spinning number.
 */
const DURATION_MS = 900

function format(n, { prefix = '', suffix = '', decimals = 0 }) {
  const magnitude = Math.abs(n)
  const body = decimals > 0 ? magnitude.toFixed(decimals) : String(Math.round(magnitude))
  return `${prefix}${body}${suffix}`
}

export default function CountUp({
  value,
  to,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
}) {
  const [ref, revealed, prefersReducedMotion] = useRevealed({ amount: 0.4 })
  const [display, setDisplay] = useState(null)
  const started = useRef(false)

  const animatable = typeof to === 'number' && !prefersReducedMotion

  useEffect(() => {
    if (!animatable || !revealed || started.current) return undefined
    started.current = true

    let frame = null
    const start = performance.now()
    const target = Math.abs(to)

    const tick = (now) => {
      const t = Math.min((now - start) / DURATION_MS, 1)
      const eased = 1 - (1 - t) ** 3
      setDisplay(format(eased * target, { prefix, suffix, decimals }))
      if (t < 1) frame = requestAnimationFrame(tick)
      else setDisplay(null) // hand back to the canonical string
    }

    frame = requestAnimationFrame(tick)
    return () => {
      if (frame) cancelAnimationFrame(frame)
    }
  }, [animatable, revealed, to, prefix, suffix, decimals])

  if (display === null) {
    return (
      <span ref={ref} className={className}>
        {value}
      </span>
    )
  }

  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true">{display}</span>
      <span className="sr-only">{value}</span>
    </span>
  )
}

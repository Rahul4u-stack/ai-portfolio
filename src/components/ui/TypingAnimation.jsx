import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import useReducedMotion from '../../hooks/useReducedMotion'

// MagicUI-style typing animation with a blinking underscore cursor
// (https://magicui.design/docs/components/typing-animation), extended to loop:
// type → hold → delete → retype. Under reduced motion the full text renders
// immediately with a static cursor and no looping.
export default function TypingAnimation({
  text,
  as: Tag = 'p',
  className = '',
  charDurationMs = 60,
  startDelayMs = 800,
  loop = true,
  holdMs = 2200,
  deleteCharDurationMs = 30,
  restartDelayMs = 500,
}) {
  const prefersReducedMotion = useReducedMotion()
  const [typedCount, setTypedCount] = useState(0)
  // typing | deleting
  const [phase, setPhase] = useState('typing')

  const holding = phase === 'typing' && typedCount >= text.length

  useEffect(() => {
    if (prefersReducedMotion) {
      setTypedCount(text.length)
      return undefined
    }

    let timeout
    if (phase === 'typing') {
      if (typedCount < text.length) {
        timeout = setTimeout(
          () => setTypedCount((count) => count + 1),
          typedCount === 0 ? startDelayMs + charDurationMs : charDurationMs
        )
      } else if (loop) {
        timeout = setTimeout(() => setPhase('deleting'), holdMs)
      }
    } else if (typedCount > 0) {
      timeout = setTimeout(() => setTypedCount((count) => count - 1), deleteCharDurationMs)
    } else {
      timeout = setTimeout(() => setPhase('typing'), restartDelayMs)
    }

    return () => clearTimeout(timeout)
  }, [
    phase,
    typedCount,
    text,
    charDurationMs,
    startDelayMs,
    loop,
    holdMs,
    deleteCharDurationMs,
    restartDelayMs,
    prefersReducedMotion,
  ])

  return (
    <Tag className={className} aria-label={text}>
      {/* Invisible full text reserves the final width so centered layout
          doesn't reflow while typing; visible text overlays it. */}
      <span aria-hidden="true" className="relative inline-block">
        <span className="invisible">{text}_</span>
        <span className="absolute inset-0 text-left whitespace-nowrap">
          {text.slice(0, typedCount)}
          <motion.span
            animate={prefersReducedMotion || !holding ? { opacity: 1 } : { opacity: [1, 0, 1] }}
            transition={
              prefersReducedMotion || !holding
                ? { duration: 0 }
                : { duration: 1, repeat: Infinity, ease: 'linear' }
            }
          >
            _
          </motion.span>
        </span>
      </span>
    </Tag>
  )
}

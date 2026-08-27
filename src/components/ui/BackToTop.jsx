import { useEffect, useState } from 'react'
import { FaArrowUp } from 'react-icons/fa'
import useReducedMotion from '../../hooks/useReducedMotion'

/** Appears only after 600px of scrolling — deep enough never to overlap hero content. */
const THRESHOLD = 600

export default function BackToTop() {
  const [visible, setVisible] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > THRESHOLD)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      type="button"
      onClick={() =>
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' })
      }
      aria-label="Back to top"
      // Sized to the 44px touch minimum and kept clear of content.
      className="fixed bottom-5 right-5 z-40 grid h-11 w-11 place-items-center rounded-card
        border border-rule-strong bg-ink/90 text-text-secondary backdrop-blur-md
        transition-colors hover:border-indigo-text hover:text-indigo-text
        motion-safe:animate-none"
    >
      <FaArrowUp aria-hidden="true" size={14} />
    </button>
  )
}

import { useEffect, useRef, useState } from 'react'
import useReducedMotion from '../../hooks/useReducedMotion'

// Soft indigo spotlight that trails the cursor (mix-blend screen lightens
// whatever it passes over). Desktop / fine-pointer only.
const GLOW_SIZE = 520
const LERP = 0.18

export default function CursorGlow() {
  const prefersReducedMotion = useReducedMotion()
  const glowRef = useRef(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const mobile = window.matchMedia('(max-width: 767px)').matches
    setEnabled(!coarse && !mobile)
  }, [])

  useEffect(() => {
    if (!enabled) return undefined

    let rafId = null
    let targetX = -9999
    let targetY = -9999
    let x = -9999
    let y = -9999
    let seen = false

    function handleMove(e) {
      targetX = e.clientX
      targetY = e.clientY
      if (!seen) {
        // First movement: snap to the cursor instead of flying in from off-screen
        x = targetX
        y = targetY
        seen = true
      }
    }

    function tick() {
      rafId = requestAnimationFrame(tick)
      if (document.hidden || !glowRef.current) return
      const factor = prefersReducedMotion ? 1 : LERP
      x += (targetX - x) * factor
      y += (targetY - y) * factor
      glowRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
    }

    window.addEventListener('mousemove', handleMove, { passive: true })
    rafId = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [enabled, prefersReducedMotion])

  if (!enabled) return null

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      data-testid="cursor-glow"
      className="fixed top-0 left-0 z-[1] pointer-events-none rounded-full mix-blend-screen"
      style={{
        width: GLOW_SIZE,
        height: GLOW_SIZE,
        background: 'radial-gradient(circle at center, rgba(99,102,241,0.22), transparent 60%)',
        transform: 'translate3d(-9999px, -9999px, 0) translate(-50%, -50%)',
        willChange: 'transform',
      }}
    />
  )
}

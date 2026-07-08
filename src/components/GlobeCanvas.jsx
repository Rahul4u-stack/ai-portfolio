import { useEffect, useRef } from 'react'
import { updateAtProgress } from '../three/timeline'

const LERP_FACTOR = 0.08

export default function GlobeCanvas({ progressRef, overlayRef, runwayRef }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    let disposed = false
    let scene = null
    let rafId = null
    let smoothed = 0
    let paused = false
    let inView = true
    let observer = null

    function handleVisibility() {
      paused = document.hidden
    }

    function tick() {
      rafId = requestAnimationFrame(tick)
      if (paused || !inView || !scene) return

      const target = progressRef.current ?? 0
      smoothed += (target - smoothed) * LERP_FACTOR
      scene.render(smoothed)

      if (overlayRef?.current) {
        const state = updateAtProgress(smoothed)
        overlayRef.current.style.opacity = String(state.heroOverlayOpacity)
        overlayRef.current.style.transform = `translateY(${state.heroOverlayTranslateY}px)`
      }
    }

    async function init() {
      const { buildScene } = await import('../three/globeScene')
      if (disposed || !canvasRef.current) return

      scene = buildScene(canvasRef.current)

      window.addEventListener('resize', scene.resize)
      document.addEventListener('visibilitychange', handleVisibility)

      const target = runwayRef?.current
      if (typeof IntersectionObserver !== 'undefined' && target) {
        observer = new IntersectionObserver(
          ([entry]) => {
            inView = entry.isIntersecting
          },
          { threshold: 0 }
        )
        observer.observe(target)
      }

      rafId = requestAnimationFrame(tick)
    }

    init()

    return () => {
      disposed = true
      if (rafId) cancelAnimationFrame(rafId)
      if (scene) window.removeEventListener('resize', scene.resize)
      document.removeEventListener('visibilitychange', handleVisibility)
      if (observer) observer.disconnect()
      if (scene) scene.dispose()
    }
  }, [progressRef, overlayRef, runwayRef])

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full block" />
}

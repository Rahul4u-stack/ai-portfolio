import { useEffect, useRef } from 'react'
import { updateAtProgress } from '../../three/timeline'

const LERP_FACTOR = 0.08
// Fade the frame to the page surface color at the end of the runway so the
// bright final video frame hands off seamlessly into <About/>.
const HANDOFF_FADE_START = 0.9

export default function ScrubVideo({ src, progressRef, overlayRef, runwayRef }) {
  const videoRef = useRef(null)
  const fadeRef = useRef(null)

  useEffect(() => {
    let rafId = null
    let smoothed = 0
    let paused = false
    let inView = true
    let observer = null
    let duration = 0

    const video = videoRef.current
    if (!video) return undefined

    function handleVisibility() {
      paused = document.hidden
    }

    function handleMeta() {
      duration = video.duration || 0
    }

    function tick() {
      rafId = requestAnimationFrame(tick)
      if (paused || !inView) return

      const target = progressRef.current ?? 0
      smoothed += (target - smoothed) * LERP_FACTOR

      if (duration > 0) {
        // Small epsilon keeps currentTime strictly inside the stream so the
        // final frame never flickers to black at t=1.
        video.currentTime = smoothed * (duration - 0.05)
      }

      const state = updateAtProgress(smoothed)
      if (overlayRef?.current) {
        overlayRef.current.style.opacity = String(state.heroOverlayOpacity)
        overlayRef.current.style.transform = `translateY(${state.heroOverlayTranslateY}px)`
      }
      if (fadeRef.current) {
        const fade = Math.min(1, Math.max(0, (smoothed - HANDOFF_FADE_START) / (1 - HANDOFF_FADE_START)))
        fadeRef.current.style.opacity = String(fade)
      }
    }

    video.addEventListener('loadedmetadata', handleMeta)
    if (video.readyState >= 1) handleMeta()
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

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      video.removeEventListener('loadedmetadata', handleMeta)
      document.removeEventListener('visibilitychange', handleVisibility)
      if (observer) observer.disconnect()
    }
  }, [progressRef, overlayRef, runwayRef])

  return (
    <div className="absolute inset-0" aria-hidden="true">
      <video
        ref={videoRef}
        src={src}
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div ref={fadeRef} className="absolute inset-0 bg-surface" style={{ opacity: 0 }} />
    </div>
  )
}

import { useRef } from 'react'
import { useMotionValueEvent, useScroll } from 'framer-motion'
import HeroContent from './HeroContent'
import GlobeCanvas from './GlobeCanvas'
import ScrubVideo from './ui/ScrubVideo'

// Desktop scrub medium: 'video' (Kling-generated push-in, public/video/intro-scrub.mp4)
// or 'globe' (the WebGL transaction-network globe). One-line swap.
const INTRO_MEDIA = 'video'
const INTRO_VIDEO_SRC = '/video/intro-scrub.mp4'
const INTRO_VIDEO_POSTER = '/video/intro-scrub-poster.webp'

export default function IntroScrub() {
  const runwayRef = useRef(null)
  const overlayRef = useRef(null)
  const progressRef = useRef(0)

  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: ['start start', 'end end'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    progressRef.current = value
  })

  return (
    <div ref={runwayRef} aria-label="Intro" className="relative h-[280vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-surface">
        {INTRO_MEDIA === 'video' ? (
          <ScrubVideo
            src={INTRO_VIDEO_SRC}
            posterSrc={INTRO_VIDEO_POSTER}
            progressRef={progressRef}
            overlayRef={overlayRef}
            runwayRef={runwayRef}
          />
        ) : (
          <GlobeCanvas progressRef={progressRef} overlayRef={overlayRef} runwayRef={runwayRef} />
        )}
        <div
          ref={overlayRef}
          className="absolute inset-0 z-10 flex items-center justify-center"
        >
          {/* Scrim: keeps hero text legible over bright video frames; lives
              inside the overlay so it fades out with the text. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(ellipse_65%_62%_at_center,rgba(10,10,15,0.82)_0%,rgba(10,10,15,0.45)_55%,transparent_85%)]"
          />
          <HeroContent />
        </div>
      </div>
    </div>
  )
}

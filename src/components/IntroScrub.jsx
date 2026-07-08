import { useRef } from 'react'
import { useMotionValueEvent, useScroll } from 'framer-motion'
import HeroContent from './HeroContent'
import GlobeCanvas from './GlobeCanvas'

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
        <GlobeCanvas progressRef={progressRef} overlayRef={overlayRef} runwayRef={runwayRef} />
        <div
          ref={overlayRef}
          className="absolute inset-0 z-10 flex items-center justify-center"
        >
          <HeroContent />
        </div>
      </div>
    </div>
  )
}

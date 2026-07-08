import { useEffect, useMemo, useState } from 'react'
import useReducedMotion from './useReducedMotion'
import { isWebGLAvailable } from '../three/webglSupport'

const MOBILE_QUERY = '(max-width: 767px)'
const COARSE_POINTER_QUERY = '(pointer: coarse)'

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(query).matches : false
  )

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined
    const mql = window.matchMedia(query)
    setMatches(mql.matches)
    const handleChange = (event) => setMatches(event.matches)
    if (mql.addEventListener) {
      mql.addEventListener('change', handleChange)
      return () => mql.removeEventListener('change', handleChange)
    }
    mql.addListener(handleChange)
    return () => mql.removeListener(handleChange)
  }, [query])

  return matches
}

export default function useIntroMode() {
  const prefersReducedMotion = useReducedMotion()
  const isMobile = useMediaQuery(MOBILE_QUERY)
  const isCoarsePointer = useMediaQuery(COARSE_POINTER_QUERY)
  const webglAvailable = useMemo(() => isWebGLAvailable(), [])

  if (prefersReducedMotion || isMobile || isCoarsePointer || !webglAvailable) {
    return 'static'
  }
  return 'scrub'
}

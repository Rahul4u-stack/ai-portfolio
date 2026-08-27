import { useSyncExternalStore } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

/**
 * Tracks the OS reduced-motion preference via useSyncExternalStore — the media query is an
 * external store, and this shape gives a tear-free read with no setState-in-effect.
 *
 * Errs toward `true` when matchMedia is unavailable: an environment we cannot ask should show
 * content immediately rather than animate it in.
 */
function subscribe(onChange) {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {}
  const mql = window.matchMedia(QUERY)
  if (mql.addEventListener) {
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }
  // Safari < 14 only has the deprecated listener API.
  mql.addListener(onChange)
  return () => mql.removeListener(onChange)
}

function getSnapshot() {
  if (typeof window === 'undefined' || !window.matchMedia) return true
  return window.matchMedia(QUERY).matches
}

export default function useReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, () => true)
}

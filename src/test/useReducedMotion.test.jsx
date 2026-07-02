import { renderHook } from '@testing-library/react'
import useReducedMotion from '../hooks/useReducedMotion'
import { setPrefersReducedMotion } from './mocks'

// framer-motion reads the (prefers-reduced-motion) media query once, then keeps
// it current via the mediaQueryList listener. Each hook mount snapshots the
// current value, so a fresh renderHook after a preference change sees the update.
describe('useReducedMotion', () => {
  it('returns false when the user has no reduced-motion preference', () => {
    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(false)
  })

  it('returns true when prefers-reduced-motion is enabled', () => {
    setPrefersReducedMotion(true)
    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(true)
  })

  it('returns false again when the preference is turned back off', () => {
    setPrefersReducedMotion(true)
    setPrefersReducedMotion(false)
    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(false)
  })
})

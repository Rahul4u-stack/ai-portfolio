import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import useReducedMotion from '../hooks/useReducedMotion'
import { setPrefersReducedMotion } from './mocks'

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

  it('reacts to the preference changing while mounted', () => {
    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(false)

    act(() => setPrefersReducedMotion(true))
    expect(result.current).toBe(true)

    act(() => setPrefersReducedMotion(false))
    expect(result.current).toBe(false)
  })

  it('errs toward reduced motion when matchMedia is unavailable', () => {
    const original = window.matchMedia
    // Deliberately remove the API: an environment we cannot ask should show content
    // immediately rather than animate it in.
    vi.stubGlobal('matchMedia', undefined)
    window.matchMedia = undefined
    try {
      const { result } = renderHook(() => useReducedMotion())
      expect(result.current).toBe(true)
    } finally {
      window.matchMedia = original
      vi.unstubAllGlobals()
    }
  })
})

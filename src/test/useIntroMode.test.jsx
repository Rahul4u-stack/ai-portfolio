import { act, renderHook } from '@testing-library/react'
import { vi } from 'vitest'
import useIntroMode from '../hooks/useIntroMode'
import { setPrefersReducedMotion, setViewportMobile, setCoarsePointer } from './mocks'

vi.mock('../three/webglSupport', () => ({
  isWebGLAvailable: vi.fn(() => false),
}))

import { isWebGLAvailable } from '../three/webglSupport'

describe('useIntroMode', () => {
  afterEach(() => {
    // These setters synchronously notify any still-mounted matchMedia
    // listeners (RTL's auto-unmount runs in a *later* afterEach, so the
    // hook from the just-finished test is still mounted here). Wrap in
    // act() so any resulting setState isn't flagged as an out-of-act update.
    act(() => {
      setPrefersReducedMotion(false)
      setViewportMobile(false)
      setCoarsePointer(false)
    })
    isWebGLAvailable.mockReturnValue(false)
  })

  it('returns static when the user prefers reduced motion', () => {
    setPrefersReducedMotion(true)
    const { result } = renderHook(() => useIntroMode())
    expect(result.current).toBe('static')
  })

  it('returns static on mobile viewport widths', () => {
    setViewportMobile(true)
    const { result } = renderHook(() => useIntroMode())
    expect(result.current).toBe('static')
  })

  it('returns static on coarse pointer devices', () => {
    setCoarsePointer(true)
    const { result } = renderHook(() => useIntroMode())
    expect(result.current).toBe('static')
  })

  it('returns static when WebGL is unavailable', () => {
    isWebGLAvailable.mockReturnValue(false)
    const { result } = renderHook(() => useIntroMode())
    expect(result.current).toBe('static')
  })

  it('returns scrub when no static condition applies', () => {
    isWebGLAvailable.mockReturnValue(true)
    const { result } = renderHook(() => useIntroMode())
    expect(result.current).toBe('scrub')
  })
})

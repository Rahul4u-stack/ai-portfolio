import { act, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import RoutingNetwork from '../components/hero/RoutingNetwork'
import { triggerIntersection, triggerResize } from './mocks'

/**
 * Drives the animation loop by hand.
 *
 * A screenshot cannot verify motion, and headless Chrome's virtual clock does not reliably advance
 * requestAnimationFrame — so the frame loop is driven deterministically here instead. This is the
 * test that would have caught the real bug found during the build: React re-rendering the packet
 * pool (when the shipped counter ticked) reset every packet's transform mid-flight.
 */

/**
 * Fake frame clock with *working* cancellation.
 *
 * Cancellation has to be real: an effect that re-runs (a layout change, say) cleans up by calling
 * cancelAnimationFrame. Stub that as a no-op and the superseded loop keeps running alongside the
 * new one, both writing to the same pooled circles — which looks exactly like a product bug and
 * is not one.
 */
let pending = new Map()
let nextFrameId = 1
let clock = 0

function flushFrames(count, msPerFrame = 16) {
  for (let i = 0; i < count; i += 1) {
    const due = [...pending.values()]
    pending = new Map()
    clock += msPerFrame
    act(() => {
      for (const cb of due) cb(clock)
    })
  }
}

/**
 * jsdom reports a 0px container, so the component picks its narrow layout where every trunk node
 * shares an x and motion is vertical. These assertions read much more clearly against the wide
 * layout, so force it explicitly before driving any frames.
 */
function renderWide() {
  const result = render(<RoutingNetwork />)
  act(() => triggerResize(1024))
  return result
}

function livePackets(container) {
  return [...container.querySelectorAll('circle[r="3.5"]:not([cx])')]
    .filter((c) => c.getAttribute('opacity') === '1')
    .map((c) => {
      const [, x, y] = /translate\(([-\d.]+) ([-\d.]+)\)/.exec(c.getAttribute('transform')) ?? []
      return { x: Number(x), y: Number(y), fill: c.getAttribute('fill') }
    })
}

beforeEach(() => {
  pending = new Map()
  nextFrameId = 1
  clock = 0
  vi.stubGlobal('requestAnimationFrame', (cb) => {
    const id = nextFrameId
    nextFrameId += 1
    pending.set(id, cb)
    return id
  })
  vi.stubGlobal('cancelAnimationFrame', (id) => pending.delete(id))
  vi.spyOn(performance, 'now').mockImplementation(() => clock)
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('RoutingNetwork — driven animation', () => {
  it('starts a frame loop on mount', () => {
    render(<RoutingNetwork />)
    expect(pending.size).toBeGreaterThan(0)
  })

  it('runs exactly one loop at a time — a superseded loop must cancel itself', () => {
    render(<RoutingNetwork />)
    act(() => triggerResize(1024))
    flushFrames(2)
    // Two concurrent loops would fight over the same pooled circles with different layouts.
    expect(pending.size).toBe(1)
  })

  it('hides the still frame once the live loop produces a frame', () => {
    const { container } = render(<RoutingNetwork />)
    const still = container.querySelector('circle[r="3.5"][cx]').parentElement
    expect(still.style.display).not.toBe('none')

    flushFrames(3)
    expect(still.style.display).toBe('none')
  })

  it('advances packets along the pipeline', () => {
    const { container } = renderWide()
    flushFrames(5)
    const early = livePackets(container)
    expect(early.length).toBeGreaterThan(0)

    flushFrames(20)
    const later = livePackets(container)
    expect(later[0].x).toBeGreaterThan(early[0].x)
  })

  it('spawns more packets over time and eventually ships one', () => {
    const { container } = renderWide()
    flushFrames(10)
    expect(livePackets(container).length).toBeGreaterThanOrEqual(1)

    // Long enough for several spawns and at least one full traversal.
    flushFrames(500)
    expect(livePackets(container).length).toBeGreaterThan(1)
    expect(container.textContent).toMatch(/Shipped/)
    const shipped = Number(/Shipped\s*(\d+)/.exec(container.textContent)?.[1])
    expect(shipped).toBeGreaterThan(0)
  })

  it('re-rendering never resets a packet mid-flight — the bug this structure exists to prevent', () => {
    const { container } = renderWide()
    flushFrames(30)
    const before = livePackets(container)[0].x

    // Force React re-renders the way the live page does: an intersection callback firing and a
    // same-layout re-measure. Neither may move a packet backwards.
    act(() => triggerResize(1024))
    act(() => triggerIntersection(true))
    const afterRerender = livePackets(container)[0].x
    expect(afterRerender).toBeGreaterThanOrEqual(before)

    flushFrames(10)
    expect(livePackets(container)[0].x).toBeGreaterThan(before)
  })

  it('freezes while scrolled out of view and resumes when it comes back', () => {
    // Same guard as the hidden-tab pause (`if (hidden || offscreen) return`). The offscreen branch
    // is the one this suite can drive deterministically; the hidden-tab branch was confirmed in a
    // real browser, where document.hidden is true in a background tab and packets do not advance.
    const { container } = renderWide()
    flushFrames(30)
    const beforeScrollAway = livePackets(container)[0].x
    expect(beforeScrollAway).toBeGreaterThan(0)

    act(() => triggerIntersection(false))
    flushFrames(60)
    expect(livePackets(container)[0].x).toBe(beforeScrollAway)

    act(() => triggerIntersection(true))
    flushFrames(20)
    expect(livePackets(container)[0].x).toBeGreaterThan(beforeScrollAway)
  })

  it('routes a failing packet up to the detour node rather than dropping it', () => {
    const { container } = renderWide()
    // Every 4th packet fails validation; run long enough for one to reach the gate.
    let sawCoral = false
    let sawOffTrunk = false
    for (let i = 0; i < 80 && !(sawCoral && sawOffTrunk); i += 1) {
      flushFrames(10)
      const packets = livePackets(container)
      if (packets.some((p) => p.fill === '#ff8a73')) sawCoral = true
      // The wide layout keeps the trunk at y=140; the detour sits well above it.
      if (packets.some((p) => p.y < 130)) sawOffTrunk = true
    }
    expect(sawCoral, 'a doomed packet should warm to the tension colour').toBe(true)
    expect(sawOffTrunk, 'a rejected packet should leave the trunk via the detour').toBe(true)
  })

  it('stops requesting frames after unmount', () => {
    const cancel = vi.fn()
    vi.stubGlobal('cancelAnimationFrame', cancel)
    const { unmount } = render(<RoutingNetwork />)
    flushFrames(3)
    unmount()
    expect(cancel).toHaveBeenCalled()
  })
})

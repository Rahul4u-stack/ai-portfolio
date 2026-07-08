import { getPhase, updateAtProgress, PHASES } from '../three/timeline'
import { NODES, DIVE_TARGET_NODE, latLonToVec3, GLOBE_RADIUS } from '../three/nodes'

describe('timeline', () => {
  it('resolves the correct phase at each documented boundary', () => {
    expect(getPhase(0)).toBe('orbit')
    expect(getPhase(0.49)).toBe('orbit')
    expect(getPhase(0.5)).toBe('dive')
    expect(getPhase(0.84)).toBe('dive')
    expect(getPhase(0.85)).toBe('bloomIn')
    expect(getPhase(0.94)).toBe('bloomIn')
    expect(getPhase(0.95)).toBe('bloomOut')
    expect(getPhase(1)).toBe('bloomOut')
  })

  it('exposes the phase table with the documented boundaries', () => {
    expect(PHASES.map((p) => p.name)).toEqual(['orbit', 'dive', 'bloomIn', 'bloomOut'])
    expect(PHASES[0]).toMatchObject({ start: 0, end: 0.5 })
    expect(PHASES[1]).toMatchObject({ start: 0.5, end: 0.85 })
    expect(PHASES[2]).toMatchObject({ start: 0.85, end: 0.95 })
    expect(PHASES[3]).toMatchObject({ start: 0.95, end: 1 })
  })

  it('hero overlay starts fully opaque and fades out by t=0.6', () => {
    expect(updateAtProgress(0).heroOverlayOpacity).toBe(1)
    expect(updateAtProgress(0.6).heroOverlayOpacity).toBe(0)
  })

  it('bloom is fully faded out by the end of the runway', () => {
    expect(updateAtProgress(1).bloomOpacity).toBe(0)
  })

  it('camera radius strictly decreases across the dive phase', () => {
    const samples = [0.5, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85].map(
      (t) => updateAtProgress(t).cameraRadius
    )
    for (let i = 1; i < samples.length; i += 1) {
      expect(samples[i]).toBeLessThan(samples[i - 1])
    }
  })

  it('is deterministic: repeated or out-of-order calls with the same t produce identical output', () => {
    const a = updateAtProgress(0.42)
    const b = updateAtProgress(0.9)
    const c = updateAtProgress(0.42)
    expect(c).toEqual(a)
    expect(a).not.toEqual(b)
  })

  it('dive camera target accounts for the globe rotation frozen at the end of orbit, not the pre-rotation Mumbai direction', () => {
    // The globe group rotates 108deg (see ORBIT_ROTATION_DEG) during orbit and
    // is frozen there for the rest of the timeline. The camera is not a child
    // of that rotated group, so its lookAt target must be pre-rotated by the
    // same angle to actually land on Mumbai's real (rotated) world position -
    // regression test for a bug where the camera dove toward a stale,
    // un-rotated point and the bloom sprite ended up out of view.
    const mumbai = NODES.find((node) => node.name === DIVE_TARGET_NODE)
    const rawDirection = latLonToVec3(mumbai.lat, mumbai.lon, 1)
    const orbitFinalAngle = 108 * (Math.PI / 180)
    const cos = Math.cos(orbitFinalAngle)
    const sin = Math.sin(orbitFinalAngle)
    const expectedRotated = {
      x: rawDirection.x * cos + rawDirection.z * sin,
      y: rawDirection.y,
      z: -rawDirection.x * sin + rawDirection.z * cos,
    }

    // Target must sit on the globe SURFACE (radius GLOBE_RADIUS), where the
    // bloom sprite actually lives — a unit-radius target aims the close camera
    // several degrees off the node (regression: bloom rendered off-frame).
    const { cameraTarget, cameraPosition, cameraRadius } = updateAtProgress(1)
    expect(cameraTarget.x).toBeCloseTo(expectedRotated.x * GLOBE_RADIUS, 10)
    expect(cameraTarget.y).toBeCloseTo(expectedRotated.y * GLOBE_RADIUS, 10)
    expect(cameraTarget.z).toBeCloseTo(expectedRotated.z * GLOBE_RADIUS, 10)

    // Sanity check: the fix must actually change behavior vs the unrotated
    // direction (otherwise this test would pass trivially / the bug would
    // still be latent).
    expect(cameraTarget.x).not.toBeCloseTo(rawDirection.x * GLOBE_RADIUS, 3)

    // Dive end: camera sits on Mumbai's rotated ray, OUTSIDE the globe, at the
    // documented distance (cameraRadius must match |cameraPosition|).
    const posLen = Math.hypot(cameraPosition.x, cameraPosition.y, cameraPosition.z)
    expect(posLen).toBeCloseTo(cameraRadius, 10)
    expect(cameraRadius).toBeGreaterThan(GLOBE_RADIUS)
    const dot =
      (cameraPosition.x * expectedRotated.x +
        cameraPosition.y * expectedRotated.y +
        cameraPosition.z * expectedRotated.z) /
      posLen
    expect(dot).toBeCloseTo(1, 6) // colinear with the rotated Mumbai direction
  })

  it('camera position starts on the +Z axis before the dive', () => {
    const { cameraPosition } = updateAtProgress(0.3)
    expect(cameraPosition.x).toBeCloseTo(0, 10)
    expect(cameraPosition.y).toBeCloseTo(0, 10)
    expect(cameraPosition.z).toBeCloseTo(6, 10)
  })
})

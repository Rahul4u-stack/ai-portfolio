import { NODES, DIVE_TARGET_NODE, ARCS, latLonToVec3, GLOBE_RADIUS } from './nodes'

export const PHASES = [
  { name: 'orbit', start: 0, end: 0.5 },
  { name: 'dive', start: 0.5, end: 0.85 },
  { name: 'bloomIn', start: 0.85, end: 0.95 },
  { name: 'bloomOut', start: 0.95, end: 1 },
]

const HERO_FADE_START = 0.35
const HERO_FADE_END = 0.55
const ORBIT_ROTATION_DEG = 108
const CAMERA_RADIUS_ORBIT = 6
// Dive ends with the camera 35% beyond the globe surface along Mumbai's ray
// (outside the sphere — flying through the point cloud reads as noise, not a dive).
const CAMERA_RADIUS_DIVE = GLOBE_RADIUS * 1.35
const BLOOM_SCALE_START = 1
const BLOOM_SCALE_END = 40

export function easeInOutSine(x) {
  return -(Math.cos(Math.PI * x) - 1) / 2
}

export function easeInCubic(x) {
  return x * x * x
}

export function easeInQuad(x) {
  return x * x
}

function clamp01(x) {
  return Math.min(1, Math.max(0, x))
}

function lerp(a, b, t) {
  return a + (b - a) * t
}

export function getPhase(t) {
  const clamped = clamp01(t)
  for (const phase of PHASES) {
    if (clamped < phase.end || phase.end === 1) {
      return phase.name
    }
  }
  return PHASES[PHASES.length - 1].name
}

const mumbaiNode = NODES.find((node) => node.name === DIVE_TARGET_NODE)
const mumbaiVec3 = latLonToVec3(mumbaiNode.lat, mumbaiNode.lon, 1)

// The globe (globeGroup in globeScene.js) rotates by ORBIT_ROTATION_DEG during
// the orbit phase (0-0.5) and is frozen at that angle for the remainder of the
// timeline (dive/bloomIn/bloomOut). The camera itself is NOT a child of that
// group, so its lookAt target must be pre-rotated by the same frozen angle to
// stay aligned with Mumbai's actual (rotated) world position during the dive -
// otherwise the camera converges on a stale, pre-rotation point in space and
// the bloom sprite (which lives inside the rotated group) ends up out of view.
const ORBIT_FINAL_ANGLE = ORBIT_ROTATION_DEG * (Math.PI / 180)
const COS_ORBIT_FINAL = Math.cos(ORBIT_FINAL_ANGLE)
const SIN_ORBIT_FINAL = Math.sin(ORBIT_FINAL_ANGLE)
const mumbaiVec3Rotated = {
  x: mumbaiVec3.x * COS_ORBIT_FINAL + mumbaiVec3.z * SIN_ORBIT_FINAL,
  y: mumbaiVec3.y,
  z: -mumbaiVec3.x * SIN_ORBIT_FINAL + mumbaiVec3.z * COS_ORBIT_FINAL,
}

export function updateAtProgress(t) {
  const clamped = clamp01(t)

  const orbitLocal = clamp01(clamped / PHASES[0].end)
  const globeRotationY = easeInOutSine(orbitLocal) * (ORBIT_ROTATION_DEG * (Math.PI / 180))

  const diveLocal = clamp01((clamped - PHASES[1].start) / (PHASES[1].end - PHASES[1].start))
  const diveEased = easeInCubic(diveLocal)
  const cameraRadius = lerp(CAMERA_RADIUS_ORBIT, CAMERA_RADIUS_DIVE, diveEased)
  // Target sits on the globe SURFACE (radius matters, not just direction): the
  // bloom sprite lives at GLOBE_RADIUS, and from a close camera the angular
  // error between lookAt(unit vector) and the surface point is large enough to
  // push the bloom out of frame.
  const cameraTarget = {
    x: lerp(0, mumbaiVec3Rotated.x * GLOBE_RADIUS, diveEased),
    y: lerp(0, mumbaiVec3Rotated.y * GLOBE_RADIUS, diveEased),
    z: lerp(0, mumbaiVec3Rotated.z * GLOBE_RADIUS, diveEased),
  }
  // Camera position sweeps from the +Z axis toward Mumbai's (rotated) ray while
  // the radius shrinks — direction and distance interpolated separately so
  // cameraRadius is monotonic by construction and the camera never enters the
  // globe.
  const dirX = lerp(0, mumbaiVec3Rotated.x, diveEased)
  const dirY = lerp(0, mumbaiVec3Rotated.y, diveEased)
  const dirZ = lerp(1, mumbaiVec3Rotated.z, diveEased)
  const dirLen = Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ) || 1
  const cameraPosition = {
    x: (dirX / dirLen) * cameraRadius,
    y: (dirY / dirLen) * cameraRadius,
    z: (dirZ / dirLen) * cameraRadius,
  }

  const pulsePhases = ARCS.map((_, i) => (clamped * 6 + i * 0.37) % 1)

  const bloomInLocal = clamp01((clamped - PHASES[2].start) / (PHASES[2].end - PHASES[2].start))
  const bloomOutLocal = clamp01((clamped - PHASES[3].start) / (PHASES[3].end - PHASES[3].start))
  let bloomOpacity
  let bloomScale
  if (clamped < PHASES[2].start) {
    bloomOpacity = 0
    bloomScale = BLOOM_SCALE_START
  } else if (clamped < PHASES[3].start) {
    bloomOpacity = easeInQuad(bloomInLocal)
    bloomScale = lerp(BLOOM_SCALE_START, BLOOM_SCALE_END, easeInQuad(bloomInLocal))
  } else {
    bloomOpacity = 1 - bloomOutLocal
    bloomScale = BLOOM_SCALE_END
  }

  const heroLocal = clamp01((clamped - HERO_FADE_START) / (HERO_FADE_END - HERO_FADE_START))
  let heroOverlayOpacity
  let heroOverlayTranslateY
  if (clamped <= HERO_FADE_START) {
    heroOverlayOpacity = 1
    heroOverlayTranslateY = 0
  } else if (clamped >= HERO_FADE_END) {
    heroOverlayOpacity = 0
    heroOverlayTranslateY = -40
  } else {
    const eased = easeInCubic(heroLocal)
    heroOverlayOpacity = 1 - eased
    heroOverlayTranslateY = -40 * eased
  }

  return {
    globeRotationY,
    cameraRadius,
    cameraPosition,
    cameraTarget,
    pulsePhases,
    bloomOpacity,
    bloomScale,
    heroOverlayOpacity,
    heroOverlayTranslateY,
  }
}

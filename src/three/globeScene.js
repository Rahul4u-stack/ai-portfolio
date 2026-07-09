import * as THREE from 'three'
import { ARCS, DIVE_TARGET_NODE, getNodeByName, latLonToVec3, GLOBE_RADIUS } from './nodes'
import { updateAtProgress } from './timeline'
// Precomputed at build time from Natural Earth land polygons (public domain)
// by scripts/generate-land-points.mjs — dots sit on landmasses only, so the
// sphere reads as Earth and the Mumbai dive visibly lands on India.
import landPoints from './landPoints.json'

const ATMOSPHERE_RADIUS = 2.65
const OCEAN_POINT_COUNT = 900
const BRAND_COLORS = [0x6366f1, 0xec4899, 0x38bdf8]

function createPulseTexture() {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, 'rgba(255,255,255,1)')
  gradient.addColorStop(0.4, 'rgba(255,255,255,0.6)')
  gradient.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  return new THREE.CanvasTexture(canvas)
}

// Continents: one dot per precomputed land coordinate, brand-tinted.
function buildLandPoints() {
  const count = landPoints.length
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const color = new THREE.Color()

  for (let i = 0; i < count; i += 1) {
    const [lat, lon] = landPoints[i]
    const p = latLonToVec3(lat, lon, GLOBE_RADIUS)
    positions[i * 3] = p.x
    positions[i * 3 + 1] = p.y
    positions[i * 3 + 2] = p.z

    color.set(BRAND_COLORS[i % 3])
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 0.035,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })

  return new THREE.Points(geometry, material)
}

// Oceans: a sparse, very dim full-sphere layer so the planet keeps its
// silhouette where there is no land facing the camera.
function buildOceanPoints() {
  const positions = new Float32Array(OCEAN_POINT_COUNT * 3)
  const goldenAngle = Math.PI * (3 - Math.sqrt(5))

  for (let i = 0; i < OCEAN_POINT_COUNT; i += 1) {
    const y = 1 - (i / (OCEAN_POINT_COUNT - 1)) * 2
    const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y))
    const theta = goldenAngle * i
    positions[i * 3] = Math.cos(theta) * radiusAtY * GLOBE_RADIUS
    positions[i * 3 + 1] = y * GLOBE_RADIUS
    positions[i * 3 + 2] = Math.sin(theta) * radiusAtY * GLOBE_RADIUS
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  const material = new THREE.PointsMaterial({
    size: 0.02,
    color: 0x6366f1,
    transparent: true,
    opacity: 0.18,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })

  return new THREE.Points(geometry, material)
}

function buildAtmosphere() {
  const geometry = new THREE.SphereGeometry(ATMOSPHERE_RADIUS, 32, 32)
  const material = new THREE.MeshBasicMaterial({
    color: 0x6366f1,
    transparent: true,
    opacity: 0.06,
    side: THREE.BackSide,
    depthWrite: false,
  })
  return new THREE.Mesh(geometry, material)
}

function buildArcCurve(fromName, toName) {
  const from = getNodeByName(fromName)
  const to = getNodeByName(toName)
  const start = latLonToVec3(from.lat, from.lon, GLOBE_RADIUS)
  const end = latLonToVec3(to.lat, to.lon, GLOBE_RADIUS)
  const startVec = new THREE.Vector3(start.x, start.y, start.z)
  const endVec = new THREE.Vector3(end.x, end.y, end.z)
  const mid = startVec.clone().add(endVec).multiplyScalar(0.5)
  mid.normalize().multiplyScalar(GLOBE_RADIUS * 1.4)
  return new THREE.QuadraticBezierCurve3(startVec, mid, endVec)
}

export function buildScene(canvas) {
  const scene = new THREE.Scene()
  const width = canvas.clientWidth || 1
  const height = canvas.clientHeight || 1
  const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100)
  camera.position.set(0, 0, 6)

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
  renderer.setClearColor(0x0a0a0f, 1)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))

  const globeGroup = new THREE.Group()
  const landDots = buildLandPoints()
  const oceanDots = buildOceanPoints()
  const atmosphere = buildAtmosphere()
  globeGroup.add(landDots, oceanDots, atmosphere)

  const pulseTexture = createPulseTexture()

  const arcCurves = ARCS.map(([from, to]) => buildArcCurve(from, to))
  const arcLines = arcCurves.map((curve, i) => {
    const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(64))
    const material = new THREE.LineBasicMaterial({
      color: new THREE.Color(BRAND_COLORS[i % 3]),
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const line = new THREE.Line(geometry, material)
    globeGroup.add(line)
    return line
  })

  const pulseSprites = arcCurves.map((_, i) => {
    const material = new THREE.SpriteMaterial({
      map: pulseTexture,
      color: new THREE.Color(BRAND_COLORS[i % 3]),
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
    })
    const sprite = new THREE.Sprite(material)
    sprite.scale.set(0.15, 0.15, 1)
    sprite.renderOrder = 5
    globeGroup.add(sprite)
    return sprite
  })

  const mumbai = getNodeByName(DIVE_TARGET_NODE)
  const mumbaiPos = latLonToVec3(mumbai.lat, mumbai.lon, GLOBE_RADIUS)
  const bloomMaterial = new THREE.SpriteMaterial({
    map: pulseTexture,
    color: new THREE.Color(0x818cf8),
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0,
    depthWrite: false,
  })
  const bloomSprite = new THREE.Sprite(bloomMaterial)
  bloomSprite.position.set(mumbaiPos.x, mumbaiPos.y, mumbaiPos.z)
  bloomSprite.scale.set(0.1, 0.1, 1)
  bloomSprite.renderOrder = 10
  globeGroup.add(bloomSprite)

  scene.add(globeGroup)

  function resize() {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    if (w === 0 || h === 0) return
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h, false)
  }
  resize()

  function render(t) {
    const state = updateAtProgress(t)

    globeGroup.rotation.y = state.globeRotationY

    camera.position.set(state.cameraPosition.x, state.cameraPosition.y, state.cameraPosition.z)
    camera.lookAt(state.cameraTarget.x, state.cameraTarget.y, state.cameraTarget.z)

    state.pulsePhases.forEach((phase, i) => {
      const point = arcCurves[i].getPointAt(phase)
      pulseSprites[i].position.copy(point)
    })

    const bloomScaleValue = 0.1 * state.bloomScale
    bloomSprite.scale.set(bloomScaleValue, bloomScaleValue, 1)
    bloomMaterial.opacity = state.bloomOpacity

    renderer.render(scene, camera)
  }

  function dispose() {
    landDots.geometry.dispose()
    landDots.material.dispose()
    oceanDots.geometry.dispose()
    oceanDots.material.dispose()
    atmosphere.geometry.dispose()
    atmosphere.material.dispose()
    arcLines.forEach((line) => {
      line.geometry.dispose()
      line.material.dispose()
    })
    pulseSprites.forEach((sprite) => sprite.material.dispose())
    bloomMaterial.dispose()
    pulseTexture.dispose()
    renderer.dispose()
  }

  return { render, resize, dispose }
}

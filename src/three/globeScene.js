import * as THREE from 'three'
import { ARCS, NODES, DIVE_TARGET_NODE, getNodeByName, latLonToVec3, GLOBE_RADIUS } from './nodes'
import { updateAtProgress } from './timeline'
// Natural Earth land polygons (public domain, via world-atlas) are drawn onto
// an offscreen equirectangular canvas at scene build and wrapped on the sphere
// as a texture — real continent shapes, and the Mumbai dive visibly lands on
// India. Bundled into this lazy chunk at build time; nothing is fetched.
import { feature } from 'topojson-client'
import landTopo from 'world-atlas/land-110m.json'

const ATMOSPHERE_RADIUS = 2.65
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

// Draw the Natural Earth land polygons onto an equirectangular canvas.
// x = (lon+180)/360, y = (90-lat)/180 — matches both latLonToVec3 and
// three.js SphereGeometry UVs (CanvasTexture flipY puts canvas-top at the
// north pole), so continents align with the arc/node coordinates exactly.
function createEarthTexture() {
  const W = 2048
  const H = 1024
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')

  // Ocean: near-black with a whisper of violet depth toward the equator
  const ocean = ctx.createLinearGradient(0, 0, 0, H)
  ocean.addColorStop(0, '#0b0b13')
  ocean.addColorStop(0.5, '#100f1c')
  ocean.addColorStop(1, '#0b0b13')
  ctx.fillStyle = ocean
  ctx.fillRect(0, 0, W, H)

  // Graticule: faint cartographic lat/lon grid every 15 degrees
  ctx.strokeStyle = 'rgba(255,255,255,0.035)'
  ctx.lineWidth = 1
  for (let lon = -180; lon <= 180; lon += 15) {
    const x = ((lon + 180) / 360) * W
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, H)
    ctx.stroke()
  }
  for (let lat = -75; lat <= 75; lat += 15) {
    const y = ((90 - lat) / 180) * H
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(W, y)
    ctx.stroke()
  }

  const land = feature(landTopo, landTopo.objects.land)
  const geometries = land.features ? land.features.map((f) => f.geometry) : [land.geometry]
  const polygons = geometries.flatMap((g) =>
    g.type === 'MultiPolygon' ? g.coordinates : [g.coordinates]
  )

  // Land fill: the site's brand gradient wrapped around the globe, desaturated
  // and darkened so it reads as tint, not paint
  const landFill = ctx.createLinearGradient(0, 0, W, 0)
  landFill.addColorStop(0, '#232043')   // indigo-tinted (Americas)
  landFill.addColorStop(0.42, '#2c1e38') // pink-tinted (Europe/Africa)
  landFill.addColorStop(0.78, '#1d2740') // sky-tinted (Asia)
  landFill.addColorStop(1, '#232043')
  // Coastlines: same gradient, luminous
  const coast = ctx.createLinearGradient(0, 0, W, 0)
  coast.addColorStop(0, 'rgba(129,140,248,0.75)')  // indigo-400
  coast.addColorStop(0.42, 'rgba(244,114,182,0.65)') // pink-400
  coast.addColorStop(0.78, 'rgba(56,189,248,0.7)')  // sky-400
  coast.addColorStop(1, 'rgba(129,140,248,0.75)')

  ctx.fillStyle = landFill
  ctx.strokeStyle = coast
  ctx.lineWidth = 1.8
  ctx.shadowColor = 'rgba(129,140,248,0.35)'
  ctx.shadowBlur = 6
  for (const poly of polygons) {
    ctx.beginPath()
    for (const ring of poly) {
      ring.forEach(([lon, lat], i) => {
        const x = ((lon + 180) / 360) * W
        const y = ((90 - lat) / 180) * H
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      })
      ctx.closePath()
    }
    ctx.fill('evenodd')
    ctx.stroke()
  }
  ctx.shadowBlur = 0

  const texture = new THREE.CanvasTexture(canvas)
  // Canvas pixels are sRGB; without declaring it, three treats them as linear
  // and the dark land tones render several stops too bright.
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

function buildEarthSphere() {
  const geometry = new THREE.SphereGeometry(GLOBE_RADIUS, 96, 96)
  const material = new THREE.MeshBasicMaterial({ map: createEarthTexture() })
  return new THREE.Mesh(geometry, material)
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
  const earth = buildEarthSphere()
  const atmosphere = buildAtmosphere()
  globeGroup.add(earth, atmosphere)

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

  // Hub city markers: a small glow anchored at every payment-hub node
  const hubSprites = NODES.map((node, i) => {
    const pos = latLonToVec3(node.lat, node.lon, GLOBE_RADIUS * 1.002)
    const material = new THREE.SpriteMaterial({
      map: pulseTexture,
      color: new THREE.Color(BRAND_COLORS[i % 3]),
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
    })
    const sprite = new THREE.Sprite(material)
    sprite.position.set(pos.x, pos.y, pos.z)
    sprite.scale.set(0.09, 0.09, 1)
    sprite.renderOrder = 4
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

  // Halo: soft backlight behind the sphere for depth (does not rotate)
  const haloMaterial = new THREE.SpriteMaterial({
    map: pulseTexture,
    color: new THREE.Color(0x4f46e5),
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.16,
    depthWrite: false,
  })
  const halo = new THREE.Sprite(haloMaterial)
  halo.position.set(0, 0, -0.4)
  halo.scale.set(GLOBE_RADIUS * 3.4, GLOBE_RADIUS * 3.4, 1)
  halo.renderOrder = -1
  scene.add(halo)

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
    hubSprites.forEach((sprite) => sprite.material.dispose())
    haloMaterial.dispose()
    earth.geometry.dispose()
    earth.material.map.dispose()
    earth.material.dispose()
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

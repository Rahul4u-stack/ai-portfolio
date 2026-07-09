// Build-time generator: samples a Fibonacci sphere against Natural Earth land
// polygons (world-atlas, public domain) and writes the land-only points to
// src/three/landPoints.json. Run: node scripts/generate-land-points.mjs
// Regenerate only if you change CANDIDATES or want a different density.
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import * as topojson from 'topojson-client'

const __dirname = dirname(fileURLToPath(import.meta.url))
const topoPath = join(__dirname, '../node_modules/world-atlas/land-110m.json')
const outPath = join(__dirname, '../src/three/landPoints.json')

const topo = JSON.parse(readFileSync(topoPath, 'utf8'))
const land = topojson.feature(topo, topo.objects.land)
// Normalize Feature vs FeatureCollection to a flat list of Polygon coordinate arrays
const geometries = land.features ? land.features.map((f) => f.geometry) : [land.geometry]
const polygons = geometries.flatMap((g) =>
  g.type === 'MultiPolygon' ? g.coordinates : [g.coordinates]
)

// Even-odd ray casting in lon/lat space. Fine at this density; the 110m
// dataset has no polygons crossing the antimeridian in a way that matters
// for dot sampling.
function pointInRing(lon, lat, ring) {
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i]
    const [xj, yj] = ring[j]
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
      inside = !inside
    }
  }
  return inside
}

function isLand(lon, lat) {
  for (const poly of polygons) {
    if (pointInRing(lon, lat, poly[0])) {
      // inside outer ring — check holes
      let inHole = false
      for (let h = 1; h < poly.length; h++) {
        if (pointInRing(lon, lat, poly[h])) {
          inHole = true
          break
        }
      }
      if (!inHole) return true
    }
  }
  return false
}

// Fibonacci sphere candidates → lat/lon
const CANDIDATES = 16000
const GOLDEN = Math.PI * (3 - Math.sqrt(5))
const points = []
for (let i = 0; i < CANDIDATES; i++) {
  const y = 1 - (i / (CANDIDATES - 1)) * 2
  const lat = (Math.asin(y) * 180) / Math.PI
  const theta = GOLDEN * i
  let lon = ((theta * 180) / Math.PI) % 360
  if (lon > 180) lon -= 360
  if (lon < -180) lon += 360
  if (isLand(lon, lat)) {
    points.push([Math.round(lat * 10) / 10, Math.round(lon * 10) / 10])
  }
}

writeFileSync(outPath, JSON.stringify(points))
console.log(`Wrote ${points.length} land points to ${outPath}`)

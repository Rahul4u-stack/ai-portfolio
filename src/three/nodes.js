export const GLOBE_RADIUS = 2.5

export const NODES = [
  { name: 'Mumbai', lat: 19.076, lon: 72.877 },
  { name: 'Dubai', lat: 25.204, lon: 55.271 },
  { name: 'London', lat: 51.507, lon: -0.128 },
  { name: 'Frankfurt', lat: 50.110, lon: 8.682 },
  { name: 'Singapore', lat: 1.352, lon: 103.820 },
  { name: 'Bengaluru', lat: 12.972, lon: 77.594 },
  { name: 'New York', lat: 40.713, lon: -74.006 },
  { name: 'Nairobi', lat: -1.292, lon: 36.822 },
]

export const DIVE_TARGET_NODE = 'Mumbai'

export const ARCS = [
  ['Mumbai', 'Dubai'],
  ['Mumbai', 'Singapore'],
  ['Mumbai', 'London'],
  ['Mumbai', 'Bengaluru'],
  ['Dubai', 'London'],
  ['Dubai', 'Frankfurt'],
  ['Dubai', 'Nairobi'],
  ['London', 'Frankfurt'],
  ['Singapore', 'New York'],
  ['Frankfurt', 'New York'],
]

export function latLonToVec3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)
  return {
    x: -radius * Math.sin(phi) * Math.cos(theta),
    y: radius * Math.cos(phi),
    z: radius * Math.sin(phi) * Math.sin(theta),
  }
}

export function getNodeByName(name) {
  return NODES.find((node) => node.name === name)
}

import { NODES, ARCS, latLonToVec3, getNodeByName } from '../three/nodes'

describe('nodes', () => {
  it('maps a known lat/lon to the expected vector', () => {
    const vec = latLonToVec3(0, 0, 1)
    expect(vec.x).toBeCloseTo(1, 5)
    expect(vec.y).toBeCloseTo(0, 5)
    expect(vec.z).toBeCloseTo(0, 5)
  })

  it('defines exactly 8 nodes including the Mumbai dive target', () => {
    expect(NODES).toHaveLength(8)
    expect(getNodeByName('Mumbai')).toBeDefined()
  })

  it('defines exactly 10 arcs that reference valid nodes only', () => {
    expect(ARCS).toHaveLength(10)
    const names = new Set(NODES.map((node) => node.name))
    ARCS.forEach(([from, to]) => {
      expect(names.has(from)).toBe(true)
      expect(names.has(to)).toBe(true)
    })
  })
})

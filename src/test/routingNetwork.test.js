import { describe, expect, it } from 'vitest'
import {
  EXTRACT_INDEX,
  FAIL_EVERY,
  LAST_INDEX,
  REROUTE_NODE,
  STAGES,
  VALIDATE_INDEX,
  createPacket,
  createSimulation,
  edges,
  packetSegment,
  staticSnapshot,
  stepPacket,
  stepSimulation,
} from '../lib/routingNetwork'

/** Drive a packet forward in small steps until `predicate` holds, or give up. */
function advanceUntil(packet, predicate, { dt = 0.05, maxSteps = 2000 } = {}) {
  let current = packet
  for (let i = 0; i < maxSteps; i += 1) {
    if (predicate(current)) return current
    current = stepPacket(current, dt)
  }
  return null
}

describe('routing network — pipeline shape', () => {
  it('models the five named stages in order', () => {
    expect(STAGES.map((s) => s.label)).toEqual([
      'Documentation',
      'Extraction',
      'Validation',
      'Integration',
      'Shipped',
    ])
  })

  it('connects the stages as a trunk plus a two-leg reroute detour', () => {
    const all = edges()
    const trunk = all.filter((e) => e.kind === 'trunk')
    const reroute = all.filter((e) => e.kind === 'reroute')

    expect(trunk).toHaveLength(STAGES.length - 1)
    expect(reroute).toEqual([
      { from: 'validate', to: REROUTE_NODE.id, kind: 'reroute' },
      { from: REROUTE_NODE.id, to: 'extract', kind: 'reroute' },
    ])
  })
})

describe('routing network — packet lifecycle', () => {
  it('marks every FAIL_EVERY-th packet as one that will fail validation', () => {
    const flags = Array.from({ length: 8 }, (_, i) => createPacket(i).willFail)
    expect(flags.filter(Boolean)).toHaveLength(8 / FAIL_EVERY)
    expect(createPacket(FAIL_EVERY - 1).willFail).toBe(true)
    expect(createPacket(0).willFail).toBe(false)
  })

  it('walks a healthy packet all the way to shipped', () => {
    const done = advanceUntil(createPacket(0), (p) => p.state === 'done')
    expect(done).not.toBeNull()
    expect(done.stage).toBe(LAST_INDEX)
  })

  it('reroutes a failing packet instead of dropping it, and ships it on the second pass', () => {
    const failing = createPacket(FAIL_EVERY - 1)
    expect(failing.willFail).toBe(true)

    const rerouting = advanceUntil(failing, (p) => p.state === 'rerouting')
    expect(rerouting).not.toBeNull()
    expect(rerouting.stage).toBe(VALIDATE_INDEX)

    // Comes out of the detour back at Extraction, now clean.
    const rejoined = advanceUntil(rerouting, (p) => p.state === 'travelling')
    expect(rejoined.stage).toBe(EXTRACT_INDEX)
    expect(rejoined.willFail).toBe(false)
    expect(rejoined.rerouted).toBe(true)

    // And it still reaches Shipped — nothing is ever lost.
    const shipped = advanceUntil(rejoined, (p) => p.state === 'done')
    expect(shipped).not.toBeNull()
    expect(shipped.stage).toBe(LAST_INDEX)
  })

  it('never reroutes the same packet twice', () => {
    let packet = createPacket(FAIL_EVERY - 1)
    let reroutes = 0
    let previousState = packet.state
    for (let i = 0; i < 2000 && packet.state !== 'done'; i += 1) {
      packet = stepPacket(packet, 0.05)
      if (packet.state === 'rerouting' && previousState !== 'rerouting') reroutes += 1
      previousState = packet.state
    }
    expect(reroutes).toBe(1)
  })

  it('reports the reroute detour as two legs via the detour node', () => {
    const rerouting = advanceUntil(createPacket(FAIL_EVERY - 1), (p) => p.state === 'rerouting')
    const firstLeg = packetSegment({ ...rerouting, t: 0.2 })
    const secondLeg = packetSegment({ ...rerouting, t: 0.8 })

    expect(firstLeg).toMatchObject({ from: 'validate', to: REROUTE_NODE.id, failing: true })
    expect(secondLeg).toMatchObject({ from: REROUTE_NODE.id, to: 'extract', failing: true })
  })

  it('flags a doomed packet on its approach so the renderer can warn before the gate', () => {
    const approaching = { ...createPacket(FAIL_EVERY - 1), stage: EXTRACT_INDEX, t: 0.5 }
    expect(packetSegment(approaching).warning).toBe(true)

    const healthy = { ...createPacket(0), stage: EXTRACT_INDEX, t: 0.5 }
    expect(packetSegment(healthy).warning).toBe(false)
  })
})

describe('routing network — simulation', () => {
  it('spawns, retires and counts shipped packets over time', () => {
    let sim = createSimulation()
    for (let i = 0; i < 600; i += 1) sim = stepSimulation(sim, 0.05)

    expect(sim.shipped).toBeGreaterThan(0)
    expect(sim.rerouted).toBeGreaterThan(0)
    expect(sim.packets.length).toBeGreaterThan(0)
  })

  it('caps the packet population so the array cannot grow without bound', () => {
    let sim = createSimulation()
    for (let i = 0; i < 5000; i += 1) sim = stepSimulation(sim, 0.05)
    expect(sim.packets.length).toBeLessThanOrEqual(9)
  })

  it('clamps a huge dt — a backgrounded tab resuming must not skip the whole pipeline', () => {
    const sim = createSimulation()
    // 60 seconds in one frame: with clamping, at most one 0.05s step is integrated.
    const jumped = stepSimulation(sim, 60)
    const stepped = stepSimulation(sim, 0.05)
    expect(jumped.packets[0].t).toBeCloseTo(stepped.packets[0].t, 6)
  })

  it('ignores a negative dt rather than running the simulation backwards', () => {
    const sim = createSimulation()
    const back = stepSimulation(sim, -5)
    expect(back.packets[0].t).toBe(sim.packets[0].t)
  })
})

describe('routing network — still frame', () => {
  it('shows a populated pipeline including one packet mid-reroute, so the static version tells the same story', () => {
    const snapshot = staticSnapshot()
    expect(snapshot.length).toBeGreaterThanOrEqual(3)
    expect(snapshot.some((p) => p.state === 'rerouting')).toBe(true)
    expect(snapshot.some((p) => p.rerouted)).toBe(true)
  })

  it('resolves every still-frame packet to a drawable segment between two known nodes', () => {
    const known = new Set([...STAGES.map((s) => s.id), REROUTE_NODE.id])
    for (const packet of staticSnapshot()) {
      const seg = packetSegment(packet)
      expect(known.has(seg.from)).toBe(true)
      expect(known.has(seg.to)).toBe(true)
      expect(seg.t).toBeGreaterThanOrEqual(0)
      expect(seg.t).toBeLessThanOrEqual(1)
    }
  })
})

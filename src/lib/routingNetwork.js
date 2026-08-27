/**
 * The Payment Intelligence Network — pure model.
 *
 * No SVG, no DOM, no React. Everything here is a pure function over plain data so the behaviour
 * that carries the story (packets advance; roughly one in four fails validation and is *rerouted*
 * rather than dropped) is unit-testable without a renderer.
 *
 * The model owns topology and timing only. Geometry lives in the renderer's layout, so the same
 * simulation drives both the wide horizontal layout and the narrow vertical one.
 */

export const STAGES = [
  { id: 'docs', label: 'Documentation', short: 'Docs' },
  { id: 'extract', label: 'Extraction', short: 'Extract' },
  { id: 'validate', label: 'Validation', short: 'Validate' },
  { id: 'integrate', label: 'Integration', short: 'Integrate' },
  { id: 'shipped', label: 'Shipped', short: 'Shipped' },
]

export const REROUTE_NODE = { id: 'reroute', label: 'Reroute', short: 'Reroute' }

export const VALIDATE_INDEX = 2
export const EXTRACT_INDEX = 1
export const LAST_INDEX = STAGES.length - 1

/** Every 4th packet fails validation — often enough to be noticed, rare enough to stay a signal. */
export const FAIL_EVERY = 4

const SEGMENT_SECONDS = 0.9
const REROUTE_SECONDS = 1.2
const SPAWN_SECONDS = 1.05
const MAX_PACKETS = 9
/** A hidden tab hands back a huge dt on resume; never integrate more than one frame's worth. */
const MAX_STEP = 0.05

export function createPacket(index) {
  return {
    index,
    willFail: index % FAIL_EVERY === FAIL_EVERY - 1,
    rerouted: false,
    /** Index of the stage this packet is travelling *from*. */
    stage: 0,
    /** 0..1 progress along the current edge. */
    t: 0,
    /** travelling | rerouting | done */
    state: 'travelling',
  }
}

/**
 * Advance one packet by `dt` seconds. Pure — returns a new object.
 *
 * A failing packet arriving at Validation enters `rerouting`: up over the detour node and back
 * into Extraction, with `willFail` cleared so it succeeds on the second pass. Nothing is ever
 * dropped — that is the argument for human validation gates, told as motion.
 */
export function stepPacket(packet, dt) {
  if (packet.state === 'done') return packet

  if (packet.state === 'rerouting') {
    const t = packet.t + dt / REROUTE_SECONDS
    if (t < 1) return { ...packet, t }
    return {
      ...packet,
      state: 'travelling',
      stage: EXTRACT_INDEX,
      t: 0,
      willFail: false,
      rerouted: true,
    }
  }

  const t = packet.t + dt / SEGMENT_SECONDS
  if (t < 1) return { ...packet, t }

  const nextStage = packet.stage + 1

  if (nextStage >= LAST_INDEX) {
    return { ...packet, stage: LAST_INDEX, t: 0, state: 'done' }
  }

  if (nextStage === VALIDATE_INDEX && packet.willFail) {
    return { ...packet, stage: VALIDATE_INDEX, t: 0, state: 'rerouting' }
  }

  return { ...packet, stage: nextStage, t: 0 }
}

/**
 * Where a packet sits, symbolically: which two nodes it is between and how far along.
 * The renderer turns this into coordinates using its own layout.
 */
export function packetSegment(packet) {
  if (packet.state === 'rerouting') {
    // Two legs: Validation → detour, then detour → Extraction.
    return packet.t < 0.5
      ? { from: STAGES[VALIDATE_INDEX].id, to: REROUTE_NODE.id, t: packet.t / 0.5, failing: true }
      : {
          from: REROUTE_NODE.id,
          to: STAGES[EXTRACT_INDEX].id,
          t: (packet.t - 0.5) / 0.5,
          failing: true,
        }
  }

  const fromIndex = Math.min(packet.stage, LAST_INDEX)
  const toIndex = Math.min(packet.stage + 1, LAST_INDEX)
  return {
    from: STAGES[fromIndex].id,
    to: STAGES[toIndex].id,
    t: packet.state === 'done' ? 1 : packet.t,
    failing: false,
    // Flag the packet that is *about* to be rejected, so the renderer can warm it to coral
    // on the approach rather than switching colour instantly at the node.
    warning: packet.willFail && toIndex === VALIDATE_INDEX,
  }
}

/** Trunk edges plus the reroute detour, as node-id pairs for the renderer to draw once. */
export function edges() {
  const trunk = STAGES.slice(0, -1).map((stage, i) => ({
    from: stage.id,
    to: STAGES[i + 1].id,
    kind: 'trunk',
  }))
  return [
    ...trunk,
    { from: STAGES[VALIDATE_INDEX].id, to: REROUTE_NODE.id, kind: 'reroute' },
    { from: REROUTE_NODE.id, to: STAGES[EXTRACT_INDEX].id, kind: 'reroute' },
  ]
}

export function createSimulation() {
  return { packets: [createPacket(0)], nextIndex: 1, sinceSpawn: 0, shipped: 0, rerouted: 0 }
}

/** Advance the whole simulation: step, retire finished packets, spawn on a fixed interval. */
export function stepSimulation(sim, dt) {
  const step = Math.min(Math.max(dt, 0), MAX_STEP)

  let { shipped, rerouted, nextIndex } = sim
  const packets = []

  for (const packet of sim.packets) {
    const next = stepPacket(packet, step)
    if (next.state === 'done') {
      if (packet.state !== 'done') shipped += 1
      continue
    }
    if (next.rerouted && !packet.rerouted) rerouted += 1
    packets.push(next)
  }

  let sinceSpawn = sim.sinceSpawn + step
  if (sinceSpawn >= SPAWN_SECONDS && packets.length < MAX_PACKETS) {
    packets.push(createPacket(nextIndex))
    nextIndex += 1
    sinceSpawn = 0
  }

  return { packets, nextIndex, sinceSpawn, shipped, rerouted }
}

/**
 * A deterministic, mid-flight snapshot used for the still frame: reduced motion, no-JS,
 * low-power devices. Shows the pipeline populated *and* one packet caught mid-reroute, so the
 * static version tells the same story as the animated one.
 */
export function staticSnapshot() {
  return [
    { index: 0, stage: 0, t: 0.55, state: 'travelling', willFail: false, rerouted: false },
    { index: 1, stage: 1, t: 0.4, state: 'travelling', willFail: false, rerouted: false },
    {
      index: 2,
      stage: VALIDATE_INDEX,
      t: 0.34,
      state: 'rerouting',
      willFail: true,
      rerouted: false,
    },
    { index: 3, stage: 3, t: 0.62, state: 'travelling', willFail: false, rerouted: true },
  ]
}

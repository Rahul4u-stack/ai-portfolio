import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  REROUTE_NODE,
  STAGES,
  createSimulation,
  edges,
  packetSegment,
  staticSnapshot,
  stepSimulation,
} from '../../lib/routingNetwork'
import useReducedMotion from '../../hooks/useReducedMotion'

/**
 * The signature visual: a payment integration travelling
 * Documentation → Extraction → Validation → Integration → Shipped,
 * with roughly one in four packets failing validation and being rerouted rather than dropped.
 *
 * Implementation notes
 * --------------------
 * SVG, not canvas and not WebGL. Five nodes and ~9 dots do not materially benefit from a GPU
 * renderer, and SVG buys three things that matter more: node labels are real selectable text,
 * the still frame is the identical markup with the animation loop simply never started (so the
 * reduced-motion version cannot drift from the animated one), and it is resolution-independent
 * with no devicePixelRatio handling.
 *
 * Two layouts share one simulation: horizontal on wide containers, vertical below WIDE_MIN_WIDTH,
 * because five stage labels cannot be legible across a 320px viewport.
 *
 * The loop is paused when the tab is hidden and when the figure is scrolled out of view. A paused
 * diagram shows the still frame, never an empty pipeline.
 *
 * The moving packets are written imperatively (setAttribute) into a memoised, render-once pool.
 * That separation is load-bearing: if React owned the `transform` attribute, every re-render —
 * the shipped counter ticking, a pointer moving — would snap every packet back to its initial
 * position mid-flight.
 */

/**
 * The viewBox width is deliberately close to the real rendered width of the hero's right column
 * (~560px at 1440), so mono labels land at roughly their nominal size instead of being scaled down
 * into illegibility.
 */
const WIDE = {
  id: 'wide',
  viewBox: '0 0 560 224',
  nodeR: 6.5,
  labelSize: 12,
  points: {
    docs: { x: 40, y: 140 },
    extract: { x: 160, y: 140 },
    validate: { x: 280, y: 140 },
    integrate: { x: 400, y: 140 },
    shipped: { x: 520, y: 140 },
    reroute: { x: 220, y: 54 },
  },
  labelDy: 30,
  rerouteLabelDy: -16,
}

const TALL = {
  id: 'tall',
  viewBox: '0 0 260 340',
  nodeR: 6,
  labelSize: 12,
  points: {
    docs: { x: 48, y: 26 },
    extract: { x: 48, y: 100 },
    validate: { x: 48, y: 174 },
    integrate: { x: 48, y: 248 },
    shipped: { x: 48, y: 314 },
    reroute: { x: 148, y: 137 },
  },
  labelDx: 18,
  rerouteLabelDx: 12,
}

/** Below this container width, five labels cannot sit side by side legibly. */
const WIDE_MIN_WIDTH = 420

/** Circles are pooled and reused by `packet.index % POOL_SIZE`, so the DOM never churns. */
const POOL_SIZE = 12

const TONE = {
  trunk: 'rgba(91,91,240,0.42)',
  trunkLive: '#5b5bf0',
  reroute: 'rgba(255,138,115,0.42)',
  node: '#0b0d12',
  nodeRing: 'rgba(165,166,255,0.65)',
  nodeRingShipped: 'rgba(78,214,155,0.85)',
  packet: '#56dce4',
  packetFailing: '#ff8a73',
  label: '#949aaa',
  labelStrong: '#c6cad6',
}

function useLayout(containerRef) {
  const [layout, setLayout] = useState(WIDE)

  useEffect(() => {
    const node = containerRef.current
    if (!node || typeof ResizeObserver === 'undefined') return undefined

    const apply = (width) => setLayout(width >= WIDE_MIN_WIDTH ? WIDE : TALL)
    apply(node.getBoundingClientRect().width)

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) apply(entry.contentRect.width)
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [containerRef])

  return layout
}

/** True when the browser signals a constrained device — cheap proxy for "don't animate". */
function isLowPowerDevice() {
  if (typeof navigator === 'undefined') return false
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
  if (connection?.saveData) return true
  if (typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency > 0) {
    return navigator.hardwareConcurrency <= 2
  }
  return false
}

function interpolate(layout, fromId, toId, t) {
  const from = layout.points[fromId]
  const to = layout.points[toId]
  return { x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t }
}

/**
 * Render-once pool of packet circles.
 *
 * Memoised with a stable `register` callback so React commits this subtree exactly once and then
 * never touches it again. The animation loop owns these attributes outright.
 */
const PacketPool = memo(function PacketPool({ register }) {
  return (
    <g>
      {Array.from({ length: POOL_SIZE }, (_, slot) => (
        <circle
          key={slot}
          ref={(el) => register(slot, el)}
          r="3.5"
          fill={TONE.packet}
          opacity="0"
        />
      ))}
    </g>
  )
})

export default function RoutingNetwork() {
  const containerRef = useRef(null)
  const layout = useLayout(containerRef)
  const prefersReducedMotion = useReducedMotion()

  // Decided once per mount from client-only signals — no effect, no cascading render.
  const [lowPower] = useState(() => isLowPowerDevice())
  const [shipped, setShipped] = useState(0)
  const [pointer, setPointer] = useState(null)

  const packetRefs = useRef(new Map())
  const shippedRef = useRef(0)
  const stillGroupRef = useRef(null)

  const register = useCallback((slot, el) => {
    if (el) packetRefs.current.set(slot, el)
    else packetRefs.current.delete(slot)
  }, [])

  const staticPackets = useMemo(() => staticSnapshot(), [])
  const allEdges = useMemo(() => edges(), [])

  const animated = !prefersReducedMotion && !lowPower

  useEffect(() => {
    if (!animated) return undefined

    let sim = createSimulation()
    let frame = null
    let last = performance.now()
    let hidden = document.hidden
    let offscreen = false

    const onVisibility = () => {
      hidden = document.hidden
      last = performance.now()
    }
    document.addEventListener('visibilitychange', onVisibility)

    let observer = null
    if (typeof IntersectionObserver !== 'undefined' && containerRef.current) {
      observer = new IntersectionObserver(
        ([entry]) => {
          offscreen = !entry.isIntersecting
          last = performance.now()
        },
        { threshold: 0 }
      )
      observer.observe(containerRef.current)
    }

    const tick = (now) => {
      frame = requestAnimationFrame(tick)
      const dt = (now - last) / 1000
      last = now
      // Pause work entirely when nobody can see it.
      if (hidden || offscreen) return

      sim = stepSimulation(sim, dt)

      // First real frame: hand over from the still frame to the live pool. Done imperatively so
      // a later React re-render can't restore the still group on top of the animation.
      if (stillGroupRef.current) {
        stillGroupRef.current.style.display = 'none'
      }

      for (const packet of sim.packets) {
        const el = packetRefs.current.get(packet.index % POOL_SIZE)
        if (!el) continue
        const seg = packetSegment(packet)
        const { x, y } = interpolate(layout, seg.from, seg.to, seg.t)
        el.setAttribute('transform', `translate(${x} ${y})`)
        el.setAttribute('fill', seg.failing || seg.warning ? TONE.packetFailing : TONE.packet)
        el.setAttribute('opacity', '1')
      }

      // Hide pooled circles not currently bound to a live packet.
      const live = new Set(sim.packets.map((p) => p.index % POOL_SIZE))
      for (const [slot, el] of packetRefs.current) {
        if (!live.has(slot)) el.setAttribute('opacity', '0')
      }

      if (sim.shipped !== shippedRef.current) {
        shippedRef.current = sim.shipped
        setShipped(sim.shipped)
      }
    }

    frame = requestAnimationFrame(tick)

    return () => {
      if (frame) cancelAnimationFrame(frame)
      document.removeEventListener('visibilitychange', onVisibility)
      if (observer) observer.disconnect()
    }
  }, [animated, layout])

  // Gentle pointer response: the nearest node lifts. Desktop pointers only, and never
  // required to understand or use anything.
  const handlePointerMove = (event) => {
    if (!animated) return
    const rect = event.currentTarget.getBoundingClientRect()
    if (rect.width === 0) return
    const [, , vbW, vbH] = layout.viewBox.split(' ').map(Number)
    setPointer({
      x: ((event.clientX - rect.left) / rect.width) * vbW,
      y: ((event.clientY - rect.top) / rect.height) * vbH,
    })
  }

  const nearestNodeId = useMemo(() => {
    if (!pointer) return null
    let best = null
    let bestDist = Infinity
    for (const [id, point] of Object.entries(layout.points)) {
      const d = (point.x - pointer.x) ** 2 + (point.y - pointer.y) ** 2
      if (d < bestDist) {
        bestDist = d
        best = id
      }
    }
    // Only respond when the pointer is genuinely near a node.
    return bestDist < 90 ** 2 ? best : null
  }, [pointer, layout])

  const nodes = [...STAGES, REROUTE_NODE]

  return (
    <figure ref={containerRef} className="m-0">
      <div className="card relative overflow-hidden bg-graphite/70">
        {/* Ledger grid, clipped to the panel — the only ambient pattern on the site. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-ledger bg-grid opacity-60"
        />

        <svg
          viewBox={layout.viewBox}
          role="img"
          aria-labelledby="routing-net-title routing-net-desc"
          preserveAspectRatio="xMidYMid meet"
          className="relative block w-full"
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setPointer(null)}
        >
          <title id="routing-net-title">
            Payment integration pipeline: Documentation, Extraction, Validation, Integration,
            Shipped
          </title>
          <desc id="routing-net-desc">
            A diagram of the five-stage integration pipeline. Work travels from documentation
            through LLM extraction to a human validation gate, then into integration and shipping.
            Roughly one in four items fails validation and is rerouted back to extraction rather
            than dropped.
          </desc>

          {/* Edges */}
          <g strokeLinecap="round" fill="none">
            {allEdges.map((edge) => {
              const from = layout.points[edge.from]
              const to = layout.points[edge.to]
              const isReroute = edge.kind === 'reroute'
              return (
                <line
                  key={`${edge.from}-${edge.to}`}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={isReroute ? TONE.reroute : TONE.trunk}
                  strokeWidth={isReroute ? 1 : 1.5}
                  strokeDasharray={isReroute ? '3 5' : undefined}
                />
              )
            })}
          </g>

          {/* Nodes + labels. Labels are real SVG text: selectable, translatable, crisp. */}
          <g>
            {nodes.map((node, i) => {
              const point = layout.points[node.id]
              const isShipped = node.id === 'shipped'
              const isGate = node.id === 'validate'
              const isDetour = node.id === 'reroute'
              const near = nearestNodeId === node.id
              const r = layout.nodeR + (near ? 2 : 0)

              const labelX = layout.id === 'wide' ? point.x : point.x + layout.labelDx
              const labelY =
                layout.id === 'wide'
                  ? point.y + (isDetour ? layout.rerouteLabelDy : layout.labelDy)
                  : point.y + 4
              const anchor = layout.id === 'wide' ? 'middle' : 'start'

              return (
                <g key={node.id}>
                  {near && (
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r={r + 7}
                      fill="none"
                      stroke="rgba(165,166,255,0.28)"
                      strokeWidth="1"
                    />
                  )}
                  {/* The validation gate reads as a gate, not just another dot. */}
                  {isGate && (
                    <rect
                      x={point.x - r - 4}
                      y={point.y - r - 4}
                      width={(r + 4) * 2}
                      height={(r + 4) * 2}
                      rx="3"
                      fill="none"
                      stroke="rgba(255,138,115,0.45)"
                      strokeWidth="1"
                    />
                  )}
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={r}
                    fill={TONE.node}
                    stroke={isShipped ? TONE.nodeRingShipped : TONE.nodeRing}
                    strokeWidth="1.75"
                  />
                  <text
                    x={labelX}
                    y={labelY}
                    textAnchor={anchor}
                    fontSize={layout.labelSize}
                    fontFamily="'JetBrains Mono', ui-monospace, monospace"
                    letterSpacing="0.08em"
                    fill={isShipped || isGate ? TONE.labelStrong : TONE.label}
                  >
                    {node.short.toUpperCase()}
                  </text>
                  {/* Stage index — reinforces order without relying on colour. */}
                  {!isDetour && (
                    <text
                      x={layout.id === 'wide' ? point.x : point.x - 16}
                      y={layout.id === 'wide' ? point.y - layout.nodeR - 10 : point.y + 4}
                      textAnchor={layout.id === 'wide' ? 'middle' : 'end'}
                      fontSize="9"
                      fontFamily="'JetBrains Mono', ui-monospace, monospace"
                      fill="rgba(148,154,170,0.7)"
                    >
                      {String(i + 1).padStart(2, '0')}
                    </text>
                  )}
                </g>
              )
            })}
          </g>

          {/*
            Packets. Animated: a reused pool driven by rAF. Still: a deterministic snapshot.

            The pool starts *at* the still-frame positions rather than at opacity 0, so a paused
            diagram degrades to the still frame instead of an empty pipeline. That matters — the
            loop is deliberately paused whenever the tab is hidden or the figure is offscreen, and
            a viewer who lands on a backgrounded tab must still see the story.
          */}
          {/* Still frame — always rendered, hidden by the loop's first frame. */}
          <g ref={stillGroupRef}>
            {staticPackets.map((packet) => {
              const seg = packetSegment(packet)
              const { x, y } = interpolate(layout, seg.from, seg.to, seg.t)
              return (
                <circle
                  key={packet.index}
                  cx={x}
                  cy={y}
                  r="3.5"
                  fill={seg.failing || seg.warning ? TONE.packetFailing : TONE.packet}
                />
              )
            })}
          </g>

          {/* Live pool — mounted only when animating, then owned entirely by the loop. */}
          {animated && <PacketPool register={register} />}
        </svg>

        {/* Readout. Mono, tabular, and the reason the diagram exists. */}
        <div className="relative flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-rule px-4 py-3 sm:px-5">
          <span className="label">
            Legacy <span className="text-text-secondary">2 weeks</span>
          </span>
          <span aria-hidden="true" className="label text-indigo-text">
            →
          </span>
          <span className="label">
            With pipeline <span className="text-status">2 days</span>
          </span>
          <span className="label ml-auto">
            {animated ? (
              <>
                Shipped <span className="metric text-text-primary">{shipped}</span>
              </>
            ) : (
              <>Still frame · reduced motion</>
            )}
          </span>
        </div>
      </div>

      <figcaption className="mt-3 text-sm text-text-muted">
        <span className="text-text-secondary">One in four routes fails validation</span> and is
        rerouted, not dropped. That gate is why the pipeline could get fast without getting
        reckless.
      </figcaption>
    </figure>
  )
}

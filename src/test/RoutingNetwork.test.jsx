import { act, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import RoutingNetwork from '../components/hero/RoutingNetwork'
import { setPrefersReducedMotion, triggerResize } from './mocks'

function svg(container) {
  return container.querySelector('svg')
}

describe('RoutingNetwork', () => {
  it('exposes the diagram to assistive tech with a title and a described pipeline', () => {
    const { container } = render(<RoutingNetwork />)
    const node = svg(container)

    expect(node).toHaveAttribute('role', 'img')
    expect(node.querySelector('title').textContent).toMatch(
      /Documentation.*Extraction.*Validation.*Integration.*Shipped/
    )
    // The description must explain the reroute — the whole point of the visual.
    expect(node.querySelector('desc').textContent).toMatch(/rerouted back to extraction/i)
  })

  it('labels all five stages plus the reroute node as real text', () => {
    render(<RoutingNetwork />)
    for (const label of ['DOCS', 'EXTRACT', 'VALIDATE', 'INTEGRATE', 'SHIPPED', 'REROUTE']) {
      expect(screen.getByText(label)).toBeInTheDocument()
    }
  })

  it('states the outcome the diagram exists to make: 2 weeks becomes 2 days', () => {
    render(<RoutingNetwork />)
    expect(screen.getByText('2 weeks')).toBeInTheDocument()
    expect(screen.getByText('2 days')).toBeInTheDocument()
  })

  it('explains the reroute in the caption, not only through motion and colour', () => {
    render(<RoutingNetwork />)
    expect(screen.getByText(/One in four routes fails validation/i)).toBeInTheDocument()
    expect(screen.getByText(/rerouted, not dropped/i)).toBeInTheDocument()
  })

  it('renders the still frame under reduced motion, and says so', () => {
    setPrefersReducedMotion(true)
    render(<RoutingNetwork />)
    expect(screen.getByText(/Still frame · reduced motion/i)).toBeInTheDocument()
  })

  it('still draws packets in the still frame, so the diagram is never empty', () => {
    setPrefersReducedMotion(true)
    const { container } = render(<RoutingNetwork />)
    const packets = container.querySelectorAll('circle[r="3.5"]')
    expect(packets.length).toBeGreaterThanOrEqual(3)
    // Every still packet has real coordinates — none are parked at the origin.
    for (const packet of packets) {
      expect(Number(packet.getAttribute('cx'))).toBeGreaterThan(0)
    }
  })

  it('draws one packet in the tension colour, showing a route being rejected', () => {
    setPrefersReducedMotion(true)
    const { container } = render(<RoutingNetwork />)
    const failing = [...container.querySelectorAll('circle[r="3.5"]')].filter(
      (c) => c.getAttribute('fill') === '#ff8a73'
    )
    expect(failing.length).toBeGreaterThanOrEqual(1)
  })

  it('switches to the narrow layout when the container is too small for five labels across', () => {
    const { container } = render(<RoutingNetwork />)
    act(() => triggerResize(320))
    expect(svg(container)).toHaveAttribute('viewBox', '0 0 260 340')

    act(() => triggerResize(1024))
    expect(svg(container)).toHaveAttribute('viewBox', '0 0 560 224')
  })

  it('uses the wide layout at the hero column width it actually gets on a 1440px desktop', () => {
    const { container } = render(<RoutingNetwork />)
    act(() => triggerResize(560))
    expect(svg(container)).toHaveAttribute('viewBox', '0 0 560 224')
  })

  it('renders the still frame even while animating, so a paused diagram is never empty', () => {
    // The loop pauses whenever the tab is hidden or the figure is offscreen, and the first live
    // frame hides this group imperatively. A viewer landing on a backgrounded tab must still see a
    // populated pipeline, not five bare nodes.
    const { container } = render(<RoutingNetwork />)
    const placed = [...container.querySelectorAll('circle[r="3.5"][cx]')]
    expect(placed.length).toBeGreaterThanOrEqual(3)
    expect(
      placed.some((c) => c.getAttribute('fill') === '#ff8a73'),
      'one still packet should show the reroute in progress'
    ).toBe(true)
  })

  it('keeps the live packet pool out of React’s hands so re-renders cannot reset mid-flight positions', () => {
    const { container } = render(<RoutingNetwork />)
    const pooled = [...container.querySelectorAll('circle[r="3.5"]:not([cx])')]
    // 12 pooled circles, all initially hidden and carrying no React-owned transform.
    expect(pooled).toHaveLength(12)
    for (const circle of pooled) {
      expect(circle.getAttribute('opacity')).toBe('0')
      expect(circle.getAttribute('transform')).toBeNull()
    }
  })

  it('renders every trunk edge plus the two-leg reroute detour', () => {
    const { container } = render(<RoutingNetwork />)
    const lines = container.querySelectorAll('line')
    // 4 trunk edges + 2 reroute legs
    expect(lines).toHaveLength(6)
    const dashed = [...lines].filter((l) => l.getAttribute('stroke-dasharray'))
    expect(dashed).toHaveLength(2)
  })
})

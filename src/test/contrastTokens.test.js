import { describe, it, expect } from 'vitest'
import tailwindConfig from '../../tailwind.config.js'

// WCAG 2.1 relative luminance / contrast ratio helpers.
function srgbToLinear(c) {
  const cs = c / 255
  return cs <= 0.03928 ? cs / 12.92 : ((cs + 0.055) / 1.055) ** 2.4
}

function relativeLuminance(hex) {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  const [rl, gl, bl] = [r, g, b].map(srgbToLinear)
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl
}

function contrastRatio(hex1, hex2) {
  const l1 = relativeLuminance(hex1)
  const l2 = relativeLuminance(hex2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

// Composites a translucent hex/rgba foreground over an opaque hex background,
// so we can test tokens (e.g. glass cards) that are only ever rendered with
// alpha, not as flat opaque colors.
function compositeOverBackground(rgba, backgroundHex) {
  const match = rgba.match(
    /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)/
  )
  if (!match) return rgba // already opaque hex
  const [, r, g, b, a = '1'] = match
  const alpha = parseFloat(a)
  const bg = backgroundHex.replace('#', '')
  const bgR = parseInt(bg.slice(0, 2), 16)
  const bgG = parseInt(bg.slice(2, 4), 16)
  const bgB = parseInt(bg.slice(4, 6), 16)
  const blend = (fg, bgChannel) => Math.round(fg * alpha + bgChannel * (1 - alpha))
  const toHex = (n) => n.toString(16).padStart(2, '0')
  return `#${toHex(blend(+r, bgR))}${toHex(blend(+g, bgG))}${toHex(blend(+b, bgB))}`
}

const { colors, backgroundImage } = tailwindConfig.theme.extend
const SURFACE = colors.surface // #0a0a0f
// Worst-case glass composite: white/[0.06] card over the base surface, per the
// strategy's computed pair (#19191d).
const GLASS = compositeOverBackground('rgba(255,255,255,0.06)', SURFACE)

describe('contrast-safe color tokens (dark gradient restyle)', () => {
  it('text-primary passes AA (>=4.5:1) on surface and on the glass composite', () => {
    expect(contrastRatio(colors['text-primary'], SURFACE)).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio(colors['text-primary'], GLASS)).toBeGreaterThanOrEqual(4.5)
  })

  it('text-secondary passes AA (>=4.5:1) on surface and on the glass composite', () => {
    expect(contrastRatio(colors['text-secondary'], SURFACE)).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio(colors['text-secondary'], GLASS)).toBeGreaterThanOrEqual(4.5)
  })

  it('text-muted passes AA (>=4.5:1) on surface and on the glass composite', () => {
    expect(contrastRatio(colors['text-muted'], SURFACE)).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio(colors['text-muted'], GLASS)).toBeGreaterThanOrEqual(4.5)
  })

  it('accent.text passes AA (>=4.5:1) on surface and on the glass composite', () => {
    expect(contrastRatio(colors.accent.text, SURFACE)).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio(colors.accent.text, GLASS)).toBeGreaterThanOrEqual(4.5)
  })

  it('accent.DEFAULT clears the large-text/non-text 3:1 minimum on surface but is documented as text-unsafe', () => {
    const ratio = contrastRatio(colors.accent.DEFAULT, SURFACE)
    expect(ratio).toBeGreaterThanOrEqual(3)
    expect(ratio).toBeLessThan(4.5) // must stay large/bold-text or non-text only
  })

  it('white text on the solid button fill (accent.hover, #4f46e5) passes AA (>=4.5:1)', () => {
    const ratio = contrastRatio('#ffffff', colors.accent.hover)
    expect(ratio).toBeGreaterThanOrEqual(4.5)
  })

  it('white text on the raw indigo fill (accent.DEFAULT) fails AA, confirming buttons must use accent.hover instead', () => {
    const ratio = contrastRatio('#ffffff', colors.accent.DEFAULT)
    expect(ratio).toBeLessThan(4.5)
  })

  it('every brand-gradient stop clears the large-text/non-text 3:1 minimum on surface', () => {
    // indigo, pink, sky — the three stops of the signature tri-gradient.
    const stops = ['#6366f1', '#ec4899', '#38bdf8']
    for (const stop of stops) {
      expect(contrastRatio(stop, SURFACE), `${stop} on surface`).toBeGreaterThanOrEqual(3)
    }
  })

  it('brand-gradient background-image is defined with the three documented stops in order', () => {
    expect(backgroundImage['brand-gradient']).toBe(
      'linear-gradient(90deg, #6366f1, #ec4899 50%, #38bdf8)'
    )
  })

  it('emerald status text passes AA (>=4.5:1) composited on its own translucent badge background', () => {
    const emeraldBadgeOnSurface = compositeOverBackground(colors.emerald.bg, SURFACE)
    const ratio = contrastRatio(colors.emerald.DEFAULT, emeraldBadgeOnSurface)
    expect(ratio).toBeGreaterThanOrEqual(4.5)
  })
})

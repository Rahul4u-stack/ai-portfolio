import { describe, expect, it } from 'vitest'
import tailwindConfig from '../../tailwind.config.js'

// WCAG 2.1 relative luminance / contrast ratio helpers.
function srgbToLinear(channel) {
  const cs = channel / 255
  return cs <= 0.03928 ? cs / 12.92 : ((cs + 0.055) / 1.055) ** 2.4
}

function relativeLuminance(hex) {
  const h = hex.replace('#', '')
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16))
  const [rl, gl, bl] = [r, g, b].map(srgbToLinear)
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl
}

function contrastRatio(a, b) {
  const l1 = relativeLuminance(a)
  const l2 = relativeLuminance(b)
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
}

/** Composite a translucent colour over an opaque background — for pill backgrounds. */
function composite(hex, alpha, backgroundHex) {
  const parse = (value) => {
    const h = value.replace('#', '')
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16))
  }
  const [r, g, b] = parse(hex)
  const [br, bg, bb] = parse(backgroundHex)
  const blend = (fg, bgChannel) => Math.round(fg * alpha + bgChannel * (1 - alpha))
  const toHex = (n) => n.toString(16).padStart(2, '0')
  return `#${toHex(blend(r, br))}${toHex(blend(g, bg))}${toHex(blend(b, bb))}`
}

const { colors } = tailwindConfig.theme.extend

const INK = colors.ink
const GRAPHITE = colors.graphite
const PANEL = colors.panel
const SURFACES = [
  ['ink', INK],
  ['graphite', GRAPHITE],
  ['panel', PANEL],
]

const AA_TEXT = 4.5
const AA_LARGE = 3

describe('design tokens — surfaces', () => {
  it('uses deep ink rather than pure black', () => {
    expect(INK).not.toBe('#000000')
    expect(relativeLuminance(INK)).toBeGreaterThan(0)
  })

  it('layers surfaces from darkest to lightest so elevation is legible', () => {
    expect(relativeLuminance(INK)).toBeLessThan(relativeLuminance(GRAPHITE))
    expect(relativeLuminance(GRAPHITE)).toBeLessThan(relativeLuminance(PANEL))
  })
})

describe('design tokens — text passes WCAG AA on every surface', () => {
  const textTokens = [
    ['text-primary', colors['text-primary']],
    ['text-secondary', colors['text-secondary']],
    ['text-muted', colors['text-muted']],
    ['indigo.text', colors.indigo.text],
    ['signal', colors.signal.DEFAULT],
    ['status', colors.status.DEFAULT],
    ['coral', colors.coral.DEFAULT],
  ]

  for (const [name, value] of textTokens) {
    for (const [surfaceName, surface] of SURFACES) {
      it(`${name} on ${surfaceName} is at least ${AA_TEXT}:1`, () => {
        expect(contrastRatio(value, surface)).toBeGreaterThanOrEqual(AA_TEXT)
      })
    }
  }
})

describe('design tokens — accent fills', () => {
  it('white on the indigo button fill passes AA for normal text', () => {
    expect(contrastRatio('#ffffff', colors.indigo.DEFAULT)).toBeGreaterThanOrEqual(AA_TEXT)
  })

  it('white on the indigo hover fill also passes AA', () => {
    expect(contrastRatio('#ffffff', colors.indigo.deep)).toBeGreaterThanOrEqual(AA_TEXT)
  })

  it('raw indigo clears the 3:1 non-text minimum but is documented as body-text-unsafe', () => {
    const ratio = contrastRatio(colors.indigo.DEFAULT, INK)
    expect(ratio).toBeGreaterThanOrEqual(AA_LARGE)
    expect(ratio).toBeLessThan(AA_TEXT)
  })
})

describe('design tokens — status pills', () => {
  // Mirrors the alpha values baked into .pill-status / .pill-signal / .pill-coral / .pill-indigo.
  const pills = [
    ['status', colors.status.DEFAULT, colors.status.DEFAULT, 0.14],
    ['signal', colors.signal.DEFAULT, colors.signal.DEFAULT, 0.14],
    ['coral', colors.coral.DEFAULT, colors.coral.DEFAULT, 0.14],
    ['indigo', colors.indigo.text, colors.indigo.DEFAULT, 0.18],
  ]

  for (const [name, foreground, tint, alpha] of pills) {
    it(`${name} pill text passes AA on its own tinted background`, () => {
      const background = composite(tint, alpha, INK)
      expect(contrastRatio(foreground, background)).toBeGreaterThanOrEqual(AA_TEXT)
    })
  }
})

describe('design system — typography contract', () => {
  it('keeps display, body and mono as three distinct families', () => {
    const { fontFamily } = tailwindConfig.theme.extend
    expect(fontFamily.display[0]).toContain('Instrument Serif')
    expect(fontFamily.mono[0]).toContain('JetBrains Mono')
    expect(fontFamily.display[0]).not.toBe(fontFamily.sans[0])
  })

  it('names the body face exactly as @fontsource registers it', () => {
    // @fontsource-variable/archivo declares font-family: 'Archivo Variable'. Asking for plain
    // "Archivo" first silently fell back to the system sans and the webfont never loaded.
    const { fontFamily } = tailwindConfig.theme.extend
    expect(fontFamily.sans[0]).toBe('"Archivo Variable"')
  })

  it('starts the hero size small enough not to clip a narrow viewport', () => {
    // clamp() minimum must be well under the 320px budget for the longest hero word.
    expect(tailwindConfig.theme.extend.fontSize['5xl'][0]).toMatch(/clamp\(2\.5rem/)
  })
})

describe('design system — no leftover aurora gradient', () => {
  it('no longer defines the old multi-stop brand gradient', () => {
    // The redesign replaced it with a single routing hairline; a tri-colour gradient
    // reappearing means the aurora look is creeping back in.
    expect(tailwindConfig.theme.extend.backgroundImage['brand-gradient']).toBeUndefined()
    expect(tailwindConfig.theme.extend.backgroundImage['route-rule']).toBeDefined()
  })
})

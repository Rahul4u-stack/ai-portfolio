import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { describe, expect, it } from 'vitest'
import tailwindConfig from '../../tailwind.config.js'
import { hex, palettes } from '../theme/palette'

// WCAG 2.1 relative luminance / contrast ratio helpers.
function srgbToLinear(channel) {
  const cs = channel / 255
  return cs <= 0.03928 ? cs / 12.92 : ((cs + 0.055) / 1.055) ** 2.4
}

function relativeLuminance(h) {
  const v = h.replace('#', '')
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(v.slice(i, i + 2), 16))
  const [rl, gl, bl] = [r, g, b].map(srgbToLinear)
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl
}

function contrastRatio(a, b) {
  const l1 = relativeLuminance(a)
  const l2 = relativeLuminance(b)
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
}

/** Composite a translucent colour over an opaque background — for pill tints. */
function composite(fg, alpha, bg) {
  const parse = (h) => {
    const v = h.replace('#', '')
    return [0, 2, 4].map((i) => parseInt(v.slice(i, i + 2), 16))
  }
  const [r, g, b] = parse(fg)
  const [br, bgc, bb] = parse(bg)
  const blend = (f, k) => Math.round(f * alpha + k * (1 - alpha))
  const toHex = (n) => n.toString(16).padStart(2, '0')
  return `#${toHex(blend(r, br))}${toHex(blend(g, bgc))}${toHex(blend(b, bb))}`
}

const AA_TEXT = 4.5
const AA_LARGE = 3
const THEMES = ['dark', 'light']

describe.each(THEMES)('%s palette — WCAG 2.1 AA', (theme) => {
  const surfaces = ['ink', 'graphite', 'panel'].map((token) => [token, hex(theme, token)])
  const textTokens = [
    'text-primary',
    'text-secondary',
    'text-muted',
    'indigo-text',
    'signal',
    'status',
    'coral',
  ]

  it.each(textTokens)('%s reaches 4.5:1 on every surface', (token) => {
    for (const [surfaceName, surface] of surfaces) {
      expect(
        contrastRatio(hex(theme, token), surface),
        `${theme}/${token} on ${surfaceName}`
      ).toBeGreaterThanOrEqual(AA_TEXT)
    }
  })

  it('keeps white readable on the indigo button fill', () => {
    expect(contrastRatio('#ffffff', hex(theme, 'indigo'))).toBeGreaterThanOrEqual(AA_TEXT)
    expect(contrastRatio('#ffffff', hex(theme, 'indigo-deep'))).toBeGreaterThanOrEqual(AA_TEXT)
  })

  it('keeps raw indigo above the 3:1 non-text minimum on the page surface', () => {
    expect(contrastRatio(hex(theme, 'indigo'), hex(theme, 'ink'))).toBeGreaterThanOrEqual(AA_LARGE)
  })

  it('keeps every pill readable: signal text on its own 14% tint (18% for indigo)', () => {
    const paper = hex(theme, 'ink')
    for (const token of ['status', 'signal', 'coral']) {
      const tint = composite(hex(theme, token), 0.14, paper)
      expect(
        contrastRatio(hex(theme, token), tint),
        `${theme}/${token} pill`
      ).toBeGreaterThanOrEqual(AA_TEXT)
    }
    const indigoTint = composite(hex(theme, 'indigo'), 0.18, paper)
    expect(contrastRatio(hex(theme, 'indigo-text'), indigoTint)).toBeGreaterThanOrEqual(AA_TEXT)
  })

  it('orders surfaces so elevation stays legible', () => {
    const lums = ['ink', 'graphite', 'panel'].map((t) => relativeLuminance(hex(theme, t)))
    if (theme === 'dark') {
      expect(lums[0]).toBeLessThan(lums[1])
      expect(lums[1]).toBeLessThan(lums[2])
    } else {
      // Light inverts: page paper is the darkest, panels are the brightest.
      expect(lums[0]).toBeLessThan(lums[2])
      expect(lums[1]).toBeLessThanOrEqual(lums[2])
    }
  })
})

describe('palette.js and index.css cannot drift apart', () => {
  const cssPath = join(dirname(fileURLToPath(import.meta.url)), '..', 'index.css')
  const css = readFileSync(cssPath, 'utf8')
  // Anchor on the selectors WITH their opening brace — the header comment mentions the bare
  // selector names, and slicing on those grabbed the comment instead of the rule blocks.
  const rootBlock = css.slice(css.indexOf(':root {'), css.indexOf("[data-theme='light'] {"))
  const lightBlock = css.slice(css.indexOf("[data-theme='light'] {"), css.indexOf('html {'))

  function tripletsOf(block) {
    const out = {}
    for (const match of block.matchAll(/--([a-z-]+):\s*(\d+ \d+ \d+);/g)) {
      out[match[1]] = match[2]
    }
    return out
  }

  it('dark triplets in index.css match src/theme/palette.js exactly', () => {
    const cssTriplets = tripletsOf(rootBlock)
    for (const [token, triplet] of Object.entries(palettes.dark)) {
      expect(cssTriplets[token], `dark --${token}`).toBe(triplet)
    }
  })

  it('light triplets in index.css match src/theme/palette.js exactly', () => {
    const cssTriplets = tripletsOf(lightBlock)
    for (const [token, triplet] of Object.entries(palettes.light)) {
      expect(cssTriplets[token], `light --${token}`).toBe(triplet)
    }
  })

  it('the light theme overrides every diagram variable the dark theme defines', () => {
    const netVars = [...rootBlock.matchAll(/--net-[a-z-]+/g)].map((m) => m[0])
    expect(netVars.length).toBeGreaterThanOrEqual(10)
    for (const name of new Set(netVars)) {
      expect(lightBlock.includes(name), `${name} missing from light theme`).toBe(true)
    }
  })
})

describe('tailwind config resolves through the variables', () => {
  const { colors } = tailwindConfig.theme.extend

  it('every colour token is var-backed — a hex here would silently ignore the theme', () => {
    const flat = []
    for (const value of Object.values(colors)) {
      if (typeof value === 'string') flat.push(value)
      else flat.push(...Object.values(value))
    }
    for (const value of flat) {
      expect(value, value).toMatch(/var\(--/)
    }
  })

  it('keeps display, body and mono as three distinct families', () => {
    const { fontFamily } = tailwindConfig.theme.extend
    expect(fontFamily.display[0]).toContain('Instrument Serif')
    expect(fontFamily.sans[0]).toBe('"Archivo Variable"')
    expect(fontFamily.mono[0]).toContain('JetBrains Mono')
  })
})

describe('the pre-paint theme script', () => {
  const htmlPath = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'index.html')
  const html = readFileSync(htmlPath, 'utf8')

  it('sets data-theme inline before any bundle loads, defaulting to dark', () => {
    const inlineScript = html.slice(html.indexOf('<script>'), html.indexOf('</script>'))
    expect(inlineScript).toContain("localStorage.getItem('theme')")
    expect(inlineScript).toContain('prefers-color-scheme: light')
    expect(inlineScript).toContain("setAttribute('data-theme', theme)")
    expect(inlineScript).toContain("var theme = 'dark'")
    // The inline script must run before the module bundle.
    expect(html.indexOf('<script>')).toBeLessThan(html.indexOf('type="module"'))
  })

  it('declares both colour schemes and a theme-color for each', () => {
    expect(html).toContain('content="dark light"')
    expect(html).toContain('content="#0b0d12"')
    expect(html).toContain('content="#f5f3ed"')
  })
})

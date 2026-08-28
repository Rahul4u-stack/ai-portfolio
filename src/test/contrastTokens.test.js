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

describe.each(['dark', 'light'])('%s palette — WCAG 2.1 AA', (theme) => {
  const surfaces = ['surface', 'surface-raised', 'surface-elevated'].map((t) => [t, hex(theme, t)])

  it.each(['text-primary', 'text-secondary', 'text-muted', 'accent-text', 'emerald'])(
    '%s reaches 4.5:1 on every surface',
    (token) => {
      for (const [surfaceName, surface] of surfaces) {
        expect(
          contrastRatio(hex(theme, token), surface),
          `${theme}/${token} on ${surfaceName}`
        ).toBeGreaterThanOrEqual(AA_TEXT)
      }
    }
  )

  it('keeps white readable on the solid button fill (accent-hover)', () => {
    expect(contrastRatio('#ffffff', hex(theme, 'accent-hover'))).toBeGreaterThanOrEqual(AA_TEXT)
  })

  it('keeps raw accent above the 3:1 non-text minimum on the page surface', () => {
    expect(contrastRatio(hex(theme, 'accent'), hex(theme, 'surface'))).toBeGreaterThanOrEqual(
      AA_LARGE
    )
  })

  it('keeps the availability badge readable: emerald on its own tint', () => {
    const alpha = theme === 'dark' ? 0.15 : 0.12
    const tint = composite(hex(theme, 'emerald'), alpha, hex(theme, 'surface'))
    expect(contrastRatio(hex(theme, 'emerald'), tint)).toBeGreaterThanOrEqual(AA_TEXT)
  })

  it('keeps text readable on the glass card composite', () => {
    // Worst case: muted text on a glass card over the raised surface.
    const glass =
      theme === 'dark'
        ? composite('#ffffff', 0.05, hex(theme, 'surface-raised'))
        : composite('#0a0a0f', 0.045, hex(theme, 'surface-raised'))
    expect(contrastRatio(hex(theme, 'text-muted'), glass)).toBeGreaterThanOrEqual(AA_TEXT)
  })
})

describe('brand gradient stays legible as clipped heading text', () => {
  const stops = {
    dark: ['#6366f1', '#ec4899', '#38bdf8'],
    light: ['#4f46e5', '#db2777', '#0284c7'],
  }
  it.each(['dark', 'light'])('%s stops clear the large-text 3:1 minimum on every surface', (theme) => {
    for (const stop of stops[theme]) {
      for (const surfaceToken of ['surface', 'surface-raised', 'surface-elevated']) {
        expect(
          contrastRatio(stop, hex(theme, surfaceToken)),
          `${theme} ${stop} on ${surfaceToken}`
        ).toBeGreaterThanOrEqual(3)
      }
    }
  })
})

describe('palette.js and index.css cannot drift apart', () => {
  const cssPath = join(dirname(fileURLToPath(import.meta.url)), '..', 'index.css')
  const css = readFileSync(cssPath, 'utf8')
  const rootBlock = css.slice(css.indexOf(':root {'), css.indexOf("[data-theme='light'] {"))
  const lightBlock = css.slice(css.indexOf("[data-theme='light'] {"), css.indexOf('html {'))

  function tripletsOf(block) {
    const out = {}
    for (const match of block.matchAll(/--([a-z-]+):\s*(\d+ \d+ \d+);/g)) {
      out[match[1]] = match[2]
    }
    return out
  }

  it('dark triplets in index.css match palette.js exactly', () => {
    const cssTriplets = tripletsOf(rootBlock)
    for (const [token, triplet] of Object.entries(palettes.dark)) {
      expect(cssTriplets[token], `dark --${token}`).toBe(triplet)
    }
  })

  it('light triplets in index.css match palette.js exactly', () => {
    const cssTriplets = tripletsOf(lightBlock)
    for (const [token, triplet] of Object.entries(palettes.light)) {
      expect(cssTriplets[token], `light --${token}`).toBe(triplet)
    }
  })

  it('the light theme overrides every full-value token the dark theme defines', () => {
    for (const name of ['--border-subtle', '--border-muted', '--glass', '--emerald-bg', '--brand-gradient', '--atmosphere', '--atmo-grid', '--cursor-glow']) {
      expect(rootBlock.includes(name), `${name} in :root`).toBe(true)
      expect(lightBlock.includes(name), `${name} in light`).toBe(true)
    }
  })
})

describe('tailwind config resolves through the variables', () => {
  it('every colour token is var-backed — a hex here would silently ignore the theme', () => {
    const { colors } = tailwindConfig.theme.extend
    const flat = []
    for (const value of Object.values(colors)) {
      if (typeof value === 'string') flat.push(value)
      else flat.push(...Object.values(value))
    }
    for (const value of flat) expect(value, value).toMatch(/var\(--/)
    expect(tailwindConfig.theme.extend.backgroundImage['brand-gradient']).toBe(
      'var(--brand-gradient)'
    )
  })
})

describe('the theme boot script', () => {
  const htmlPath = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'index.html')
  const html = readFileSync(htmlPath, 'utf8')

  it('applies only a STORED light choice — dark is the default, with no OS sniffing', () => {
    const inline = html.slice(html.indexOf('<script>'), html.indexOf('</script>'))
    expect(inline).toContain("localStorage.getItem('theme') === 'light'")
    expect(inline).not.toContain('prefers-color-scheme')
    expect(html.indexOf('<script>')).toBeLessThan(html.indexOf('type="module"'))
  })
})

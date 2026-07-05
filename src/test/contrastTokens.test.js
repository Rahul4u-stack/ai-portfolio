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

const { colors } = tailwindConfig.theme.extend
const PAPER = colors.paper // page background, #F9F7F3

describe('contrast-safe color tokens (Week 6c regression guard)', () => {
  it('accent.text (link/small-text color) resolves to the darkened AA-safe value', () => {
    // This is the #1 risk fix from the Week 6c strategy: small terracotta text/links
    // must use the darkened accent.text token, never the bright accent.DEFAULT.
    expect(colors.accent.text.toLowerCase()).toBe('#b8432e')
  })

  it('accent.text passes AA body-text contrast (>=4.5:1) against paper background', () => {
    const ratio = contrastRatio(colors.accent.text, PAPER)
    expect(ratio).toBeGreaterThanOrEqual(4.5)
  })

  it('bright accent.DEFAULT fails AA body-text contrast, confirming it must stay large/bold-only', () => {
    // Documents WHY accent.DEFAULT is restricted to large/bold text and non-text UI —
    // if this ever starts passing 4.5:1 the restriction note above may need revisiting,
    // but it should never regress the other way (i.e. never get worse for large-text/3:1 use).
    const ratio = contrastRatio(colors.accent.DEFAULT, PAPER)
    expect(ratio).toBeLessThan(4.5)
    expect(ratio).toBeGreaterThanOrEqual(3) // still must clear the large-text/non-text UI minimum
  })

  it('body text tokens (ink, ink-soft, text-primary, text-secondary) are dark tones passing AA', () => {
    expect(contrastRatio(colors.ink, PAPER)).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio(colors['ink-soft'], PAPER)).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio(colors['text-primary'], PAPER)).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio(colors['text-secondary'], PAPER)).toBeGreaterThanOrEqual(4.5)
  })

  it('warm.text (muted body/metadata color) passes AA body-text contrast', () => {
    const ratio = contrastRatio(colors.warm.text, PAPER)
    expect(ratio).toBeGreaterThanOrEqual(4.5)
  })

  it('button fill token (accent.hover, used as default solid-fill) passes AA against paper-tinted button text', () => {
    // Contact/GameEmbed buttons use bg-accent-hover with text-paper by default (strategy Section 8 fix).
    const ratio = contrastRatio(colors.accent.hover, PAPER)
    expect(ratio).toBeGreaterThanOrEqual(4.5)
  })
})

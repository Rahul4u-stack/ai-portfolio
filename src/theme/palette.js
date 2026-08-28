/**
 * Both themes for the site, single source of truth.
 *
 * Dark is the brand default and is byte-identical to the site as it has always looked.
 * Light is opt-in ONLY — a visitor gets it by pressing the toggle, never by surprise
 * (no prefers-color-scheme sniffing; that decision is deliberate).
 *
 * `src/index.css` defines these same values as CSS custom properties; `contrastTokens.test.js`
 * parses that file to prove the two never drift, then runs WCAG 2.1 AA over BOTH palettes.
 */

/** "R G B" triplets — consumed as rgb(var(--x) / <alpha-value>) so classes like bg-surface/80 keep working. */
export const palettes = {
  dark: {
    surface: '10 10 15', // #0a0a0f
    'surface-raised': '18 18 24', // #121218
    'surface-elevated': '22 22 29', // #16161d
    'text-primary': '229 231 235', // #e5e7eb
    'text-secondary': '209 213 219', // #d1d5db
    'text-muted': '156 163 175', // #9ca3af
    accent: '99 102 241', // #6366f1
    'accent-text': '129 140 248', // #818cf8
    'accent-hover': '79 70 229', // #4f46e5
    emerald: '16 185 129', // #10b981
  },
  light: {
    surface: '246 246 248', // #f6f6f8
    'surface-raised': '252 252 253', // #fcfcfd
    'surface-elevated': '255 255 255', // #ffffff
    'text-primary': '23 25 34', // #171922
    'text-secondary': '54 58 69', // #363a45
    'text-muted': '85 91 104', // #555b68
    accent: '99 102 241', // #6366f1 — fills/large only; text uses accent-text
    'accent-text': '67 56 202', // #4338ca
    'accent-hover': '79 70 229', // #4f46e5 — white on it: 6.29:1
    emerald: '4 98 68', // #046244
  },
}

/** Hex view of the same values, for contrast math in tests. */
export function hex(theme, token) {
  const triplet = palettes[theme][token]
  if (!triplet) throw new Error(`unknown token ${token}`)
  return (
    '#' +
    triplet
      .split(' ')
      .map((n) => Number(n).toString(16).padStart(2, '0'))
      .join('')
  )
}

export const themeScalars = {
  dark: { themeColor: '#0a0a0f' },
  light: { themeColor: '#f6f6f8' },
}

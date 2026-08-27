/**
 * The single source of truth for both themes.
 *
 * `src/index.css` defines these same values as CSS custom properties (dark under `:root`,
 * light under `[data-theme='light']`), and `palette.test.js` parses that file to prove the
 * two never drift apart — then runs WCAG 2.1 AA contrast checks over BOTH palettes.
 *
 * Rules carried over from the dark-only system:
 *  - Text tokens must reach 4.5:1 on every surface they can sit on.
 *  - `indigo` reaches only ~3–4.5:1 on its own surfaces → large/bold text and fills only;
 *    white ON indigo is ≥4.5:1 in both themes, so it stays the button fill.
 *  - Signal colours (cyan/green/coral) are signals, not decoration, in both themes.
 */

/** "R G B" triplets — consumed as rgb(var(--x) / <alpha-value>) so Tailwind /opacity works. */
export const palettes = {
  dark: {
    ink: '11 13 18', // #0b0d12
    graphite: '18 21 28', // #12151c
    panel: '23 27 36', // #171b24
    'text-primary': '242 239 233', // #f2efe9
    'text-secondary': '198 202 214', // #c6cad6
    'text-muted': '148 154 170', // #949aaa
    indigo: '91 91 240', // #5b5bf0 — fills / large text only
    'indigo-text': '165 166 255', // #a5a6ff
    'indigo-deep': '67 64 217', // #4340d9
    signal: '86 220 228', // #56dce4
    status: '78 214 155', // #4ed69b
    coral: '255 138 115', // #ff8a73
  },
  light: {
    ink: '245 243 237', // #f5f3ed — warm paper
    graphite: '251 250 246', // #fbfaf6
    panel: '255 255 255', // #ffffff
    'text-primary': '32 36 46', // #20242e
    'text-secondary': '61 67 80', // #3d4350
    'text-muted': '90 97 112', // #5a6170
    indigo: '91 91 240', // #5b5bf0 — same fill both themes; white on it = 5.0:1
    'indigo-text': '67 64 217', // #4340d9
    'indigo-deep': '67 64 217', // #4340d9
    signal: '12 95 107', // #0c5f6b
    status: '10 107 67', // #0a6b43
    coral: '160 51 24', // #a03318
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

/** Theme-level scalars that aren't simple colour triplets. */
export const themeScalars = {
  dark: { themeColor: '#0b0d12' },
  light: { themeColor: '#f5f3ed' },
}

import defaultTheme from 'tailwindcss/defaultTheme'

/**
 * "Payment Intelligence Network" design system.
 *
 * Palette rules:
 *  - `ink` / `graphite` / `panel` are the only backgrounds. Deep ink, never pure black.
 *  - `indigo` is the single brand accent. `signal` (cyan) and `status` (green) are *signal* colours —
 *    reserved for routing state and shipped outcomes. `coral` marks tension / a hard call.
 *  - Every text token here is contrast-verified against ink/graphite/panel in
 *    `src/test/contrastTokens.test.js`. Don't add a text colour without adding its assertion.
 *  - `indigo.DEFAULT` is 3.89:1 on ink → large/bold text or non-text only. White ON it is 5.00:1,
 *    so it is safe as a button fill.
 */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Every token resolves through a CSS variable so the [data-theme] attribute flips the
        // whole site. Triplet pattern (rgb(var(--x) / <alpha-value>)) keeps /opacity modifiers
        // like bg-ink/90 working. Values live in src/index.css, mirrored by src/theme/palette.js.

        // Surfaces
        ink: 'rgb(var(--ink) / <alpha-value>)',
        graphite: 'rgb(var(--graphite) / <alpha-value>)',
        panel: 'rgb(var(--panel) / <alpha-value>)',
        // Aliases so any straggling utility class still resolves to the theme.
        surface: 'rgb(var(--ink) / <alpha-value>)',
        'surface-raised': 'rgb(var(--graphite) / <alpha-value>)',
        'surface-elevated': 'rgb(var(--panel) / <alpha-value>)',

        // Hairlines (alpha baked into the variable — no /opacity modifiers used on these)
        rule: 'var(--rule)',
        'rule-strong': 'var(--rule-strong)',
        'border-subtle': 'var(--rule)',
        'border-muted': 'var(--rule-strong)',

        // Text
        'text-primary': 'rgb(var(--text-primary) / <alpha-value>)',
        'text-secondary': 'rgb(var(--text-secondary) / <alpha-value>)',
        'text-muted': 'rgb(var(--text-muted) / <alpha-value>)',

        // Brand accent
        indigo: {
          DEFAULT: 'rgb(var(--indigo) / <alpha-value>)',
          text: 'rgb(var(--indigo-text) / <alpha-value>)',
          deep: 'rgb(var(--indigo-deep) / <alpha-value>)',
          soft: 'var(--indigo-soft)',
        },
        accent: {
          DEFAULT: 'rgb(var(--indigo) / <alpha-value>)',
          text: 'rgb(var(--indigo-text) / <alpha-value>)',
          hover: 'rgb(var(--indigo-deep) / <alpha-value>)',
        },

        // Signals — routing (cyan), shipped/outcome (green), tension/decision (coral)
        signal: {
          DEFAULT: 'rgb(var(--signal) / <alpha-value>)',
        },
        status: {
          DEFAULT: 'rgb(var(--status) / <alpha-value>)',
        },
        coral: {
          DEFAULT: 'rgb(var(--coral) / <alpha-value>)',
        },
      },

      fontFamily: {
        // Editorial display face — headlines only, never body copy.
        display: ['"Instrument Serif"', 'Georgia', ...defaultTheme.fontFamily.serif],
        // Technical grotesk — all body copy and UI.
        // NOTE: @fontsource-variable/archivo registers the family as "Archivo Variable", not
        // "Archivo". Asking for "Archivo" silently fell through to the system sans and the
        // typeface never loaded at all. Keep both names.
        sans: ['"Archivo Variable"', 'Archivo', ...defaultTheme.fontFamily.sans],
        // Reserved for metrics, labels, payment states, dates and system signals.
        mono: ['"JetBrains Mono"', ...defaultTheme.fontFamily.mono],
      },

      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.1rem' }],
        sm: ['0.875rem', { lineHeight: '1.35rem' }],
        base: ['1rem', { lineHeight: '1.6rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.8rem' }],
        '2xl': ['clamp(1.5rem, 1.35rem + 0.75vw, 1.875rem)', { lineHeight: '1.2' }],
        '3xl': ['clamp(1.75rem, 1.45rem + 1.5vw, 2.5rem)', { lineHeight: '1.12' }],
        '4xl': ['clamp(2.125rem, 1.6rem + 2.6vw, 3.5rem)', { lineHeight: '1.06' }],
        // Hero. Starts small enough to never clip at 320px.
        '5xl': ['clamp(2.5rem, 1.5rem + 4.4vw, 4.75rem)', { lineHeight: '1.02' }],
      },

      maxWidth: {
        shell: '76rem', // 1216px content shell
        prose: '38rem', // ~68ch reading measure
      },

      borderRadius: {
        card: '0.75rem',
        xl2: '0.75rem',
      },

      boxShadow: {
        lift: '0 24px 48px -24px rgba(0,0,0,0.75)',
        'glow-indigo': '0 0 0 1px rgba(91,91,240,0.35), 0 12px 40px -16px rgba(91,91,240,0.45)',
        'card-lift': '0 24px 48px -24px rgba(0,0,0,0.75)',
      },

      backgroundImage: {
        // Theme-aware section furniture; the gradients live in src/index.css per theme.
        'route-rule': 'var(--route-rule)',
        ledger: 'var(--ledger)',
      },

      backgroundSize: {
        grid: '32px 32px',
      },

      transitionTimingFunction: {
        signal: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}

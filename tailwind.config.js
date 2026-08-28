import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Every token resolves through a CSS variable so [data-theme] flips the site.
        // Triplets (rgb(var(--x) / <alpha-value>)) keep modifiers like bg-surface/80 working.
        // Values live in src/index.css, mirrored by src/theme/palette.js (tested in sync).
        surface: 'rgb(var(--surface) / <alpha-value>)',
        'surface-raised': 'rgb(var(--surface-raised) / <alpha-value>)',
        'surface-elevated': 'rgb(var(--surface-elevated) / <alpha-value>)',
        'border-subtle': 'var(--border-subtle)',
        'border-muted': 'var(--border-muted)',
        glass: 'var(--glass)',
        'text-primary': 'rgb(var(--text-primary) / <alpha-value>)',
        'text-secondary': 'rgb(var(--text-secondary) / <alpha-value>)',
        'text-muted': 'rgb(var(--text-muted) / <alpha-value>)',
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          text: 'rgb(var(--accent-text) / <alpha-value>)',
          hover: 'rgb(var(--accent-hover) / <alpha-value>)',
        },
        emerald: {
          DEFAULT: 'rgb(var(--emerald) / <alpha-value>)',
          bg: 'var(--emerald-bg)',
        },
      },
      fontFamily: {
        sans: ['Barlow', ...defaultTheme.fontFamily.sans],
        display: ['Barlow', ...defaultTheme.fontFamily.sans],
        mono: ['JetBrains Mono', ...defaultTheme.fontFamily.mono],
      },
      fontSize: {
        xs: 'clamp(0.75rem, 0.72rem + 0.15vw, 0.8rem)',
        sm: 'clamp(0.875rem, 0.83rem + 0.2vw, 0.95rem)',
        base: 'clamp(1rem, 0.95rem + 0.25vw, 1.0625rem)',
        lg: 'clamp(1.125rem, 1.05rem + 0.35vw, 1.25rem)',
        xl: 'clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem)',
        '2xl': 'clamp(1.5rem, 1.3rem + 1vw, 1.875rem)',
        '3xl': 'clamp(1.875rem, 1.5rem + 1.6vw, 2.5rem)',
        '4xl': 'clamp(2.25rem, 1.7rem + 2.5vw, 3.25rem)',
        '5xl': 'clamp(2.75rem, 1.9rem + 3.8vw, 4.25rem)',
        '6xl': 'clamp(3.25rem, 2rem + 5.5vw, 5.5rem)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      boxShadow: {
        'glow-indigo': '0 0 24px -4px rgba(99,102,241,0.35)',
        'card-lift': '0 8px 30px -12px rgba(0,0,0,0.5)',
      },
      backgroundImage: {
        'brand-gradient': 'var(--brand-gradient)',
      },
    },
  },
  plugins: [],
}

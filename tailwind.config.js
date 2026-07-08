import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        surface: '#0a0a0f',
        'surface-raised': '#121218',
        'surface-elevated': '#16161d',
        'border-subtle': 'rgba(255,255,255,0.08)',
        'border-muted': 'rgba(255,255,255,0.16)',
        'text-primary': '#e5e7eb',
        'text-secondary': '#d1d5db',
        'text-muted': '#9ca3af',
        accent: {
          DEFAULT: '#6366f1',
          text: '#818cf8',
          hover: '#4f46e5',
        },
        emerald: {
          DEFAULT: '#10b981',
          bg: 'rgba(16,185,129,0.15)',
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
        'brand-gradient': 'linear-gradient(90deg, #6366f1, #ec4899 50%, #38bdf8)',
      },
    },
  },
  plugins: [],
}

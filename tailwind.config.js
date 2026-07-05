import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: '#F9F7F3',
        'paper-raised': '#f2f1f0',
        ink: '#0d0d0d',
        'ink-soft': '#323131',
        neutral: {
          950: '#0d0d0d',
          900: '#f2f1f0',
          800: '#d0cdcd',
          700: '#d0cdcd',
          600: '#919191',
          500: '#6e6a69',
          400: '#9a9796',
          200: '#d0cdcd',
          50: '#F9F7F3',
        },
        warm: {
          600: '#5a5a5a',
          text: '#6e6a69',
          400: '#919191',
          light: '#9a9796',
          200: '#d0cdcd',
        },
        accent: {
          DEFAULT: '#d1543e',
          text: '#b8432e',
          hover: '#9c3520',
        },
        surface: '#F9F7F3',
        'surface-raised': '#f2f1f0',
        'surface-elevated': '#f2f1f0',
        'text-primary': '#0d0d0d',
        'text-secondary': '#323131',
        'text-muted': '#6e6a69',
        'border-subtle': '#d0cdcd',
        'border-muted': '#919191',
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        display: ['"Fraunces Variable"', 'Fraunces', 'ui-serif', 'Georgia', ...defaultTheme.fontFamily.serif],
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
        'card-lift': '0 8px 30px -12px rgba(13,13,13,0.12)',
        card: '0 4px 24px -8px rgba(13,13,13,0.08)',
      },
      backgroundImage: {
        'fade-to-raised': 'linear-gradient(to bottom, transparent, #f2f1f0)',
        'fade-from-raised': 'linear-gradient(to bottom, #f2f1f0, transparent)',
      },
    },
  },
  plugins: [],
}

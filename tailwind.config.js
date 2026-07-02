import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#0d0c0f',
        secondary: '#151318',
        neutral: {
          950: '#0d0c0f',
          900: '#151318',
          800: '#211f26',
          700: '#39353f',
          600: '#5a5563',
          500: '#8b8593',
          400: '#a9a3b0',
          200: '#dcd9df',
          50: '#f7f6f8',
        },
        accent: {
          from: '#7c5cff',
          to: '#00d4c8',
          DEFAULT: '#8a6dff',
          hover: '#9c84ff',
        },
        surface: '#0d0c0f',
        'surface-raised': '#151318',
        'surface-elevated': '#211f26',
        'text-primary': '#f7f6f8',
        'text-secondary': '#dcd9df',
        'text-muted': '#a9a3b0',
        'border-subtle': '#39353f',
        'border-muted': '#5a5563',
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        display: ['Manrope', ...defaultTheme.fontFamily.sans],
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
        'glow-accent': '0 0 40px -10px rgba(124,92,255,0.35)',
        card: '0 4px 24px -8px rgba(0,0,0,0.4)',
      },
    },
  },
  plugins: [],
}

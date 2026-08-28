import { FaMoon, FaSun } from 'react-icons/fa'
import useTheme from '../../hooks/useTheme'

/**
 * Light/dark switch, styled like the site's pill controls. The accessible name states the
 * destination ("Switch to light theme"); the icon shows it.
 */
export default function ThemeToggle({ className = '' }) {
  const [theme, toggle] = useTheme()
  const next = theme === 'light' ? 'dark' : 'light'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className={`flex h-11 w-11 items-center justify-center rounded-full border border-border-subtle
        bg-glass text-text-secondary backdrop-blur-md transition-colors duration-300
        hover:border-border-muted hover:text-text-primary ${className}`}
    >
      {theme === 'light' ? (
        <FaMoon aria-hidden="true" size={15} />
      ) : (
        <FaSun aria-hidden="true" size={15} />
      )}
    </button>
  )
}

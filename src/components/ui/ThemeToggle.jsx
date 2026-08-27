import { FaMoon, FaSun } from 'react-icons/fa'
import useTheme from '../../hooks/useTheme'

/**
 * Light/dark switch. The accessible name states the *destination* ("Switch to light theme"),
 * the icon shows it, and aria-pressed is deliberately absent — this is an action button whose
 * label changes, not a toggle whose label stays constant.
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
      className={`btn-ghost min-w-[2.75rem] ${className}`}
    >
      {theme === 'light' ? (
        <FaMoon aria-hidden="true" size={16} />
      ) : (
        <FaSun aria-hidden="true" size={16} />
      )}
    </button>
  )
}

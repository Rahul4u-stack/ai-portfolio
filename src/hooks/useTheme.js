import { useCallback, useSyncExternalStore } from 'react'
import { themeScalars } from '../theme/palette'

/**
 * Theme state lives on <html data-theme> — set before first paint by the inline script in
 * index.html (localStorage override → prefers-color-scheme → dark). This hook reads and
 * flips that attribute; the CSS variables in index.css do everything else.
 */
const listeners = new Set()

function subscribe(onChange) {
  listeners.add(onChange)
  return () => listeners.delete(onChange)
}

function getSnapshot() {
  if (typeof document === 'undefined') return 'dark'
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme)
  // Keep the browser chrome (address bar, overscroll) in step with the page.
  const meta = document.querySelector('meta[name="theme-color"]:not([media])')
  if (meta) meta.setAttribute('content', themeScalars[theme].themeColor)
  try {
    localStorage.setItem('theme', theme)
  } catch {
    /* private mode etc. — the choice just won't persist */
  }
  listeners.forEach((listener) => listener())
}

export default function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, () => 'dark')
  const toggle = useCallback(() => {
    applyTheme(getSnapshot() === 'light' ? 'dark' : 'light')
  }, [])
  return [theme, toggle]
}

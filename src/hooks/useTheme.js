import { useCallback, useSyncExternalStore } from 'react'
import { themeScalars } from '../theme/palette'

/**
 * Theme state lives on <html data-theme>. Dark is ALWAYS the default — the site never opens
 * light because of an OS setting (that surprised its owner once; it stays opt-in). A stored
 * explicit choice is applied before first paint by the inline script in index.html.
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
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', themeScalars[theme].themeColor)
  try {
    localStorage.setItem('theme', theme)
  } catch {
    /* private mode — the choice just won't persist */
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

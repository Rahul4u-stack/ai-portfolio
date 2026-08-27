import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import ThemeToggle from '../components/ui/ThemeToggle'

function setDocTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme)
}

beforeEach(() => {
  setDocTheme('dark')
  localStorage.clear()
  // The live meta the hook keeps in sync.
  const meta = document.createElement('meta')
  meta.setAttribute('name', 'theme-color')
  meta.setAttribute('content', '#0b0d12')
  document.head.appendChild(meta)
})

afterEach(() => {
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.remove())
  document.documentElement.removeAttribute('data-theme')
})

describe('ThemeToggle', () => {
  it('names its destination, not its state', () => {
    render(<ThemeToggle />)
    expect(screen.getByRole('button', { name: 'Switch to light theme' })).toBeInTheDocument()
  })

  it('flips data-theme on the document and back', async () => {
    render(<ThemeToggle />)
    await userEvent.click(screen.getByRole('button', { name: 'Switch to light theme' }))
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')

    // Label follows the new destination.
    await userEvent.click(screen.getByRole('button', { name: 'Switch to dark theme' }))
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })

  it('persists the visitor choice so the inline boot script can honour it next visit', async () => {
    render(<ThemeToggle />)
    await userEvent.click(screen.getByRole('button', { name: 'Switch to light theme' }))
    expect(localStorage.getItem('theme')).toBe('light')
  })

  it('keeps the browser chrome colour in step with the page', async () => {
    render(<ThemeToggle />)
    await userEvent.click(screen.getByRole('button', { name: 'Switch to light theme' }))
    expect(document.querySelector('meta[name="theme-color"]').getAttribute('content')).toBe(
      '#f5f3ed'
    )
  })

  it('meets the 44px target via the shared control class', () => {
    render(<ThemeToggle />)
    const button = screen.getByRole('button')
    expect(button.className).toContain('btn-ghost')
    expect(button.className).toContain('min-w-[2.75rem]')
  })
})

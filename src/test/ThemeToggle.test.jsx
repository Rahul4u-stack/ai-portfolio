import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ThemeToggle from '../components/ui/ThemeToggle'

function reset() {
  document.documentElement.removeAttribute('data-theme')
  localStorage.clear()
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.remove())
  const meta = document.createElement('meta')
  meta.setAttribute('name', 'theme-color')
  meta.setAttribute('content', '#0a0a0f')
  document.head.appendChild(meta)
}

describe('ThemeToggle', () => {
  beforeEach(reset)

  it('defaults to dark and offers light — never the other way round on first visit', () => {
    render(<ThemeToggle />)
    expect(screen.getByRole('button', { name: 'Switch to light theme' })).toBeInTheDocument()
  })

  it('flips the document theme and back', async () => {
    render(<ThemeToggle />)
    await userEvent.click(screen.getByRole('button', { name: 'Switch to light theme' }))
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')

    await userEvent.click(screen.getByRole('button', { name: 'Switch to dark theme' }))
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })

  it('persists the choice for the boot script to honour next visit', async () => {
    render(<ThemeToggle />)
    await userEvent.click(screen.getByRole('button', { name: 'Switch to light theme' }))
    expect(localStorage.getItem('theme')).toBe('light')
  })

  it('keeps the browser chrome colour in step', async () => {
    render(<ThemeToggle />)
    await userEvent.click(screen.getByRole('button', { name: 'Switch to light theme' }))
    expect(document.querySelector('meta[name="theme-color"]').getAttribute('content')).toBe(
      '#f6f6f8'
    )
  })

  it('is a 44px target', () => {
    render(<ThemeToggle />)
    expect(screen.getByRole('button').className).toContain('h-11 w-11')
  })
})

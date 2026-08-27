import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import BackToTop from '../components/ui/BackToTop'
import { setPrefersReducedMotion } from './mocks'

/** The button appears only after 600px of scrolling — deep enough not to overlap the hero. */
const PAST_THRESHOLD = 800

function scrollTo(y) {
  window.scrollY = y
  act(() => {
    window.dispatchEvent(new Event('scroll'))
  })
}

describe('BackToTop', () => {
  afterEach(() => {
    window.scrollY = 0
  })

  it('is not rendered before the user has scrolled past the threshold', () => {
    render(<BackToTop />)
    expect(screen.queryByRole('button', { name: 'Back to top' })).not.toBeInTheDocument()
  })

  it('appears once the user scrolls well down the page', () => {
    render(<BackToTop />)
    scrollTo(PAST_THRESHOLD)
    expect(screen.getByRole('button', { name: 'Back to top' })).toBeInTheDocument()
  })

  it('stays hidden near the top so it cannot overlap hero content', () => {
    render(<BackToTop />)
    scrollTo(400)
    expect(screen.queryByRole('button', { name: 'Back to top' })).not.toBeInTheDocument()
  })

  it('disappears again once the user scrolls back to the top', async () => {
    render(<BackToTop />)
    scrollTo(PAST_THRESHOLD)
    expect(screen.getByRole('button', { name: 'Back to top' })).toBeInTheDocument()

    scrollTo(0)
    await waitFor(() =>
      expect(screen.queryByRole('button', { name: 'Back to top' })).not.toBeInTheDocument()
    )
  })

  it('scrolls smoothly to the top when clicked', async () => {
    const user = userEvent.setup()
    render(<BackToTop />)
    scrollTo(PAST_THRESHOLD)

    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    await user.click(screen.getByRole('button', { name: 'Back to top' }))

    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
    scrollToSpy.mockRestore()
  })

  it('jumps instantly instead of smooth-scrolling under reduced motion', async () => {
    setPrefersReducedMotion(true)
    const user = userEvent.setup()
    render(<BackToTop />)
    scrollTo(PAST_THRESHOLD)

    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    await user.click(screen.getByRole('button', { name: 'Back to top' }))

    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'auto' })
    scrollToSpy.mockRestore()
  })
})

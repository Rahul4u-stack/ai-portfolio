import { render, screen, act, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BackToTop from '../components/ui/BackToTop'

describe('BackToTop', () => {
  afterEach(() => {
    window.scrollY = 0
  })

  it('is not rendered before the user has scrolled past the threshold', () => {
    render(<BackToTop />)
    expect(screen.queryByRole('button', { name: 'Back to top' })).not.toBeInTheDocument()
  })

  it('appears once the user scrolls past 400px', () => {
    render(<BackToTop />)

    window.scrollY = 500
    act(() => {
      window.dispatchEvent(new Event('scroll'))
    })

    expect(screen.getByRole('button', { name: 'Back to top' })).toBeInTheDocument()
  })

  it('disappears again once the user scrolls back above the threshold', async () => {
    render(<BackToTop />)

    window.scrollY = 500
    act(() => {
      window.dispatchEvent(new Event('scroll'))
    })
    expect(screen.getByRole('button', { name: 'Back to top' })).toBeInTheDocument()

    window.scrollY = 0
    act(() => {
      window.dispatchEvent(new Event('scroll'))
    })
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: 'Back to top' })).not.toBeInTheDocument()
    })
  })

  it('scrolls smoothly to the top when clicked', async () => {
    const user = userEvent.setup()
    render(<BackToTop />)

    window.scrollY = 500
    act(() => {
      window.dispatchEvent(new Event('scroll'))
    })

    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    await user.click(screen.getByRole('button', { name: 'Back to top' }))

    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
    scrollToSpy.mockRestore()
  })
})

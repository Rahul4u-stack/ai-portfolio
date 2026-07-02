import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Navbar from '../components/Navbar'
import { MockIntersectionObserver } from './mocks'

const NAV_LINKS = [
  { label: 'About', id: 'about' },
  { label: 'Experience', id: 'experience' },
  { label: 'Projects', id: 'projects' },
  { label: 'Skills', id: 'skills' },
  { label: 'Education', id: 'education' },
  { label: 'Contact', id: 'contact' },
]

function renderNavbarWithSections() {
  return render(
    <>
      <Navbar />
      {NAV_LINKS.map(({ id }) => (
        <section key={id} id={id} />
      ))}
    </>
  )
}

function getScrollSpyObserver() {
  // Navbar's scroll-spy observer is the one actually observing elements
  return MockIntersectionObserver.instances.find((o) => o.elements.size > 0)
}

describe('Navbar scroll-spy', () => {
  it('renders a link for every section with the correct anchor href', () => {
    renderNavbarWithSections()
    for (const { label, id } of NAV_LINKS) {
      expect(screen.getByRole('link', { name: label })).toHaveAttribute('href', `#${id}`)
    }
  })

  it('observes all six sections for scroll-spy', () => {
    renderNavbarWithSections()
    const observer = getScrollSpyObserver()
    expect(observer).toBeDefined()
    expect(observer.elements.size).toBe(NAV_LINKS.length)
  })

  it('marks the visible section link with aria-current', () => {
    renderNavbarWithSections()
    const observer = getScrollSpyObserver()

    act(() => {
      observer.callback(
        [
          {
            isIntersecting: true,
            intersectionRatio: 1,
            target: document.getElementById('projects'),
          },
        ],
        observer
      )
    })

    expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'About' })).not.toHaveAttribute('aria-current')
  })

  it('moves aria-current when a different section becomes visible', () => {
    renderNavbarWithSections()
    const observer = getScrollSpyObserver()

    const spy = (id) =>
      act(() => {
        observer.callback(
          [{ isIntersecting: true, intersectionRatio: 1, target: document.getElementById(id) }],
          observer
        )
      })

    spy('about')
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('aria-current', 'page')

    spy('contact')
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'About' })).not.toHaveAttribute('aria-current')
  })

  it('smooth-scrolls to the target section when a link is clicked', async () => {
    const user = userEvent.setup()
    renderNavbarWithSections()

    const scrollSpy = vi
      .spyOn(document.getElementById('projects'), 'scrollIntoView')
      .mockImplementation(() => {})

    await user.click(screen.getByRole('link', { name: 'Projects' }))
    expect(scrollSpy).toHaveBeenCalledWith({ behavior: 'smooth' })
  })
})

describe('Navbar scroll-progress bar', () => {
  afterEach(() => {
    // Restore jsdom's default (0) so other tests aren't affected.
    Object.defineProperty(document.body, 'scrollHeight', {
      configurable: true,
      value: 0,
    })
    window.scrollY = 0
  })

  it('renders at 0% width before any scrolling has happened', () => {
    const { container } = renderNavbarWithSections()
    const progressBar = container.querySelector('.fixed.top-0.left-0.h-\\[2px\\]')
    expect(progressBar).toBeInTheDocument()
    expect(progressBar).toHaveStyle({ width: '0%' })
  })

  it('updates its width in proportion to scroll position on scroll', () => {
    const { container } = renderNavbarWithSections()

    // Simulate a document that is 1000px taller than the viewport, scrolled
    // halfway down.
    Object.defineProperty(document.body, 'scrollHeight', {
      configurable: true,
      value: 1600,
    })
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: 600,
    })
    window.scrollY = 500 // halfway through the 1000px scrollable range

    act(() => {
      window.dispatchEvent(new Event('scroll'))
    })

    const progressBar = container.querySelector('.fixed.top-0.left-0.h-\\[2px\\]')
    expect(progressBar).toHaveStyle({ width: '50%' })
  })
})

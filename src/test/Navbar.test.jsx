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

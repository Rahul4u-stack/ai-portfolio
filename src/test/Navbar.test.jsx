import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import Navbar from '../components/Navbar'
import { MockIntersectionObserver } from './mocks'

function renderNavbar() {
  return render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  )
}

describe('Navbar — keyboard and screen reader', () => {
  it('puts the skip link first in the tab order', async () => {
    renderNavbar()
    await userEvent.tab()
    expect(document.activeElement).toHaveAccessibleName(/skip to content/i)
  })

  it('names the section nav so it is distinguishable from other navigation', () => {
    renderNavbar()
    expect(screen.getAllByRole('navigation', { name: 'Sections' }).length).toBeGreaterThan(0)
  })

  it('exposes the menu trigger state via aria-expanded, and only references the dialog once it exists', async () => {
    renderNavbar()
    const trigger = screen.getByRole('button', { name: /open menu/i })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    // Closed: no dangling aria-controls pointing at an element that isn't rendered.
    expect(trigger).not.toHaveAttribute('aria-controls')

    await userEvent.click(trigger)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(trigger).toHaveAttribute('aria-controls', 'mobile-menu')
    expect(document.getElementById('mobile-menu')).toBeInTheDocument()
  })

  it('leaves no dangling aria-controls anywhere in the header', () => {
    const { container } = renderNavbar()
    for (const el of container.querySelectorAll('[aria-controls]')) {
      expect(document.getElementById(el.getAttribute('aria-controls'))).toBeTruthy()
    }
  })
})

describe('Navbar — mobile menu is a real dialog', () => {
  it('marks itself modal and carries an accessible name', async () => {
    renderNavbar()
    await userEvent.click(screen.getByRole('button', { name: /open menu/i }))

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAccessibleName('Site sections')
  })

  it('moves focus into the dialog on open', async () => {
    renderNavbar()
    await userEvent.click(screen.getByRole('button', { name: /open menu/i }))
    expect(screen.getByRole('dialog').contains(document.activeElement)).toBe(true)
  })

  it('closes on Escape and returns focus to the trigger', async () => {
    renderNavbar()
    const trigger = screen.getByRole('button', { name: /open menu/i })
    await userEvent.click(trigger)
    await userEvent.keyboard('{Escape}')

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(document.activeElement).toBe(trigger)
  })

  it('traps Tab inside the dialog', async () => {
    renderNavbar()
    await userEvent.click(screen.getByRole('button', { name: /open menu/i }))
    const dialog = screen.getByRole('dialog')

    // Walk past the end of the dialog's focusables; focus must stay inside.
    const focusables = dialog.querySelectorAll('a[href], button:not([disabled])')
    for (let i = 0; i < focusables.length + 2; i += 1) {
      await userEvent.tab()
      expect(dialog.contains(document.activeElement)).toBe(true)
    }
  })

  it('locks background scrolling while open and restores it on close', async () => {
    renderNavbar()
    const trigger = screen.getByRole('button', { name: /open menu/i })

    await userEvent.click(trigger)
    expect(document.body.style.overflow).toBe('hidden')

    await userEvent.keyboard('{Escape}')
    expect(document.body.style.overflow).not.toBe('hidden')
  })

  it('offers every section link plus a résumé link inside the dialog', async () => {
    renderNavbar()
    await userEvent.click(screen.getByRole('button', { name: /open menu/i }))
    const dialog = screen.getByRole('dialog')

    for (const label of ['Work', 'Decisions', 'Experience', 'Lab', 'About', 'Contact']) {
      expect(within(dialog).getByRole('link', { name: label })).toBeInTheDocument()
    }
    expect(within(dialog).getByRole('link', { name: /résumé/i })).toHaveAttribute(
      'href',
      '/resume.pdf'
    )
  })
})

describe('Navbar — scroll spy', () => {
  it('clears the active section when nothing is in the observer band', () => {
    // Regression: reading only the latest batch of entries meant scrolling back to the hero left
    // the previous section highlighted, because "no longer intersecting" was silently ignored.
    render(
      <MemoryRouter>
        <Navbar />
        <section id="work">work</section>
        <section id="decisions">decisions</section>
      </MemoryRouter>
    )

    const observer = MockIntersectionObserver.instances.find((i) => i.elements.size > 0)
    const work = document.getElementById('work')
    const decisions = document.getElementById('decisions')

    act(() => {
      observer.callback([{ target: work, isIntersecting: true, intersectionRatio: 1 }], observer)
    })
    expect(screen.getByRole('link', { name: 'Work' })).toHaveAttribute('aria-current', 'true')

    // Scroll on: Decisions takes over.
    act(() => {
      observer.callback(
        [
          { target: work, isIntersecting: false, intersectionRatio: 0 },
          { target: decisions, isIntersecting: true, intersectionRatio: 1 },
        ],
        observer
      )
    })
    expect(screen.getByRole('link', { name: 'Decisions' })).toHaveAttribute('aria-current', 'true')
    expect(screen.getByRole('link', { name: 'Work' })).not.toHaveAttribute('aria-current')

    // Back to the top: nothing is in the band, so nothing should stay highlighted.
    act(() => {
      observer.callback(
        [{ target: decisions, isIntersecting: false, intersectionRatio: 0 }],
        observer
      )
    })
    for (const label of ['Work', 'Decisions']) {
      expect(screen.getByRole('link', { name: label }), label).not.toHaveAttribute('aria-current')
    }
  })
})

describe('Navbar — progress indicator', () => {
  it('hides the decorative progress bar from assistive tech', () => {
    const { container } = renderNavbar()
    const bar = container.querySelector('[aria-hidden="true"] > .bg-route-rule')
    expect(bar).toBeInTheDocument()
  })
})

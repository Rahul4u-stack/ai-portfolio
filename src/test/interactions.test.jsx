import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import BuildLab from '../components/sections/BuildLab'
import SelectedWork from '../components/sections/SelectedWork'
import Decisions from '../components/sections/Decisions'
import Experience from '../components/sections/Experience'
import Contact from '../components/sections/Contact'
import { labProjects } from '../data/lab'
import { selectedWork } from '../data/work'
import { decisions } from '../data/decisions'
import { experiences } from '../data/experience'

/** Company and platform names contain regex metacharacters ("X (Twitter)", "Shaadi.com"). */
function escapeRe(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function renderIn(ui) {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

describe('Build Lab — filtering', () => {
  it('starts on All and shows every build', () => {
    renderIn(<BuildLab />)
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true')
    expect(
      screen.getByText(`Showing ${labProjects.length} of ${labProjects.length} builds`)
    ).toBeInTheDocument()
  })

  it('filters by tag and moves the pressed state', async () => {
    renderIn(<BuildLab />)
    await userEvent.click(screen.getByRole('button', { name: 'Games' }))

    expect(screen.getByRole('button', { name: 'Games' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'false')

    const expected = labProjects.filter((p) => p.tags.includes('games'))
    for (const project of expected) {
      expect(screen.getByText(project.title)).toBeInTheDocument()
    }
    for (const project of labProjects.filter((p) => !p.tags.includes('games'))) {
      expect(screen.queryByText(project.title)).not.toBeInTheDocument()
    }
  })

  it('announces the result count in a live region so filtering is not silent', async () => {
    renderIn(<BuildLab />)
    const status = screen.getByRole('status')
    expect(status).toHaveAttribute('aria-live', 'polite')

    await userEvent.click(screen.getByRole('button', { name: 'Games' }))
    const expected = labProjects.filter((p) => p.tags.includes('games')).length
    expect(status).toHaveTextContent(`Showing ${expected} of ${labProjects.length} builds`)
  })

  it('never shows an empty grid — every filter matches something', async () => {
    renderIn(<BuildLab />)
    const filters = screen.getAllByRole('button').filter((b) => b.hasAttribute('aria-pressed'))
    for (const filter of filters) {
      await userEvent.click(filter)
      expect(screen.getByRole('status').textContent).not.toMatch(/Showing 0 of/)
    }
  })

  it('is operable by keyboard', async () => {
    renderIn(<BuildLab />)
    const games = screen.getByRole('button', { name: 'Games' })
    games.focus()
    await userEvent.keyboard('{Enter}')
    expect(games).toHaveAttribute('aria-pressed', 'true')
  })
})

describe('Build Lab — heavy media is lazy', () => {
  it('does not mount the playable iframe until the user asks for it', async () => {
    const { container } = renderIn(<BuildLab />)
    expect(container.querySelector('iframe')).toBeNull()

    await userEvent.click(screen.getByRole('button', { name: /play snake/i }))
    const frame = container.querySelector('iframe')
    expect(frame).toBeInTheDocument()
    expect(frame).toHaveAttribute('title', expect.stringContaining('Snake'))
  })

  it('never autoplays video and never preloads it', () => {
    const { container } = renderIn(<BuildLab />)
    const videos = container.querySelectorAll('video')
    expect(videos.length).toBeGreaterThan(0)
    for (const video of videos) {
      expect(video).toHaveAttribute('preload', 'none')
      expect(video).toHaveAttribute('controls')
      expect(video.hasAttribute('autoplay')).toBe(false)
      expect(video.getAttribute('poster')).toBeTruthy()
    }
  })

  it('lazy-loads every card image with explicit dimensions, so nothing shifts', () => {
    const { container } = renderIn(<BuildLab />)
    for (const img of container.querySelectorAll('img')) {
      expect(img).toHaveAttribute('loading', 'lazy')
      expect(img).toHaveAttribute('width')
      expect(img).toHaveAttribute('height')
    }
  })
})

describe('Experience — expandable timeline', () => {
  it('opens the two roles that carry the positioning by default', () => {
    renderIn(<Experience />)
    const open = experiences.filter((role) => role.defaultOpen)
    for (const role of open) {
      const toggle = screen.getByRole('button', { name: new RegExp(role.company, 'i') })
      expect(toggle, role.company).toHaveAttribute('aria-expanded', 'true')
    }
  })

  it('keeps older roles collapsed but reachable', () => {
    renderIn(<Experience />)
    const collapsed = experiences.filter((role) => !role.defaultOpen)
    for (const role of collapsed) {
      expect(
        screen.getByRole('button', { name: new RegExp(role.company, 'i') }),
        role.company
      ).toHaveAttribute('aria-expanded', 'false')
    }
  })

  it('points aria-controls at a panel that exists even while collapsed', () => {
    const { container } = renderIn(<Experience />)
    for (const role of experiences) {
      const toggle = screen.getByRole('button', { name: new RegExp(escapeRe(role.company), 'i') })
      const panelId = toggle.getAttribute('aria-controls')
      // A dangling aria-controls promises assistive tech a relationship that isn't there.
      expect(container.querySelector(`#${panelId}`), `${role.company} panel`).toBeTruthy()
    }
  })

  it('toggles a role open and closed', async () => {
    const { container } = renderIn(<Experience />)
    const toggle = screen.getByRole('button', { name: /Shaadi\.com/i })
    const panel = container.querySelector(`#${toggle.getAttribute('aria-controls')}`)

    expect(panel).toHaveAttribute('hidden')
    await userEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(panel).not.toHaveAttribute('hidden')
    expect(within(panel).getByText(/Conducted 150\+ user calls/)).toBeInTheDocument()

    await userEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(panel).toHaveAttribute('hidden')
  })

  it('names every era in text, never by colour alone', () => {
    renderIn(<Experience />)
    for (const label of ['Engineering', 'Product', 'Product + AI building']) {
      expect(screen.getAllByText(label).length, label).toBeGreaterThan(0)
    }
  })
})

describe('Decisions — records reveal the trade-off and the reconsideration', () => {
  it('shows the context and outcome of every record without any interaction', () => {
    renderIn(<Decisions />)
    for (const decision of decisions) {
      expect(screen.getByText(decision.title)).toBeInTheDocument()
      expect(screen.getByText(decision.context)).toBeInTheDocument()
      expect(screen.getAllByText(decision.outcome).length).toBeGreaterThan(0)
    }
  })

  it('defaults each record to its trade-off', () => {
    renderIn(<Decisions />)
    for (const decision of decisions) {
      expect(screen.getByText(decision.tradeoff)).toBeInTheDocument()
    }
  })

  it('reveals the decision, the result and what would be reconsidered on request', async () => {
    const { container } = renderIn(<Decisions />)
    const card = container.querySelectorAll('article')[0]
    const scoped = within(card)
    const first = decisions[0]

    // Asserted via the `hidden` attribute rather than toBeVisible(): the whole card sits inside a
    // <Reveal>, which is legitimately at opacity 0 until its observer fires.
    const shownPanelFor = (text) => scoped.getByText(text).closest('[role="tabpanel"]')

    await userEvent.click(scoped.getByRole('tab', { name: /decision/i }))
    expect(shownPanelFor(first.decision)).not.toHaveAttribute('hidden')

    await userEvent.click(scoped.getByRole('tab', { name: /why it worked/i }))
    expect(shownPanelFor(first.whyItWorked)).not.toHaveAttribute('hidden')
    expect(shownPanelFor(first.decision)).toHaveAttribute('hidden')

    await userEvent.click(scoped.getByRole('tab', { name: /reconsider/i }))
    expect(shownPanelFor(first.reconsider)).not.toHaveAttribute('hidden')
  })

  it('wires the tabs up as a real tablist with only the active tab in the tab order', async () => {
    const { container } = renderIn(<Decisions />)
    const card = container.querySelectorAll('article')[0]
    const tabs = within(card).getAllByRole('tab')

    expect(within(card).getByRole('tablist')).toBeInTheDocument()
    expect(tabs.filter((t) => t.getAttribute('tabindex') !== '-1')).toHaveLength(1)
    for (const tab of tabs) {
      const panelId = tab.getAttribute('aria-controls')
      expect(container.querySelector(`#${panelId}`), panelId).toBeTruthy()
    }
  })

  it('moves between tabs with arrow keys', async () => {
    const { container } = renderIn(<Decisions />)
    const card = container.querySelectorAll('article')[0]
    const tabs = within(card).getAllByRole('tab')

    tabs[0].focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true')

    await userEvent.keyboard('{ArrowLeft}')
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true')

    await userEvent.keyboard('{End}')
    expect(tabs[tabs.length - 1]).toHaveAttribute('aria-selected', 'true')

    await userEvent.keyboard('{Home}')
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true')
  })
})

describe('Contact — the email path cannot fail silently', () => {
  it('leads with a direct mailto that needs no JavaScript', () => {
    renderIn(<Contact />)
    const direct = screen.getByRole('link', { name: /email me directly/i })
    expect(direct).toHaveAttribute('href', 'mailto:rahulisatiitr@gmail.com')
  })

  it('always shows the address next to the form, not only after a failure', () => {
    renderIn(<Contact />)
    expect(screen.getByText(/prefer email/i)).toBeInTheDocument()
    const links = screen
      .getAllByRole('link')
      .filter((l) => l.getAttribute('href') === 'mailto:rahulisatiitr@gmail.com')
    expect(links.length).toBeGreaterThanOrEqual(2)
  })

  it('labels every form field with a real label element rather than a placeholder', () => {
    const { container } = renderIn(<Contact />)
    const form = within(container.querySelector('form'))
    for (const name of ['Name', 'Email', 'Subject', 'Message']) {
      const field = form.getByLabelText(name)
      expect(field.tagName, name).toMatch(/INPUT|TEXTAREA/)
    }
  })

  it('exposes a status live region for send progress', () => {
    renderIn(<Contact />)
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite')
  })

  it('offers the résumé and every social profile with an accessible name', () => {
    renderIn(<Contact />)
    expect(screen.getAllByRole('link', { name: /résumé/i })[0]).toHaveAttribute(
      'href',
      '/resume.pdf'
    )
    for (const label of ['LinkedIn', 'GitHub', 'X (Twitter)', 'Instagram']) {
      expect(
        screen.getByRole('link', { name: new RegExp(escapeRe(label), 'i') }),
        label
      ).toBeInTheDocument()
    }
  })
})

describe('Selected work — phone-width disclosure', () => {
  it('gives every work item a disclosure button wired to a real panel', () => {
    const { container } = renderIn(<SelectedWork />)
    for (const item of selectedWork) {
      const toggle = screen.getByRole('button', {
        name: `How I approached it — ${item.title}`,
      })
      expect(toggle).toHaveAttribute('aria-expanded', 'false')
      const panel = container.querySelector(`#${toggle.getAttribute('aria-controls')}`)
      expect(panel, item.slug).toBeTruthy()
      // Collapsed below `sm`, permanently visible from `sm` up — both live on the same element.
      expect(panel.className).toContain('hidden')
      expect(panel.className).toContain('sm:grid')
    }
  })

  it('expands and collapses on demand', async () => {
    const { container } = renderIn(<SelectedWork />)
    const first = selectedWork[0]
    const toggle = screen.getByRole('button', {
      name: `How I approached it — ${first.title}`,
    })
    const panel = container.querySelector(`#${toggle.getAttribute('aria-controls')}`)

    await userEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(panel.className).not.toContain('hidden')

    await userEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(panel.className).toContain('hidden')
  })

  it('never hides the outcome behind the disclosure — the payoff stays visible', () => {
    renderIn(<SelectedWork />)
    for (const item of selectedWork) {
      // Outcome renders outside the collapsible panel.
      expect(screen.getByText(item.outcome), item.slug).toBeInTheDocument()
    }
  })

  it('is desktop-invisible by design: the toggle carries sm:hidden', () => {
    renderIn(<SelectedWork />)
    const toggle = screen.getByRole('button', {
      name: `How I approached it — ${selectedWork[0].title}`,
    })
    expect(toggle.className).toContain('sm:hidden')
  })
})

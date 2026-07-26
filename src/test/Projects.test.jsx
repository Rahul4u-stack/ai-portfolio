import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Projects from '../components/Projects'
import { projects } from '../data/projects'

function renderProjects() {
  return render(
    <MemoryRouter>
      <Projects />
    </MemoryRouter>
  )
}

describe('Projects', () => {
  it('renders a card for every project in the data file', () => {
    renderProjects()
    for (const project of projects) {
      expect(screen.getByRole('heading', { name: project.title })).toBeInTheDocument()
    }
  })

  it('renders one Featured badge per featured project', () => {
    renderProjects()
    const featured = projects.filter((p) => p.featured)
    expect(featured.length).toBeGreaterThan(0)
    expect(screen.getAllByText('Featured')).toHaveLength(featured.length)
  })

  it('renders featured project details (subtitle and highlight)', () => {
    renderProjects()
    for (const project of projects.filter((p) => p.featured)) {
      expect(screen.getByText(project.subtitle)).toBeInTheDocument()
      expect(screen.getByText(project.highlight)).toBeInTheDocument()
    }
  })

  it('links each project to its GitHub repo when one exists', () => {
    renderProjects()
    const codeLinks = screen.getAllByRole('link', { name: /code/i })
    const withGithub = projects.filter((p) => p.github)
    expect(codeLinks).toHaveLength(withGithub.length)
  })

  it('renders both impact-pair values and labels for a featured card that has impact data', () => {
    renderProjects()
    const withImpact = projects.filter((p) => p.featured && p.impact)
    expect(withImpact.length).toBeGreaterThan(0)

    // Some impact values/labels are intentionally shared across two projects
    // (e.g. both the Chatbot and the YouTube Summarizer cite "~90%" cost cut),
    // so count occurrences instead of assuming each string is unique.
    const expectedCounts = {}
    for (const project of withImpact) {
      for (const pair of project.impact) {
        expectedCounts[pair.value] = (expectedCounts[pair.value] || 0) + 1
        expectedCounts[pair.label] = (expectedCounts[pair.label] || 0) + 1
      }
    }
    for (const [text, count] of Object.entries(expectedCounts)) {
      expect(screen.getAllByText(text)).toHaveLength(count)
    }
  })

  it('renders the Calorie Estimator card cleanly with no impact row (no impact data on that project)', () => {
    renderProjects()
    const calorieEstimator = projects.find((p) => p.title === 'Calorie Estimator')
    expect(calorieEstimator).toBeDefined()
    expect(calorieEstimator.impact).toBeUndefined()
    // it still renders as a normal card (compact row, since it is not featured)
    expect(screen.getByRole('heading', { name: 'Calorie Estimator' })).toBeInTheDocument()
  })
})

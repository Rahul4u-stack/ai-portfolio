import { render, screen } from '@testing-library/react'
import Projects from '../components/Projects'
import { projects } from '../data/projects'

describe('Projects', () => {
  it('renders a card for every project in the data file', () => {
    render(<Projects />)
    for (const project of projects) {
      expect(screen.getByRole('heading', { name: project.title })).toBeInTheDocument()
    }
  })

  it('renders one Featured badge per featured project', () => {
    render(<Projects />)
    const featured = projects.filter((p) => p.featured)
    expect(featured.length).toBeGreaterThan(0)
    expect(screen.getAllByText('Featured')).toHaveLength(featured.length)
  })

  it('renders featured project details (subtitle and highlight)', () => {
    render(<Projects />)
    for (const project of projects.filter((p) => p.featured)) {
      expect(screen.getByText(project.subtitle)).toBeInTheDocument()
      expect(screen.getByText(project.highlight)).toBeInTheDocument()
    }
  })

  it('links each project to its GitHub repo when one exists', () => {
    render(<Projects />)
    const codeLinks = screen.getAllByRole('link', { name: /code/i })
    const withGithub = projects.filter((p) => p.github)
    expect(codeLinks).toHaveLength(withGithub.length)
  })
})

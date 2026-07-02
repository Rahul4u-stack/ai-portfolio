import { render, screen } from '@testing-library/react'
import App from '../App'

const SECTION_IDS = ['about', 'experience', 'projects', 'skills', 'education', 'contact']

describe('App', () => {
  it('renders the hero, all six anchored sections, and the footer', () => {
    const { container } = render(<App />)

    // Hero (no section id — identified by the name headline)
    expect(screen.getAllByText(/Rahul Agarwal/).length).toBeGreaterThan(0)

    for (const id of SECTION_IDS) {
      expect(container.querySelector(`section#${id}`)).toBeInTheDocument()
    }

    expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument()
  })

  it('renders the navbar with links to every section', () => {
    render(<App />)
    for (const id of SECTION_IDS) {
      const label = id.charAt(0).toUpperCase() + id.slice(1)
      expect(screen.getByRole('link', { name: label })).toHaveAttribute('href', `#${id}`)
    }
  })
})

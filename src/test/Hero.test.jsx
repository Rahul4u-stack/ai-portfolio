import { render, screen } from '@testing-library/react'
import Hero from '../components/Hero'

describe('Hero', () => {
  it('renders the name headline and role', () => {
    render(<Hero />)
    expect(screen.getByRole('heading', { name: /Rahul Agarwal/ })).toBeInTheDocument()
    expect(screen.getByText(/Product Manager/)).toBeInTheDocument()
  })

  it('shows a mono "Scroll" label as the scroll indicator', () => {
    render(<Hero />)
    expect(screen.getByText('Scroll')).toBeInTheDocument()
  })

  it('links the View Projects CTA to the projects section', () => {
    render(<Hero />)
    expect(screen.getByRole('link', { name: 'View Projects' })).toHaveAttribute(
      'href',
      '#projects'
    )
  })
})

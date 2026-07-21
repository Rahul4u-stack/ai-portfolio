import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { describe, it, expect, afterEach, vi } from 'vitest'
import Contact from '../components/Contact'
import { CONTACT_EMAIL, CONTACT_PHONE } from '../data/social'

describe('Contact', () => {
  it('renders the availability badge with the locked hero copy', () => {
    render(<Contact />)
    expect(screen.getByText(/Building AI products/)).toBeInTheDocument()
    expect(screen.getByText(/Open to conversations/)).toBeInTheDocument()
  })

  it('renders the contact info cards with location, email, phone, and social pills', () => {
    render(<Contact />)
    expect(screen.getByText('Jaipur, India')).toBeInTheDocument()
    expect(screen.getByText(CONTACT_EMAIL)).toBeInTheDocument()
    expect(screen.getByText(CONTACT_PHONE)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /LinkedIn/ })).toHaveAttribute(
      'href',
      expect.stringContaining('linkedin.com')
    )
    expect(screen.getByRole('link', { name: /GitHub/ })).toHaveAttribute(
      'href',
      expect.stringContaining('github.com')
    )
    expect(screen.getByRole('link', { name: /X \(Twitter\)/ })).toHaveAttribute(
      'href',
      'https://x.com/RahulAg78135245'
    )
    expect(screen.getByRole('link', { name: /Instagram/ })).toHaveAttribute(
      'href',
      'https://www.instagram.com/rahulagarwal6622/'
    )
  })

  it('copies the email and shows transient "Copied!" feedback', async () => {
    const writeText = vi.fn(() => Promise.resolve())
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    })
    render(<Contact />)

    fireEvent.click(screen.getByRole('button', { name: 'Copy email address' }))

    await waitFor(() => expect(screen.getByText('Copied!')).toBeInTheDocument())
    expect(writeText).toHaveBeenCalledWith(CONTACT_EMAIL)
    delete navigator.clipboard
  })

  it('copies the phone number independently of the email', async () => {
    const writeText = vi.fn(() => Promise.resolve())
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    })
    render(<Contact />)

    fireEvent.click(screen.getByRole('button', { name: 'Copy phone number' }))

    await waitFor(() => expect(screen.getByText('Copied!')).toBeInTheDocument())
    expect(writeText).toHaveBeenCalledWith(CONTACT_PHONE)
    // only the phone card shows feedback
    expect(screen.getAllByText('Copied!')).toHaveLength(1)
    delete navigator.clipboard
  })
})

const fillAndSubmitForm = () => {
  fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Jane' } })
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'jane@example.com' } })
  fireEvent.change(screen.getByLabelText('Subject'), { target: { value: 'Opportunity' } })
  fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'Hello Rahul' } })
  fireEvent.click(screen.getByRole('button', { name: /Send Message/ }))
}

describe('Contact form submission (mailto fallback, FORMSPREE_ID empty)', () => {
  afterEach(() => {
    vi.doUnmock('../data/social')
    vi.resetModules()
  })

  it('opens a mailto draft and shows the transient status label', async () => {
    vi.resetModules()
    vi.doMock('../data/social', async (importOriginal) => ({
      ...(await importOriginal()),
      FORMSPREE_ID: '',
    }))
    const { default: MockedContact } = await import('../components/Contact')

    const hrefSpy = vi.fn()
    const originalLocation = window.location
    delete window.location
    window.location = { ...originalLocation, set href(v) { hrefSpy(v) } }

    render(<MockedContact />)
    fillAndSubmitForm()

    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Opening email client...' })).toBeInTheDocument()
    )
    expect(hrefSpy).toHaveBeenCalledWith(expect.stringContaining(`mailto:${CONTACT_EMAIL}`))
    expect(hrefSpy).toHaveBeenCalledWith(expect.stringContaining(encodeURIComponent('Jane')))

    window.location = originalLocation
  })
})

describe('Contact form submission (Formspree, FORMSPREE_ID set)', () => {
  afterEach(() => {
    vi.doUnmock('../data/social')
    vi.resetModules()
    vi.unstubAllGlobals()
  })

  const renderWithFormspree = async () => {
    vi.resetModules()
    vi.doMock('../data/social', async (importOriginal) => ({
      ...(await importOriginal()),
      FORMSPREE_ID: 'testform1',
    }))
    const { default: MockedContact } = await import('../components/Contact')
    render(<MockedContact />)
  }

  it('POSTs to the Formspree endpoint and shows "Message Sent ✓" on success', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', fetchMock)
    await renderWithFormspree()

    fillAndSubmitForm()

    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Message Sent ✓' })).toBeInTheDocument()
    )
    expect(fetchMock).toHaveBeenCalledWith(
      'https://formspree.io/f/testform1',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          name: 'Jane',
          email: 'jane@example.com',
          subject: 'Opportunity',
          message: 'Hello Rahul',
          _subject: 'Opportunity',
        }),
      })
    )
    // form clears after a successful send
    expect(screen.getByLabelText('Name')).toHaveValue('')
  })

  it('shows the error fallback with a direct mailto link when Formspree fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))
    await renderWithFormspree()

    fillAndSubmitForm()

    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument())
    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent(/email me directly/)
    expect(within(alert).getByRole('link', { name: CONTACT_EMAIL })).toHaveAttribute(
      'href',
      `mailto:${CONTACT_EMAIL}`
    )
    // form keeps the user's text so nothing is lost
    expect(screen.getByLabelText('Name')).toHaveValue('Jane')
  })
})

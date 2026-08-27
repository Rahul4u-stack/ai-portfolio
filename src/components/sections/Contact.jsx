import { useState } from 'react'
import { FaCheck, FaRegCopy } from 'react-icons/fa'
import Reveal from '../ui/Reveal'
import SectionHeader from '../ui/SectionHeader'
import { CONTACT_EMAIL, CONTACT_PHONE, FORMSPREE_ID, findMeOnLinks } from '../../data/social'
import { LOCATION, AVAILABILITY, formatLastUpdated } from '../../data/siteMeta'

const SUBMIT_LABEL = {
  idle: 'Send message',
  sending: 'Sending…',
  sent: 'Message sent',
  mailto: 'Opening email client…',
  error: 'Send message',
}

const STATUS_MESSAGE = {
  idle: '',
  sending: 'Sending your message…',
  sent: 'Message sent — thank you, I will reply by email.',
  mailto: 'Opening your email client with the message pre-filled…',
  error: '',
}

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  // idle | sending | sent | mailto | error
  const [formStatus, setFormStatus] = useState('idle')
  // null | 'email' | 'phone'
  const [copied, setCopied] = useState(null)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCopy = async (text, key) => {
    let copiedOk = false

    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(text)
        copiedOk = true
      } catch {
        copiedOk = false
      }
    }

    if (!copiedOk) {
      try {
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'fixed'
        textArea.style.opacity = '0'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        copiedOk = document.execCommand('copy')
        document.body.removeChild(textArea)
      } catch {
        copiedOk = false
      }
    }

    if (copiedOk) {
      setCopied(key)
      setTimeout(() => setCopied(null), 2000)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const subjectLine = formData.subject || `Portfolio contact from ${formData.name}`

    if (!FORMSPREE_ID) {
      const subject = encodeURIComponent(subjectLine)
      const body = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
      )
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`

      setFormStatus('mailto')
      setTimeout(() => {
        setFormStatus('idle')
        setFormData({ name: '', email: '', subject: '', message: '' })
      }, 3000)
      return
    }

    setFormStatus('sending')
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...formData, _subject: subjectLine }),
      })
      if (!res.ok) throw new Error(`Formspree responded ${res.status}`)
      setFormStatus('sent')
      setFormData({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setFormStatus('idle'), 4000)
    } catch {
      setFormStatus('error')
    }
  }

  const lastUpdated = formatLastUpdated()

  return (
    <section id="contact" className="section" aria-labelledby="contact-heading">
      <div className="shell">
        <SectionHeader
          id="contact-heading"
          index="07"
          title="Let's make it shippable"
          standfirst="Have a difficult payments or AI product problem? Let's make it shippable."
        />

        <Reveal>
          <div className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div className="max-w-prose">
              <p className="label">Fastest way to reach me</p>
              <p className="mt-2 text-text-secondary">
                Skip the form — email goes straight to my inbox.
              </p>
            </div>
            <a href={`mailto:${CONTACT_EMAIL}`} className="btn-primary w-full shrink-0 sm:w-auto">
              Email me directly
            </a>
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-14">
            <div className="flex flex-col gap-8">
              <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="min-w-0">
                  <dt className="label">Location</dt>
                  <dd className="mt-1 break-words text-sm text-text-secondary">{LOCATION}</dd>
                </div>
                <div className="min-w-0">
                  <dt className="label">Availability</dt>
                  <dd className="mt-1 break-words text-sm text-text-secondary">{AVAILABILITY}</dd>
                </div>
                <div className="min-w-0">
                  <dt className="label">Email</dt>
                  <dd className="mt-1 flex min-w-0 flex-wrap items-center gap-2 text-sm text-text-secondary">
                    <span className="min-w-0 break-words">{CONTACT_EMAIL}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(CONTACT_EMAIL, 'email')}
                      aria-label="Copy email address"
                      className="btn-ghost min-w-[2.75rem] shrink-0"
                    >
                      {copied === 'email' ? (
                        <FaCheck aria-hidden="true" />
                      ) : (
                        <FaRegCopy aria-hidden="true" />
                      )}
                    </button>
                    {copied === 'email' && <span className="label text-status">Copied</span>}
                  </dd>
                </div>
                <div className="min-w-0">
                  <dt className="label">Phone</dt>
                  <dd className="mt-1 flex min-w-0 flex-wrap items-center gap-2 text-sm text-text-secondary">
                    <span className="min-w-0 break-words">{CONTACT_PHONE}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(CONTACT_PHONE, 'phone')}
                      aria-label="Copy phone number"
                      className="btn-ghost min-w-[2.75rem] shrink-0"
                    >
                      {copied === 'phone' ? (
                        <FaCheck aria-hidden="true" />
                      ) : (
                        <FaRegCopy aria-hidden="true" />
                      )}
                    </button>
                    {copied === 'phone' && <span className="label text-status">Copied</span>}
                  </dd>
                </div>
              </dl>

              <div>
                <p className="label">Find me on</p>
                <ul className="mt-2 flex list-none flex-wrap gap-2">
                  {findMeOnLinks.map((link) => {
                    const Icon = link.icon
                    return (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="pill-indigo min-h-[2.75rem]"
                        >
                          <Icon aria-hidden="true" />
                          {link.label}
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-rule pt-6">
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  Download résumé
                </a>
                {lastUpdated && <p className="label">Last updated {lastUpdated}</p>}
              </div>
            </div>

            <div className="card p-5 sm:p-7">
              <form
                onSubmit={handleSubmit}
                aria-busy={formStatus === 'sending'}
                className="flex flex-col gap-5"
              >
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-name" className="label">
                      Name
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-card border border-rule-strong bg-panel px-4 py-3 text-text-primary transition-colors duration-200 ease-signal focus-visible:border-indigo-text"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="label">
                      Email
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-card border border-rule-strong bg-panel px-4 py-3 text-text-primary transition-colors duration-200 ease-signal focus-visible:border-indigo-text"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-subject" className="label">
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    autoComplete="off"
                    value={formData.subject}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-card border border-rule-strong bg-panel px-4 py-3 text-text-primary transition-colors duration-200 ease-signal focus-visible:border-indigo-text"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="label">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    autoComplete="off"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="mt-2 w-full resize-none rounded-card border border-rule-strong bg-panel px-4 py-3 text-text-primary transition-colors duration-200 ease-signal focus-visible:border-indigo-text"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={formStatus === 'sending'}
                    className="btn-secondary w-full disabled:opacity-60"
                  >
                    {SUBMIT_LABEL[formStatus]}
                  </button>

                  <p
                    role="status"
                    aria-live="polite"
                    className="mt-4 min-h-[1.25rem] text-sm text-text-secondary"
                  >
                    {STATUS_MESSAGE[formStatus]}
                  </p>

                  <p className="text-sm text-text-secondary">
                    Prefer email?{' '}
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="break-words text-indigo-text underline underline-offset-2"
                    >
                      {CONTACT_EMAIL}
                    </a>
                  </p>

                  {formStatus === 'error' && (
                    <p role="alert" className="mt-4 text-sm text-coral">
                      Couldn&apos;t send right now — please email me directly at{' '}
                      <a
                        href={`mailto:${CONTACT_EMAIL}`}
                        className="break-words underline underline-offset-2"
                      >
                        {CONTACT_EMAIL}
                      </a>
                      .
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

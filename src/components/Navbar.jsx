import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import useReducedMotion from '../hooks/useReducedMotion'
import ThemeToggle from './ui/ThemeToggle'

/**
 * Fixed header + mobile menu.
 *
 * The mobile menu is a real modal dialog: focus moves in on open, is trapped while open, returns
 * to the trigger on close, Escape closes it, and background content is `aria-hidden`.
 *
 * The scroll-progress bar is the "transaction signal progressing through the site" — a 2px rule,
 * not a decorative overlay. It is `aria-hidden`; the same information is in the active nav item.
 */

const navLinks = [
  { label: 'Work', href: '#work' },
  { label: 'Decisions', href: '#decisions' },
  { label: 'Experience', href: '#experience' },
  { label: 'Lab', href: '#lab' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

const FOCUSABLE = 'a[href], button:not([disabled])'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [progress, setProgress] = useState(0)

  const prefersReducedMotion = useReducedMotion()
  const location = useLocation()
  const navigate = useNavigate()

  const panelRef = useRef(null)
  const triggerRef = useRef(null)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24)
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      setProgress(scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined
    const sections = navLinks
      .map((link) => document.getElementById(link.href.slice(1)))
      .filter(Boolean)
    if (sections.length === 0) return undefined

    // Track intersection per section rather than reacting to each batch of entries in isolation.
    // Reading only the latest batch meant that scrolling back to the hero — where no section is
    // in the observer's band — left the previous section highlighted, because "nothing is
    // intersecting" arrives as an entry with isIntersecting:false and was simply ignored.
    const intersecting = new Map()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) intersecting.set(entry.target.id, entry.intersectionRatio)
          else intersecting.delete(entry.target.id)
        }
        const best = [...intersecting.entries()].sort((a, b) => b[1] - a[1])[0]
        setActiveSection(best ? best[0] : '')
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.25, 0.5, 1] }
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [location.pathname])

  const closeMenu = useCallback(() => {
    setIsOpen(false)
    triggerRef.current?.focus()
  }, [])

  // Dialog behaviour: lock scroll, move focus in, trap Tab, close on Escape.
  useEffect(() => {
    if (!isOpen) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panelRef.current?.querySelector(FOCUSABLE)?.focus()

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeMenu()
        return
      }
      if (event.key !== 'Tab') return
      const items = panelRef.current?.querySelectorAll(FOCUSABLE)
      if (!items || items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen, closeMenu])

  const handleLinkClick = (event, href) => {
    event.preventDefault()
    setIsOpen(false)
    if (location.pathname !== '/') {
      navigate('/' + href)
      return
    }
    const target = document.querySelector(href)
    if (!target) return
    target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' })
    // Move focus to the section so keyboard users land where the page just scrolled.
    target.setAttribute('tabindex', '-1')
    target.focus({ preventScroll: true })
  }

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100]
          focus:rounded-card focus:bg-indigo focus:px-4 focus:py-3 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to content
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-200 ${
          scrolled ? 'border-b border-rule bg-ink/90 backdrop-blur-md' : 'bg-transparent'
        }`}
      >
        {/* The transaction signal: progress through the page. */}
        <div aria-hidden="true" className="h-[2px] w-full bg-transparent">
          <div
            className="h-full bg-route-rule"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>

        <div className="shell">
          <div className="flex h-16 items-center justify-between gap-4">
            <a
              href="/"
              onClick={(event) => {
                event.preventDefault()
                setIsOpen(false)
                if (location.pathname !== '/') {
                  navigate('/')
                  return
                }
                window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' })
              }}
              className="flex min-h-[2.75rem] min-w-0 items-center gap-3"
            >
              <span
                aria-hidden="true"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-card border border-rule-strong
                  font-mono text-xs font-medium tracking-tight text-indigo-text"
              >
                RA
              </span>
              <span className="flex min-w-0 flex-col leading-tight">
                <span className="truncate font-display text-lg text-text-primary">
                  Rahul Agarwal
                </span>
                <span className="label truncate">Payments · AI</span>
              </span>
            </a>

            <nav aria-label="Sections" className="hidden md:block">
              <ul className="flex items-center gap-1">
                {navLinks.map((link) => {
                  const isActive = activeSection === link.href.slice(1)
                  return (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        onClick={(event) => handleLinkClick(event, link.href)}
                        aria-current={isActive ? 'true' : undefined}
                        className={`inline-flex min-h-[2.75rem] items-center rounded-card px-3 text-sm transition-colors
                          ${
                            isActive
                              ? 'bg-indigo-soft text-indigo-text'
                              : 'text-text-muted hover:text-text-primary'
                          }`}
                      >
                        {link.label}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </nav>

            <div className="flex items-center gap-1">
              <ThemeToggle />
              <button
                ref={triggerRef}
                type="button"
                onClick={() => setIsOpen((open) => !open)}
                aria-expanded={isOpen}
                // Only reference the dialog while it exists — a dangling aria-controls promises
                // assistive tech a relationship that isn't in the DOM.
                aria-controls={isOpen ? 'mobile-menu' : undefined}
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                className="btn-secondary md:hidden"
              >
                <span aria-hidden="true" className="label normal-case tracking-normal">
                  {isOpen ? 'Close' : 'Menu'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {isOpen && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site sections"
          ref={panelRef}
          className="fixed inset-0 z-[60] bg-ink/98 backdrop-blur-lg md:hidden"
        >
          <div className="shell flex h-16 items-center justify-end">
            <button
              type="button"
              onClick={closeMenu}
              className="btn-secondary"
              aria-label="Close menu"
            >
              <span aria-hidden="true" className="label normal-case tracking-normal">
                Close
              </span>
            </button>
          </div>
          <nav aria-label="Sections" className="shell pt-6">
            <ul className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(event) => handleLinkClick(event, link.href)}
                    className="flex min-h-[3.25rem] items-center justify-between border-b border-rule
                      font-display text-2xl text-text-primary"
                  >
                    {link.label}
                    <span aria-hidden="true" className="label">
                      →
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#contact"
                onClick={(event) => handleLinkClick(event, '#contact')}
                className="btn-primary"
              >
                Get in touch
              </a>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                Résumé
              </a>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}

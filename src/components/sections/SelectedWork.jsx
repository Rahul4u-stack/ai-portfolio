import { useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../ui/Reveal'
import SectionHeader from '../ui/SectionHeader'
import { selectedWork } from '../../data/work'

/**
 * Each item reads Problem → Constraint → Decision → System → Outcome.
 *
 * The four analytical fields sit in a 2×2 grid rather than a five-paragraph stack: stacked, the
 * format is a wall of text and "scannable" stops being true — and it made the section taller than
 * the whole page it replaced. Outcome is pulled out as a full-width band because it is the payoff.
 */
const FIELDS = [
  { key: 'problem', label: 'Problem' },
  { key: 'constraint', label: 'Constraint' },
  { key: 'decision', label: 'My decision' },
  { key: 'system', label: 'What I built' },
]

function WorkLink({ link, title }) {
  const accessibleLabel = `${link.label} — ${title}`
  const content = (
    <>
      {link.label}
      {!link.internal && <span aria-hidden="true"> ↗</span>}
    </>
  )

  if (link.internal) {
    return (
      <Link to={link.href} aria-label={accessibleLabel} className="btn-ghost">
        {content}
      </Link>
    )
  }

  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={accessibleLabel}
      className="btn-ghost"
    >
      {content}
    </a>
  )
}

function WorkLinks({ item }) {
  if (item.note) {
    return <p className="label normal-case tracking-normal">{item.note}</p>
  }
  if (!item.links?.length) return null

  return (
    <ul className="flex flex-wrap items-center gap-2">
      {item.links.map((link) => (
        <li key={link.label}>
          <WorkLink link={link} title={item.title} />
        </li>
      ))}
    </ul>
  )
}

/**
 * Product preview. Items without a screenshot get a readout of their own stats — never a restatement
 * of the outcome, which already has its own band directly below.
 */
function WorkPreview({ item }) {
  if (item.image) {
    return (
      <div className="card-interactive overflow-hidden">
        <img
          src={item.image}
          alt=""
          width={800}
          height={450}
          loading="lazy"
          decoding="async"
          className="aspect-video w-full object-cover"
        />
      </div>
    )
  }

  return (
    <div className="card bg-panel relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-ledger bg-grid opacity-60"
      />
      <dl className="relative grid grid-cols-1 divide-y divide-rule">
        {item.stats.map((stat) => (
          <div key={stat.label} className="flex items-baseline justify-between gap-4 px-5 py-4">
            <dt className="label">{stat.label}</dt>
            <dd className="metric text-right text-base text-text-primary">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

function WorkItem({ item, reversed }) {
  /*
   * Phone-width density: the four analytical fields stack to ~500px per item at 375px, which
   * made the section the single biggest contributor to a ~19,500px mobile page. Below `sm`
   * they collapse behind a real disclosure button; from `sm` up the button is display:none
   * (out of the accessibility tree) and the fields are always visible via `sm:grid`, so
   * desktop behaviour and screen-reader semantics are untouched there.
   */
  const [fieldsOpen, setFieldsOpen] = useState(false)
  const fieldsId = `${item.slug}-fields`

  return (
    <>
      <span className="label">{item.kind}</span>
      <h3 className="mt-2 font-display text-2xl text-text-primary text-balance sm:text-3xl">
        {item.title}
      </h3>
      <p className="mt-2 max-w-prose text-text-secondary">{item.subtitle}</p>

      {/* Constant visible label — aria-expanded carries the state; aria-label carries the item. */}
      <button
        type="button"
        aria-expanded={fieldsOpen}
        aria-controls={fieldsId}
        aria-label={`How I approached it — ${item.title}`}
        onClick={() => setFieldsOpen((open) => !open)}
        className="btn-secondary mt-4 sm:hidden"
      >
        How I approached it
        <span aria-hidden="true" className="label">
          {fieldsOpen ? '−' : '+'}
        </span>
      </button>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-10">
        {/* Fields stay first in the DOM at every width; only the visual order flips. */}
        <dl
          id={fieldsId}
          className={`${fieldsOpen ? 'grid' : 'hidden'} min-w-0 grid-cols-1 gap-x-8 gap-y-5 sm:grid sm:grid-cols-2 lg:col-span-7 ${
            reversed ? 'lg:order-2' : 'lg:order-1'
          }`}
        >
          {FIELDS.map((field) => (
            <div key={field.key} className="min-w-0">
              <dt className="label">{field.label}</dt>
              <dd className="mt-1.5 text-sm text-text-secondary">{item[field.key]}</dd>
            </div>
          ))}
        </dl>

        <div className={`min-w-0 lg:col-span-5 ${reversed ? 'lg:order-1' : 'lg:order-2'}`}>
          <WorkPreview item={item} />
        </div>
      </div>

      {/* Outcome: the payoff, given its own band. */}
      <div className="mt-6 flex flex-col gap-2 border-y border-rule py-4 sm:flex-row sm:items-baseline sm:gap-6">
        <span className="label shrink-0 sm:pt-1">Outcome</span>
        <p className="text-base font-medium text-status">{item.outcome}</p>
      </div>

      <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Items without a screenshot already show these stats as their preview panel — don't
            print them twice. */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          {item.image &&
            item.stats?.map((stat) => (
              <span key={stat.label} className="flex items-baseline gap-2">
                <span className="metric text-sm text-text-primary">{stat.value}</span>
                <span className="label">{stat.label}</span>
              </span>
            ))}
        </div>
        <WorkLinks item={item} />
      </div>

      {item.tech?.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {item.tech.slice(0, 4).map((tech) => (
            <li key={tech} className="label rounded-full border border-rule px-2 py-0.5">
              {tech}
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

export default function SelectedWork() {
  return (
    <section id="work" className="section" aria-labelledby="work-heading">
      <div className="shell">
        <SectionHeader
          id="work-heading"
          index="02"
          title="Selected work"
          standfirst="The four pieces that carry the story — the payments workflow that started it, and the AI builds that prove the thinking scales."
        />

        <div>
          {selectedWork.map((item, index) => (
            <Reveal
              key={item.slug}
              as="article"
              className="border-t border-rule pt-8 first:border-t-0 first:pt-0 sm:pt-12"
            >
              <WorkItem item={item} reversed={index % 2 === 1} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

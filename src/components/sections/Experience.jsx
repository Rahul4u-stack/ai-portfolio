import { useState } from 'react'
import Reveal from '../ui/Reveal'
import SectionHeader from '../ui/SectionHeader'
import { ERAS, education, experiences } from '../../data/experience'

const ERA_DOT_CLASS = {
  muted: 'bg-text-muted',
  signal: 'bg-signal',
  indigo: 'bg-indigo-text',
}

const ERA_CHIP_CLASS = {
  muted: 'pill border border-rule-strong text-text-muted',
  signal: 'pill-signal',
  indigo: 'pill-indigo',
}

function ExperienceEntry({ experience, isLast }) {
  const [open, setOpen] = useState(Boolean(experience.defaultOpen))
  const era = ERAS[experience.era]
  const panelId = `experience-highlights-${experience.company.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`

  return (
    <>
      <div className="flex flex-col items-center">
        <span
          aria-hidden="true"
          className={`mt-2 h-3 w-3 shrink-0 rounded-full ${ERA_DOT_CLASS[era.tone]}`}
        />
        {!isLast && <span aria-hidden="true" className="mt-2 w-px flex-1 bg-rule" />}
      </div>

      <div className="min-w-0 flex-1 pb-10 sm:pb-12">
        <div className="card p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <h3 className="font-display text-xl text-text-primary sm:text-2xl">
              {experience.company}
            </h3>
            {experience.current && (
              <span className="pill-status">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-status" />
                Current
              </span>
            )}
            <span className={ERA_CHIP_CLASS[era.tone]}>
              <span
                aria-hidden="true"
                className={`h-1.5 w-1.5 rounded-full ${ERA_DOT_CLASS[era.tone]}`}
              />
              {era.label}
            </span>
          </div>

          <p className="mt-2 text-text-secondary">{experience.role}</p>
          <p className="label mt-2">
            {experience.period} · {experience.location}
          </p>

          <p className="mt-4 max-w-prose text-text-secondary">{experience.summary}</p>

          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={`${open ? 'Hide' : 'Show'} details — ${experience.company}`}
            onClick={() => setOpen((value) => !value)}
            className="btn-ghost mt-4"
          >
            {open ? 'Hide details' : 'Show details'}
          </button>

          {/*
            Always rendered and toggled with `hidden`, never conditionally mounted: the button's
            aria-controls must point at an element that actually exists, or the relationship it
            promises to assistive tech is a dangling reference.
          */}
          <ul id={panelId} hidden={!open} className="mt-4 space-y-2 border-t border-rule pt-4">
            {experience.highlights.map((point) => (
              <li key={point} className="flex gap-2 text-text-secondary">
                <span
                  aria-hidden="true"
                  className="mt-2 h-1 w-1 shrink-0 rounded-full bg-text-muted"
                />
                <span className="min-w-0">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}

export default function Experience() {
  return (
    <section id="experience" className="section" aria-labelledby="experience-heading">
      <div className="shell">
        <SectionHeader
          id="experience-heading"
          index="04"
          title="Experience"
          standfirst="From writing the code, to shipping the product, to building the AI systems that ship it faster."
        />

        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {Object.entries(ERAS).map(([key, era]) => (
            <li key={key} className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className={`h-1.5 w-1.5 rounded-full ${ERA_DOT_CLASS[era.tone]}`}
              />
              <span className="label">{era.label}</span>
            </li>
          ))}
        </ul>

        <ol className="mt-8">
          {experiences.map((experience, index) => (
            <Reveal key={experience.company} as="li" className="flex gap-4 sm:gap-6">
              <ExperienceEntry experience={experience} isLast={index === experiences.length - 1} />
            </Reveal>
          ))}
        </ol>

        <div className="border-t border-rule pt-8">
          <p className="label">Education</p>
          <ul className="mt-4 space-y-3">
            {education.map((item) => (
              <li
                key={item.institution}
                className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1"
              >
                <span className="min-w-0 text-text-secondary">
                  <span className="text-text-primary">{item.institution}</span> — {item.degree}
                </span>
                <span className="label shrink-0">{item.period}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

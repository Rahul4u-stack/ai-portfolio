import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaPlay } from 'react-icons/fa'
import Reveal from '../ui/Reveal'
import SectionHeader from '../ui/SectionHeader'
import { LAB_FILTERS, labProjects } from '../../data/lab'

function LabLink({ link, title }) {
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

function LabLinks({ project }) {
  if (!project.links?.length) return null

  return (
    <ul className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-2">
      {project.links.map((link) => (
        <li key={link.label}>
          <LabLink link={link} title={project.title} />
        </li>
      ))}
    </ul>
  )
}

function LabMedia({ project }) {
  const [playing, setPlaying] = useState(false)

  if (project.embedUrl) {
    if (playing) {
      return (
        <div className="aspect-video w-full overflow-hidden rounded-card border border-rule bg-graphite">
          <iframe
            title={`${project.title} — playable demo`}
            src={project.embedUrl}
            className="h-full w-full"
            allow="gamepad; fullscreen"
          />
        </div>
      )
    }

    return (
      <button
        type="button"
        onClick={() => setPlaying(true)}
        aria-label={`Play ${project.title}`}
        className="card-interactive group relative block aspect-video w-full overflow-hidden"
      >
        {project.image && (
          <img
            src={project.image}
            alt=""
            width={800}
            height={450}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        )}
        <span className="absolute inset-0 flex items-center justify-center bg-ink/50 transition-colors duration-200 ease-signal group-hover:bg-ink/30">
          <span
            aria-hidden="true"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo text-white"
          >
            <FaPlay size={18} />
          </span>
        </span>
      </button>
    )
  }

  if (project.videoUrl) {
    return (
      /* The resume video ships with open captions burned into the frames (Whisper-generated),
         so the accessibility need the rule checks for is met by the medium itself. */
      // eslint-disable-next-line jsx-a11y/media-has-caption
      <video
        controls
        preload="none"
        poster={project.posterUrl}
        aria-label={project.title}
        className="aspect-video w-full rounded-card border border-rule bg-graphite object-cover"
      >
        <source src={project.videoUrl} type="video/mp4" />
        Your browser does not support embedded video.
      </video>
    )
  }

  if (project.image) {
    return (
      <div className="overflow-hidden rounded-card border border-rule bg-graphite">
        <img
          src={project.image}
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

  return null
}

function LabCardContent({ project }) {
  return (
    <article className="card flex h-full flex-col gap-3 p-4 sm:p-5">
      <LabMedia project={project} />
      <div className="flex flex-1 flex-col gap-1.5">
        <h3 className="font-display text-xl text-text-primary">{project.title}</h3>
        <p className="text-sm text-text-secondary">{project.note}</p>
        <p className="metric text-sm text-text-primary">{project.stat}</p>
        {project.note2 && <p className="label normal-case tracking-normal">{project.note2}</p>}
      </div>
      <LabLinks project={project} />
    </article>
  )
}

export default function BuildLab() {
  const [activeFilter, setActiveFilter] = useState('all')
  const filtered =
    activeFilter === 'all'
      ? labProjects
      : labProjects.filter((project) => project.tags.includes(activeFilter))

  return (
    <section id="lab" className="section" aria-labelledby="lab-heading">
      <div className="shell">
        <SectionHeader
          id="lab-heading"
          index="05"
          title="AI & Build Lab"
          standfirst="Smaller builds and experiments, kept lighter than the case studies above but shipped all the same."
        />

        <div role="group" aria-label="Filter builds by category" className="flex flex-wrap gap-2">
          {LAB_FILTERS.map((filter) => {
            const active = activeFilter === filter.id
            return (
              <button
                key={filter.id}
                type="button"
                aria-pressed={active}
                onClick={() => setActiveFilter(filter.id)}
                className={`btn rounded-full border px-4 text-xs sm:text-sm ${
                  active
                    ? 'border-transparent bg-[rgba(91,91,240,0.18)] text-indigo-text'
                    : 'border-rule-strong text-text-secondary hover:border-indigo-text hover:text-indigo-text'
                }`}
              >
                {filter.label}
              </button>
            )
          })}
        </div>

        <p role="status" aria-live="polite" className="label mt-4 normal-case tracking-normal">
          {`Showing ${filtered.length} of ${labProjects.length} builds`}
        </p>

        <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project, index) => (
            <Reveal
              key={project.title}
              as="li"
              delay={Math.min(index, 5) * 0.03}
              className="min-w-0"
            >
              <LabCardContent project={project} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

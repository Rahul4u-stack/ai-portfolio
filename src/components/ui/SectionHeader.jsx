import Reveal from './Reveal'

/**
 * Editorial section header: mono index + routing rule + serif title + optional standfirst.
 * The index is decorative (aria-hidden) — the heading text carries the meaning.
 */
export default function SectionHeader({ index, title, standfirst, id, className = '' }) {
  return (
    <Reveal className={`mb-8 sm:mb-12 ${className}`}>
      <div className="flex items-center gap-4">
        {index && (
          <span aria-hidden="true" className="label shrink-0">
            {index}
          </span>
        )}
        <span aria-hidden="true" className="route-rule flex-1" />
      </div>
      <h2
        id={id}
        className="font-display text-3xl sm:text-4xl text-text-primary mt-4 max-w-[26ch] text-balance"
      >
        {title}
      </h2>
      {standfirst && <p className="mt-3 max-w-prose text-base text-text-secondary">{standfirst}</p>}
    </Reveal>
  )
}

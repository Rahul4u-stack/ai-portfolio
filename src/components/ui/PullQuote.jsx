import Reveal from './Reveal'

/**
 * One editorial beat between sections. Deliberately unattributed — it is a stated point of view,
 * not a testimonial, and must never read as a third-party quote.
 */
export default function PullQuote({ quote }) {
  return (
    <Reveal as="aside" aria-label="Point of view" className="border-y border-rule bg-graphite/40">
      <div className="shell py-12 sm:py-16">
        <blockquote className="mx-auto max-w-3xl text-center font-display text-2xl text-text-primary text-balance sm:text-3xl">
          <span aria-hidden="true" className="text-indigo-text">
            &ldquo;
          </span>
          {quote}
          <span aria-hidden="true" className="text-indigo-text">
            &rdquo;
          </span>
        </blockquote>
      </div>
    </Reveal>
  )
}

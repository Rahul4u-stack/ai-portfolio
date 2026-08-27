import { FaGithub, FaLinkedin } from 'react-icons/fa'
import RoutingNetwork from './RoutingNetwork'
import { AVAILABILITY, ROLE_LINE } from '../../data/siteMeta'

/**
 * Hero. Requirements it is built against:
 *  - Legible and complete at 320px with zero animation and zero JavaScript motion.
 *  - No text over video or imagery — the headline sits on flat ink.
 *  - No typewriter effect. The headline is the headline.
 *  - Immediate proof: four verified metrics above the fold.
 *  - Nothing is revealed by an entrance animation; this content is never wrapped in Reveal.
 */

/**
 * Terse on purpose: the hero is a readout, and the full labels plus their context and source
 * live in the Selected impact rail below. Same four numbers, deliberately not the same wording.
 */
const PROOF = [
  { value: '300+', label: 'Integrations' },
  // The signature metric gets a double-width cell so it never wraps mid-arrow.
  { value: '2 wks → 2 days', label: 'Turnaround', wide: true },
  { value: '99.9%', label: 'Uptime' },
  { value: '$3.4M', label: 'GMV' },
]

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-rule pb-16 pt-28 sm:pb-24 sm:pt-32">
      <div className="shell">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center lg:gap-14">
          {/* --- Left: the claim --------------------------------------------- */}
          <div className="max-w-[34rem]">
            <p className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="pill-status">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-status" />
                Available
              </span>
              <span className="label normal-case tracking-normal">{AVAILABILITY}</span>
            </p>

            <h1 className="mt-6 font-display text-5xl text-text-primary text-balance">
              I turn payment complexity into shipped AI products.
            </h1>

            <p className="mt-5 max-w-prose text-lg text-text-secondary">
              Product Manager with deep fintech experience, building AI workflows that reduced
              payment integration turnaround from{' '}
              <span className="metric text-text-primary">two weeks to two days</span>.
            </p>

            {/* The separator is hidden once the line wraps, so it can't dangle at the end of a row. */}
            <p className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="font-display text-xl text-text-primary">Rahul Agarwal</span>
              <span aria-hidden="true" className="hidden text-text-muted sm:inline">
                ·
              </span>
              <span className="label">{ROLE_LINE}</span>
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#work" className="btn-primary">
                Explore selected work
              </a>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                Download résumé
              </a>
              <span className="flex items-center gap-1">
                <a
                  href="https://www.linkedin.com/in/rahul-agar/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Rahul Agarwal on LinkedIn"
                  className="btn-ghost min-w-[2.75rem]"
                >
                  <FaLinkedin aria-hidden="true" size={20} />
                </a>
                <a
                  href="https://github.com/Rahul4u-stack"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Rahul Agarwal on GitHub"
                  className="btn-ghost min-w-[2.75rem]"
                >
                  <FaGithub aria-hidden="true" size={20} />
                </a>
              </span>
            </div>

            {/* Immediate proof. Static markup — no count-up, nothing to wait for. */}
            {/*
              Hairline dividers, not just gaps: without them the adjacent mono labels read as one
              run of text ("INTEGRATIONS TURNAROUND"). Reads as an instrument panel, too.
            */}
            <dl className="mt-10 grid grid-cols-2 gap-y-5 border-t border-rule pt-6 sm:grid-cols-5">
              {PROOF.map((item, index) => (
                <div
                  key={item.label}
                  className={`pl-4 ${index % 2 === 0 ? 'pl-0 sm:border-l sm:border-rule sm:pl-4' : 'border-l border-rule'} ${
                    index === 0 ? 'sm:border-l-0 sm:pl-0' : ''
                  } ${item.wide ? 'sm:col-span-2' : ''}`}
                >
                  <dt className="label">{item.label}</dt>
                  <dd className="metric mt-1 whitespace-nowrap text-base text-text-primary sm:text-lg">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* --- Right: the signature visual -------------------------------- */}
          <div>
            <RoutingNetwork />
          </div>
        </div>
      </div>
    </section>
  )
}

import { frameworks } from '../../data/frameworks'
import Reveal from '../ui/Reveal'

/**
 * A compact continuation of the Decisions section, not a numbered block of its own.
 *
 * These three positions came from the old "How I Think" section. The redesign folded that section
 * into "Decisions I'd defend", but the content is genuinely differentiating payments POV — deleting
 * it to hit a section count would have been the wrong trade. It lives here as a three-line strip.
 */
export default function Beliefs() {
  return (
    <Reveal as="aside" aria-labelledby="beliefs-heading" className="shell pb-16 sm:pb-24">
      <div className="border-t border-rule pt-8">
        <h3 id="beliefs-heading" className="label">
          Working beliefs
        </h3>
        <dl className="mt-6 grid gap-x-8 gap-y-8 sm:grid-cols-3">
          {frameworks.map((item) => (
            <div key={item.title} className="min-w-0">
              <dt className="font-display text-xl text-text-primary text-balance">{item.title}</dt>
              <dd className="mt-3 space-y-2 text-sm">
                <p className="text-text-secondary">
                  <span className="text-text-muted">Most people think:</span> {item.mostPeopleThink}
                </p>
                <p className="text-text-secondary">
                  <span className="text-signal">Reality:</span> {item.reality}
                </p>
                <p className="text-text-primary">{item.whyItMatters}</p>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Reveal>
  )
}

import { useRef, useState } from 'react'
import Reveal from '../ui/Reveal'
import SectionHeader from '../ui/SectionHeader'
import { decisions } from '../../data/decisions'

const TONE_CLASSES = {
  indigo: 'text-indigo-text',
  status: 'text-status',
  signal: 'text-signal',
}

const TABS = [
  { key: 'tradeoff', label: 'Trade-off', tension: true },
  { key: 'decision', label: 'Decision', tension: false },
  { key: 'whyItWorked', label: 'Why it worked', tension: false },
  { key: 'reconsider', label: 'Reconsider', tension: true },
]

function DecisionTabs({ decision }) {
  const [active, setActive] = useState(TABS[0].key)
  const tabRefs = useRef([])
  const activeIndex = TABS.findIndex((tab) => tab.key === active)

  const moveFocus = (nextIndex) => {
    const wrapped = (nextIndex + TABS.length) % TABS.length
    setActive(TABS[wrapped].key)
    tabRefs.current[wrapped]?.focus()
  }

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      moveFocus(activeIndex + 1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      moveFocus(activeIndex - 1)
    } else if (event.key === 'Home') {
      event.preventDefault()
      moveFocus(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      moveFocus(TABS.length - 1)
    }
  }

  return (
    <div className="mt-6">
      {/* APG tabs pattern: the tablist container itself stays out of the tab order —
          the tabs inside it carry roving tabIndex. Strict jsx-a11y flags this wrongly. */}
      {/* eslint-disable-next-line jsx-a11y/interactive-supports-focus */}
      <div
        role="tablist"
        aria-labelledby={`${decision.id}-title`}
        onKeyDown={handleKeyDown}
        className="flex flex-wrap gap-2"
      >
        {TABS.map((tab, index) => {
          const selected = tab.key === active
          const selectedClass = tab.tension
            ? 'border-coral text-coral'
            : 'border-indigo-text text-indigo-text'

          return (
            <button
              key={tab.key}
              ref={(node) => {
                tabRefs.current[index] = node
              }}
              type="button"
              role="tab"
              id={`${decision.id}-tab-${tab.key}`}
              aria-selected={selected}
              aria-controls={`${decision.id}-panel-${tab.key}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(tab.key)}
              className={`label inline-flex min-h-[2.75rem] items-center rounded-full border px-4 transition-colors duration-200 ease-signal ${
                selected ? selectedClass : 'border-rule text-text-muted hover:text-text-primary'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {TABS.map((tab) => (
        <div
          key={tab.key}
          role="tabpanel"
          id={`${decision.id}-panel-${tab.key}`}
          aria-labelledby={`${decision.id}-tab-${tab.key}`}
          hidden={tab.key !== active}
          /* APG: a tabpanel with no focusable content should itself be focusable. */
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          tabIndex={0}
          className={`mt-4 min-h-[9.5rem] border-t border-rule pt-4 text-sm leading-relaxed sm:min-h-[13rem] sm:text-base ${
            tab.tension ? 'text-coral' : 'text-text-secondary'
          }`}
        >
          {decision[tab.key]}
        </div>
      ))}
    </div>
  )
}

function DecisionRecord({ decision }) {
  const toneClass = TONE_CLASSES[decision.tone] ?? 'text-status'

  return (
    <article className="card-interactive p-5 sm:p-7">
      <p className="label">{decision.domain}</p>
      <h3
        id={`${decision.id}-title`}
        className="font-display mt-2 text-2xl text-text-primary text-balance"
      >
        {decision.title}
      </h3>
      <p className="mt-4 text-sm text-text-secondary sm:text-base">{decision.context}</p>

      <div className="mt-6 flex flex-wrap items-baseline gap-x-2 gap-y-2 border-t border-rule pt-6">
        <span className={`metric text-2xl ${toneClass}`}>{decision.outcome}</span>
        <span className="label">{decision.outcomeLabel}</span>
      </div>

      <DecisionTabs decision={decision} />
    </article>
  )
}

export default function Decisions() {
  return (
    <section id="decisions" className="section" aria-labelledby="decisions-heading">
      <div className="shell">
        <SectionHeader
          id="decisions-heading"
          index="03"
          title="Decisions I'd defend"
          standfirst="Three records of a call made under a real trade-off, not a résumé bullet with the hard part removed."
        />

        <Reveal>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {decisions.map((decision) => (
              <DecisionRecord key={decision.id} decision={decision} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

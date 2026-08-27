import CountUp from '../ui/CountUp'
import Reveal from '../ui/Reveal'
import SectionHeader from '../ui/SectionHeader'
import { impactMetrics } from '../../data/metrics'

const TONE_CLASSES = {
  indigo: 'text-indigo-text',
  status: 'text-status',
  signal: 'text-signal',
}

function ImpactCell({ metric }) {
  const toneClass = TONE_CLASSES[metric.tone] ?? 'text-indigo-text'
  const isCountable = typeof metric.to === 'number'

  return (
    <div className="relative flex flex-col gap-3 bg-panel p-6">
      {/*
        The signature metric is emphasised with an accent rule, a label and type size — never by
        spanning grid tracks. Six cells divide exactly into both the 2- and 3-column layouts, and
        a spanning cell would leave an empty track showing the grid's hairline background as a
        grey block.
      */}
      {metric.emphasis && (
        <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-route-rule" />
      )}
      <p className="label">{metric.label}</p>
      <p className={`metric text-2xl ${toneClass}`}>
        {isCountable ? (
          <CountUp
            value={metric.value}
            to={metric.to}
            prefix={metric.prefix}
            suffix={metric.suffix}
            decimals={metric.decimals}
          />
        ) : (
          metric.value
        )}
      </p>
      {metric.emphasis && <span className="pill-status self-start">Signature outcome</span>}
      <p className="text-sm text-text-secondary">{metric.context}</p>
      <p className="label mt-auto border-t border-rule pt-3">{metric.source}</p>
    </div>
  )
}

export default function ImpactRail() {
  return (
    <section id="impact" className="section" aria-labelledby="impact-heading">
      <div className="shell">
        <SectionHeader
          id="impact-heading"
          index="01"
          title="Selected impact"
          standfirst="Every number carries its context and the company it came from — read the readout, not just the digit."
        />

        <Reveal>
          <div className="card overflow-hidden">
            <div className="grid grid-cols-1 gap-px bg-rule sm:grid-cols-2 lg:grid-cols-3">
              {impactMetrics.map((metric) => (
                <ImpactCell key={metric.label} metric={metric} />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

import Reveal from '../ui/Reveal'
import SectionHeader from '../ui/SectionHeader'
import { education } from '../../data/experience'
import { shippedCount } from '../../data/shipped'
import heroPhoto from '../../assets/rahul-hero.webp'

const EXPLORING = [
  'Agentic AI workflows',
  'RAG & retrieval',
  'Network tokenization',
  'Payment orchestration',
]

export default function About() {
  return (
    <section id="about" className="section" aria-labelledby="about-heading">
      <div className="shell">
        <SectionHeader
          id="about-heading"
          index="06"
          title="About"
          standfirst="The path from an engineering degree to payments product management to building with AI directly."
        />

        <Reveal className="grid gap-10 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] lg:gap-14">
          <div className="mx-auto w-full max-w-[14rem] overflow-hidden rounded-card border border-rule lg:mx-0">
            <img
              src={heroPhoto}
              alt="Rahul Agarwal"
              width={720}
              height={1082}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="max-w-prose">
            <p className="text-base text-text-secondary">
              I started as an engineer — a computer science degree from IIT Roorkee, then production
              code at Amazon and Infosys before an MBA at IIM Kozhikode became the pivot. I wanted
              to sit closer to the decision, not just the code.
            </p>
            <p className="mt-4 text-base text-text-secondary">
              Everything since has been product, and most of it payments: consumer product at
              Shaadi.com, then integrations and orchestration at Juspay and now Paysecure.
            </p>
            <p className="mt-4 text-base text-text-secondary">
              The same automation instinct that started at Infosys is what pulls me into building
              with AI directly rather than only specifying it — LLM tooling now, SQL pipelines then.
              It adds up to about seven years in tech, across engineering and product, the last four
              of them in payments specifically.
            </p>
            {/*
              Counted from the data layer, not typed in: only entries exposing a link a stranger
              can open are included. See src/data/shipped.js — the previous site claimed "10+"
              against eight actual projects.
            */}
            <p className="mt-4 text-base text-text-secondary">
              <span className="metric text-text-primary">{shippedCount}</span> of those builds are
              on this page with a live demo or a public repository — every one of them is something
              you can open, not something you have to take my word for.
            </p>

            <div className="mt-6">
              <p className="label">Currently exploring</p>
              <ul className="mt-2 flex list-none flex-wrap gap-2">
                {EXPLORING.map((topic) => (
                  <li key={topic} className="pill-indigo">
                    {topic}
                  </li>
                ))}
              </ul>
            </div>

            <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-4 border-t border-rule pt-6">
              {education.map((item) => (
                <div key={item.institution} className="min-w-0">
                  <dt className="label">{item.degree}</dt>
                  <dd className="metric mt-1 text-sm text-text-primary">
                    {item.institution} · {item.period}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

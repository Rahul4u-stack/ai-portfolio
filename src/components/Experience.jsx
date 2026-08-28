import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { experiences } from '../data/experience';
import SectionHeading from './ui/SectionHeading';
import useReducedMotion from '../hooks/useReducedMotion';

function ExperienceCard({ experience }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const prefersReducedMotion = useReducedMotion();
  const hiddenY = prefersReducedMotion ? 0 : 24;

  return (
    <div ref={ref} className="relative md:pl-12">
      {/* Timeline dot — aligned to card header (desktop only) */}
      <div
        className={`hidden md:block absolute left-4 top-9 -translate-x-1/2 w-3 h-3 bg-accent shadow-[0_0_8px_1px_rgba(99,102,241,0.4)] rounded-full border-4 border-surface z-10 ${
          prefersReducedMotion
            ? ''
            : 'before:absolute before:inset-0 before:rounded-full before:bg-accent/40 before:animate-ping'
        }`}
      />

      <motion.div
        initial={{ opacity: 0, y: hiddenY }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: hiddenY }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.6, ease: "easeOut" }}
        className="bg-glass border-border-subtle hover:border-border-muted backdrop-blur-sm rounded-xl2 p-6 md:p-8 border transition-colors duration-300"
      >
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="text-xl font-bold text-text-primary">{experience.company}</h3>
          {experience.period.includes('Present') && (
            <span className="inline-flex items-center gap-1.5 bg-emerald-bg text-emerald text-xs px-2.5 py-0.5 rounded-full font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald" />
              Current
            </span>
          )}
        </div>
        <p className="text-accent-text font-medium mt-1">{experience.role}</p>
        <p className="text-text-muted text-sm mt-1">
          {experience.period} &middot; {experience.location}
        </p>

        <p className="text-text-secondary text-sm md:text-base leading-relaxed mt-4">
          {experience.summary}
        </p>

        <p className="font-mono text-xs uppercase tracking-[0.2em] text-text-muted mt-6 mb-3">
          Key impact
        </p>
        <ul className="space-y-2">
          {experience.highlights.map((highlight) => (
            <li key={highlight} className="text-text-muted text-sm flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}

export default function Experience() {
  return (
    <section id="experience" className="py-20 px-6 bg-surface">
      <div className="max-w-6xl mx-auto">
        <SectionHeading title="Experience" number="02" />

        <div className="relative max-w-4xl mx-auto">
          {/* Rail line (desktop only) */}
          <div className="hidden md:block absolute left-4 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-border-muted" />

          <div className="space-y-8 md:space-y-10">
            {experiences.map((experience) => (
              <ExperienceCard key={experience.company} experience={experience} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

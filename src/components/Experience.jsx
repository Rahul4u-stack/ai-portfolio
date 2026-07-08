import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { experiences } from '../data/experience';
import SectionHeading from './ui/SectionHeading';
import useReducedMotion from '../hooks/useReducedMotion';

function TimelineCard({ experience, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const prefersReducedMotion = useReducedMotion();
  const isLeft = index % 2 === 0;
  const hiddenX = prefersReducedMotion ? 0 : (isLeft ? -60 : 60);

  return (
    <div
      ref={ref}
      className={`relative flex items-center w-full mb-12 ${
        isLeft ? 'md:justify-start' : 'md:justify-end'
      }`}
    >
      {/* Timeline dot — centered on the line (desktop only) */}
      <div
        className={`hidden md:block absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-accent shadow-[0_0_8px_1px_rgba(99,102,241,0.4)] rounded-full border-4 border-surface z-10 ${
          prefersReducedMotion
            ? ''
            : 'before:absolute before:inset-0 before:rounded-full before:bg-accent/40 before:animate-ping'
        }`}
      />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, x: hiddenX }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: hiddenX }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.75, ease: "easeOut" }}
        className={`w-full md:w-[45%] bg-white/[0.05] border-white/[0.08] hover:border-white/[0.16] backdrop-blur-sm rounded-xl2 p-6 border transition-colors duration-300 ${
          isLeft ? 'md:mr-auto' : 'md:ml-auto'
        }`}
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
        <ul className="mt-4 space-y-2">
          {experience.highlights.map((highlight, i) => (
            <li key={i} className="text-text-muted text-sm flex items-start gap-2">
              <span className="text-accent mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-accent inline-block" />
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

        {/* Timeline container */}
        <div className="relative">
          {/* Center line (desktop only) */}
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-white/[0.10]" />

          {experiences.map((experience, index) => (
            <TimelineCard key={index} experience={experience} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

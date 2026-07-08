import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { educationData } from '../data/education';
import SectionHeading from './ui/SectionHeading';
import useReducedMotion from '../hooks/useReducedMotion';

export default function Education() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="education" className="relative py-20 px-6 bg-surface-raised">
      <div className="max-w-6xl mx-auto" ref={sectionRef}>
        <SectionHeading title="Education" number="05" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {educationData.map((item, index) => (
            <motion.div
              key={item.institution}
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : (prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 40 })}
              transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: prefersReducedMotion ? 0 : 0.2 + index * 0.15 }}
              className="bg-white/[0.05] border-white/[0.08] hover:border-white/[0.16] backdrop-blur-sm rounded-xl2 p-8 border transition"
            >
              <span className="text-4xl" role="img" aria-label={item.institution}>
                {item.icon}
              </span>
              <h3 className="text-xl font-bold text-text-primary mt-4">
                {item.institution}
              </h3>
              <p className="text-accent-text text-sm font-medium mt-2">
                {item.degree}
              </p>
              <p className="text-text-muted text-sm mt-2">{item.period}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { frameworks } from '../data/frameworks';
import SectionHeading from './ui/SectionHeading';
import useReducedMotion from '../hooks/useReducedMotion';

function FrameworkCard({ framework, cardVariants }) {
  return (
    <motion.div
      variants={cardVariants}
      className="border border-white/[0.08] hover:border-white/[0.16] transition-colors duration-300 bg-white/[0.05] backdrop-blur-sm rounded-xl2 p-6"
    >
      <h3 className="text-lg font-bold text-text-primary mb-4">{framework.title}</h3>

      <div className="space-y-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-text-muted mb-1">
            Most people think
          </p>
          <p className="text-text-muted text-sm">{framework.mostPeopleThink}</p>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-text-muted mb-1">
            Reality
          </p>
          <p className="text-text-secondary text-sm">{framework.reality}</p>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-text-muted mb-1">
            Why it matters
          </p>
          <p className="text-text-secondary text-sm">{framework.whyItMatters}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Frameworks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.18,
      },
    },
  };

  const cardVariants = {
    hidden: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReducedMotion ? 0 : 0.65, ease: 'easeOut' },
    },
  };

  return (
    <section id="frameworks" className="relative py-20 px-6 bg-surface-raised">
      <div className="max-w-6xl mx-auto">
        <SectionHeading title="How I Think" number="06" />

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {frameworks.map((framework) => (
            <FrameworkCard key={framework.title} framework={framework} cardVariants={cardVariants} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { skillCategories as categories } from '../data/skills';
import SectionHeading from './ui/SectionHeading';
import useReducedMotion from '../hooks/useReducedMotion';

function SkillCard({ category, cardVariants }) {
  return (
    <motion.div
      variants={cardVariants}
      className="bg-surface-raised rounded-xl2 p-6 border border-border-subtle hover:border-accent/50 transition-colors duration-300"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl" role="img" aria-label={category.title}>
          {category.icon}
        </span>
        <h3 className="text-lg font-semibold text-text-primary">{category.title}</h3>
      </div>

      {/* Skill pills */}
      <div className="flex flex-wrap gap-2">
        {category.skills.map((skill) => (
          <span
            key={skill}
            className="font-mono text-xs px-2 py-1 rounded border border-accent/20 text-text-secondary bg-surface-elevated/50"
          >
            {skill}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export default function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.1
      }
    }
  };

  const cardVariants = {
    hidden: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReducedMotion ? 0 : 0.45, ease: "easeOut" }
    }
  };

  return (
    <section id="skills" className="py-20 px-6 bg-surface">
      <div className="max-w-6xl mx-auto">
        <SectionHeading title="Skills" number="04" />

        {/* Skills grid */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {categories.map((category) => (
            <SkillCard key={category.title} category={category} cardVariants={cardVariants} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

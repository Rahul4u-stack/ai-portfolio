import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { skillCategories as categories } from '../data/skills';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" }
  }
};

function SkillCard({ category }) {
  return (
    <motion.div
      variants={cardVariants}
      className="bg-[#1e293b] rounded-xl p-6 border border-slate-700 hover:border-blue-500/50 transition-colors duration-300"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl" role="img" aria-label={category.title}>
          {category.icon}
        </span>
        <h3 className="text-lg font-semibold text-slate-50">{category.title}</h3>
      </div>

      {/* Skill pills */}
      <div className="flex flex-wrap gap-2">
        {category.skills.map((skill) => (
          <span
            key={skill}
            className="bg-blue-500/10 text-blue-400 text-sm px-3 py-1 rounded-full"
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

  return (
    <section id="skills" className="py-20 px-6 bg-[#0f172a]">
      <div className="max-w-6xl mx-auto">
        {/* Section heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-slate-50 mb-4">
          Skills
        </h2>
        <div className="w-20 h-1 bg-blue-500 rounded mb-12" />

        {/* Skills grid */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {categories.map((category) => (
            <SkillCard key={category.title} category={category} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

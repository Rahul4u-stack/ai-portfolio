import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { educationData } from '../data/education';

export default function Education() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section id="education" className="py-20 px-6 bg-[#0f172a]">
      <div className="max-w-6xl mx-auto" ref={sectionRef}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-50 mb-4">
            Education
          </h2>
          <div className="w-20 h-1 bg-blue-500 rounded mb-12" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {educationData.map((item, index) => (
            <motion.div
              key={item.institution}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
              className="bg-[#1e293b] rounded-xl p-8 border border-slate-700 hover:border-blue-500/50 transition"
            >
              <span className="text-4xl" role="img" aria-label={item.institution}>
                {item.icon}
              </span>
              <h3 className="text-xl font-bold text-slate-50 mt-4">
                {item.institution}
              </h3>
              <p className="text-blue-500 text-sm font-medium mt-2">
                {item.degree}
              </p>
              <p className="text-slate-400 text-sm mt-2">{item.period}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaExternalLinkAlt, FaGithub } from 'react-icons/fa';
import { projects } from '../data/projects';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

function ProjectCard({ project }) {
  return (
    <motion.div
      variants={cardVariants}
      className="bg-[#1e293b] rounded-xl overflow-hidden border border-slate-700 hover:border-blue-500 transition-all duration-300 flex flex-col"
    >
      {/* Icon header */}
      <div className="h-40 flex items-center justify-center bg-gradient-to-br from-blue-500/10 to-purple-500/10">
        <span className="text-5xl" role="img" aria-label={project.title}>
          {project.icon}
        </span>
      </div>

      {/* Card body */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-slate-50">{project.title}</h3>
        <p className="text-blue-500 text-sm font-medium mb-3">{project.subtitle}</p>
        <p className="text-slate-400 text-sm mb-4">{project.description}</p>

        {/* Highlight badge */}
        <span className="inline-block bg-blue-500/10 text-blue-400 text-xs px-3 py-1 rounded-full mb-4 self-start">
          {project.highlight}
        </span>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          {project.tech.map((t) => (
            <span
              key={t}
              className="bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Spacer pushes links to bottom */}
        <div className="mt-auto flex items-center gap-4">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-blue-500 transition-colors duration-200 flex items-center gap-1.5 text-sm"
            >
              <FaGithub className="text-lg" />
              <span>Code</span>
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-blue-500 transition-colors duration-200 flex items-center gap-1.5 text-sm"
            >
              <FaExternalLinkAlt />
              <span>Live</span>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="projects" className="py-20 px-6 bg-[#0f172a]">
      <div className="max-w-6xl mx-auto">
        {/* Section heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-slate-50 mb-4">
          Projects
        </h2>
        <div className="w-20 h-1 bg-blue-500 rounded mb-12" />

        {/* Project grid */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {projects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

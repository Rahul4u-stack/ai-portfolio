import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaExternalLinkAlt, FaGithub } from 'react-icons/fa';
import { projects } from '../data/projects';
import SectionHeading from './ui/SectionHeading';
import GameEmbed from './ui/GameEmbed';
import useReducedMotion from '../hooks/useReducedMotion';

function useMotionVariants(prefersReducedMotion) {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReducedMotion ? 0 : 0.5, ease: 'easeOut' },
    },
  };

  return { containerVariants, cardVariants };
}

function ProjectLinks({ project }) {
  return (
    <div className="mt-auto flex items-center gap-4">
      {project.github && (
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-text-muted hover:text-accent transition-colors duration-200 flex items-center gap-1.5 text-sm"
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
          className="text-text-muted hover:text-accent transition-colors duration-200 flex items-center gap-1.5 text-sm"
        >
          <FaExternalLinkAlt />
          <span>Live</span>
        </a>
      )}
    </div>
  );
}

function FeaturedProjectCard({ project, cardVariants }) {
  return (
    <motion.div
      variants={cardVariants}
      className="md:col-span-2 lg:col-span-2 lg:row-span-2 p-[1px] rounded-xl2 bg-gradient-to-br from-accent-from/0 to-accent-to/0 hover:from-accent-from hover:to-accent-to transition-colors duration-300 hover:-translate-y-1"
    >
      <div className="relative before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-white/5 bg-surface-raised rounded-[calc(1.25rem-1px)] overflow-hidden flex flex-col md:flex-row lg:flex-col h-full">
        <div className="md:w-2/5 lg:w-full p-6 flex flex-col">
          {project.embedUrl ? (
            <GameEmbed
              embedUrl={project.embedUrl}
              coverImage={project.coverImage}
              title={project.title}
            />
          ) : (
            <div className="h-40 md:h-full lg:h-40 flex items-center justify-center bg-gradient-to-br from-accent-from/10 to-accent-to/10 rounded-lg">
              <span className="text-5xl" role="img" aria-label={project.title}>
                {project.icon}
              </span>
            </div>
          )}
        </div>

        <div className="p-6 flex flex-col flex-1">
          <span className="inline-block bg-accent/10 text-accent text-xs px-3 py-1 rounded-full mb-3 self-start font-medium">
            Featured
          </span>
          <h3 className="text-xl font-bold text-text-primary">{project.title}</h3>
          <p className="text-accent text-sm font-medium mb-3">{project.subtitle}</p>
          <p className="text-text-muted text-sm mb-4">{project.description}</p>

          <p className="text-text-secondary text-sm font-semibold mb-4">
            {project.highlight}
          </p>

          <div className="flex flex-wrap gap-2 mb-5">
            {project.tech.map((t) => (
              <span
                key={t}
                className="font-mono text-xs px-2 py-1 rounded border border-accent/20 text-text-secondary bg-surface-elevated/50"
              >
                {t}
              </span>
            ))}
          </div>

          <ProjectLinks project={project} />
        </div>
      </div>
    </motion.div>
  );
}

function ProjectCard({ project, cardVariants }) {
  return (
    <motion.div
      variants={cardVariants}
      className="p-[1px] rounded-xl2 bg-gradient-to-br from-accent-from/0 to-accent-to/0 hover:from-accent-from hover:to-accent-to transition-colors duration-300 hover:-translate-y-1"
    >
      <div className="relative before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-white/5 bg-surface-raised rounded-[calc(1.25rem-1px)] overflow-hidden flex flex-col h-full">
        {/* Icon header */}
        <div className="h-40 flex items-center justify-center bg-gradient-to-br from-accent-from/10 to-accent-to/10">
          <span className="text-5xl" role="img" aria-label={project.title}>
            {project.icon}
          </span>
        </div>

        {/* Card body */}
        <div className="p-6 flex flex-col flex-1">
          <h3 className="text-xl font-bold text-text-primary">{project.title}</h3>
          <p className="text-accent text-sm font-medium mb-3">{project.subtitle}</p>
          <p className="text-text-muted text-sm mb-4">{project.description}</p>

          {/* Highlight badge */}
          <span className="inline-block bg-accent/10 text-accent text-xs px-3 py-1 rounded-full mb-4 self-start">
            {project.highlight}
          </span>

          {/* Tech tags */}
          <div className="flex flex-wrap gap-2 mb-5">
            {project.tech.map((t) => (
              <span
                key={t}
                className="font-mono text-xs px-2 py-1 rounded border border-accent/20 text-text-secondary bg-surface-elevated/50"
              >
                {t}
              </span>
            ))}
          </div>

          <ProjectLinks project={project} />
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();
  const { containerVariants, cardVariants } = useMotionVariants(prefersReducedMotion);

  const featuredProjects = projects.filter((p) => p.featured);
  const restProjects = projects.filter((p) => !p.featured);

  return (
    <section id="projects" className="py-20 px-6 bg-surface-raised">
      <div className="max-w-6xl mx-auto">
        <SectionHeading title="Projects" number="03" />

        {/* Project grid */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:auto-rows-[minmax(280px,auto)] gap-6"
        >
          {featuredProjects.map((project) => (
            <FeaturedProjectCard
              key={project.title}
              project={project}
              cardVariants={cardVariants}
            />
          ))}
          {restProjects.map((project) => (
            <ProjectCard key={project.title} project={project} cardVariants={cardVariants} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
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

function ProjectLinks({ project, className = 'mt-auto' }) {
  return (
    <div className={`${className} flex items-center gap-4 shrink-0`}>
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
      {project.caseStudy && (
        <Link
          to={`/case-study/${project.caseStudy}`}
          className="text-text-muted hover:text-accent transition-colors duration-200 flex items-center gap-1.5 text-sm"
        >
          <span>Case Study</span>
        </Link>
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
        <div className="md:w-2/5 lg:w-full p-6 flex flex-col lg:flex-1">
          {project.embedUrl ? (
            <GameEmbed
              embedUrl={project.embedUrl}
              coverImage={project.coverImage}
              title={project.title}
            />
          ) : (
            <div className="h-40 md:h-full lg:h-auto lg:flex-1 flex items-center justify-center bg-gradient-to-br from-accent-from/10 to-accent-to/10 rounded-lg">
              <span className="text-5xl lg:text-8xl" role="img" aria-label={project.title}>
                {project.icon}
              </span>
            </div>
          )}
        </div>

        <div className="p-6 flex flex-col flex-1 lg:flex-none">
          <span className="inline-block bg-accent/10 text-accent text-xs px-3 py-1 rounded-full mb-3 self-start font-medium">
            Featured
          </span>
          <h3 className="text-xl font-bold text-text-primary">{project.title}</h3>
          <p className="text-accent text-sm font-medium mb-3">{project.subtitle}</p>
          <p className="text-text-muted text-sm mb-4">{project.description}</p>

          <p className="text-text-secondary text-sm font-semibold mb-2">
            {project.highlight}
          </p>

          <p className="font-mono text-accent text-xs mb-4">{project.metric}</p>

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

function CompactProjectRow({ project, cardVariants }) {
  return (
    <motion.div
      variants={cardVariants}
      className="p-[1px] rounded-xl2 bg-gradient-to-br from-accent-from/0 to-accent-to/0 hover:from-accent-from hover:to-accent-to transition-colors duration-300"
    >
      <div className="relative before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-white/5 bg-surface-raised rounded-[calc(1.25rem-1px)] p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
        <span className="text-3xl shrink-0" role="img" aria-label={project.title}>
          {project.icon}
        </span>

        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-text-primary">{project.title}</h3>
          <p className="text-text-muted text-sm">{project.description}</p>
          <p className="font-mono text-accent text-xs mt-1">{project.metric}</p>
        </div>

        <ProjectLinks project={project} className="" />
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

        {/* Featured project grid */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:auto-rows-[minmax(280px,auto)] gap-6"
        >
          {featuredProjects.map((project) => (
            <FeaturedProjectCard
              key={project.title}
              project={project}
              cardVariants={cardVariants}
            />
          ))}
        </motion.div>

        {/* Compact list for the rest */}
        {restProjects.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="mt-6 flex flex-col gap-4"
          >
            {restProjects.map((project) => (
              <CompactProjectRow
                key={project.title}
                project={project}
                cardVariants={cardVariants}
              />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}

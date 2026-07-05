import { motion } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import { socialLinks } from '../data/social'
import useReducedMotion from '../hooks/useReducedMotion'

export default function Hero() {
  const prefersReducedMotion = useReducedMotion()
  const location = useLocation()
  const navigate = useNavigate()

  const handleScroll = (e, href) => {
    e.preventDefault()
    if (location.pathname !== '/') {
      navigate('/' + href)
      return
    }
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: prefersReducedMotion
        ? { duration: 0 }
        : {
            staggerChildren: 0.08,
            delayChildren: 0.1,
          },
    },
  }

  const itemVariants = {
    hidden: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReducedMotion ? 0 : 0.45, ease: 'easeOut' },
    },
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-surface">
      {/* Radial gradient background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-from/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-accent-to/5 rounded-full blur-[80px]" />
      </div>

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center px-4 max-w-4xl mx-auto"
      >
        {/* Greeting */}
        <motion.p
          variants={itemVariants}
          className="text-xs font-mono uppercase tracking-[0.2em] text-accent mb-4"
        >
          Hello, I'm
        </motion.p>

        {/* Name */}
        <motion.h1
          variants={itemVariants}
          className="text-6xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight text-text-primary mb-6"
        >
          Rahul Agarwal
        </motion.h1>

        {/* Static role headline with gradient accent */}
        <motion.p
          variants={itemVariants}
          className={`text-2xl md:text-3xl mb-6 bg-gradient-to-r from-accent-from to-accent-to bg-clip-text text-transparent font-semibold ${
            prefersReducedMotion ? '' : 'bg-[length:200%_auto] animate-gradient-x'
          }`}
        >
          Product Manager &amp; AI Builder
        </motion.p>

        {/* One-liner */}
        <motion.p
          variants={itemVariants}
          className="text-text-muted text-lg md:text-xl mb-10 max-w-2xl mx-auto"
        >
          Building the future of payments with AI
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <a
            href="#projects"
            onClick={(e) => handleScroll(e, '#projects')}
            className="px-8 py-3 bg-accent hover:bg-accent-hover text-surface font-medium rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-glow-accent w-full sm:w-auto text-center"
          >
            View Projects
          </a>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 border border-accent text-accent hover:bg-accent/10 font-medium rounded-lg transition-all duration-300 w-full sm:w-auto text-center"
          >
            Download Resume
          </a>
        </motion.div>

        {/* Social Icons */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center gap-6"
        >
          {socialLinks.map((link) => {
            const Icon = link.icon
            const isMail = link.href.startsWith('mailto')
            return (
              <a
                key={link.label}
                href={link.href}
                target={isMail ? undefined : '_blank'}
                rel={isMail ? undefined : 'noopener noreferrer'}
                className="text-text-muted hover:text-accent transition-colors duration-300"
                aria-label={link.label}
              >
                <Icon size={24} />
              </a>
            )
          })}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: prefersReducedMotion ? 0 : 1.2, duration: prefersReducedMotion ? 0 : 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={prefersReducedMotion ? {} : { opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-muted">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-accent to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  )
}

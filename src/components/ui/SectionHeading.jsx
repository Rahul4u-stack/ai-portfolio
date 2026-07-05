import { motion } from 'framer-motion'
import useReducedMotion from '../../hooks/useReducedMotion'

export default function SectionHeading({ title, number, align = 'left', className = '' }) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.7, ease: 'easeOut' }}
      className={`relative ${align === 'center' ? 'text-center' : ''} mb-16 ${className}`}
    >
      {number && (
        <span
          aria-hidden="true"
          className="block font-mono text-xs uppercase tracking-[0.3em] text-warm-text mb-3"
        >
          {number}
        </span>
      )}
      <h2 className="relative text-4xl font-display font-bold text-text-primary mb-4">
        {title}
      </h2>
      <div
        className={`relative w-20 h-1 rounded-full bg-accent ${
          align === 'center' ? 'mx-auto' : ''
        }`}
      />
    </motion.div>
  )
}

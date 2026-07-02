import { motion } from 'framer-motion'
import useReducedMotion from '../../hooks/useReducedMotion'

export default function SectionHeading({ title, number, align = 'left', className = '' }) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
      className={`relative ${align === 'center' ? 'text-center' : ''} mb-16 ${className}`}
    >
      {number && (
        <span
          aria-hidden="true"
          className={`absolute -top-8 ${align === 'center' ? 'left-1/2 -translate-x-1/2' : 'left-0'} text-[6rem] md:text-[8rem] font-display font-bold leading-none text-transparent select-none pointer-events-none`}
          style={{ WebkitTextStroke: '1px rgba(247,246,248,0.06)' }}
        >
          {number}
        </span>
      )}
      <h2 className="relative text-4xl font-display font-bold text-text-primary mb-4">
        {title}
      </h2>
      <div
        className={`relative w-20 h-1 rounded-full bg-gradient-to-r from-accent-from to-accent-to ${
          align === 'center' ? 'mx-auto' : ''
        }`}
      />
    </motion.div>
  )
}

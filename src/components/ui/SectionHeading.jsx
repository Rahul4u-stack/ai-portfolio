import { motion } from 'framer-motion'
import useReducedMotion from '../../hooks/useReducedMotion'

export default function SectionHeading({ title, align = 'left', className = '' }) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
      className={`${align === 'center' ? 'text-center' : ''} mb-16 ${className}`}
    >
      <h2 className="text-4xl font-display font-bold text-text-primary mb-4">
        {title}
      </h2>
      <div
        className={`w-20 h-1 rounded-full bg-gradient-to-r from-accent-from to-accent-to ${
          align === 'center' ? 'mx-auto' : ''
        }`}
      />
    </motion.div>
  )
}

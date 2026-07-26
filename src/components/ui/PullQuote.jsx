import { motion } from 'framer-motion'
import useReducedMotion from '../../hooks/useReducedMotion'

export default function PullQuote({ quote }) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section className="py-16 px-6" aria-label="Pull quote">
      <motion.blockquote
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.7, ease: 'easeOut' }}
        className="max-w-4xl mx-auto text-center font-display font-semibold text-3xl md:text-4xl text-text-primary leading-snug"
      >
        &ldquo;{quote}&rdquo;
      </motion.blockquote>
    </section>
  )
}

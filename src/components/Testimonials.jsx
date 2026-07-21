import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import SectionHeading from './ui/SectionHeading'
import useReducedMotion from '../hooks/useReducedMotion'
import { SHOW_TESTIMONIALS, testimonials } from '../data/testimonials'

function getInitials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function TestimonialCard({ testimonial, index, isInView, prefersReducedMotion }) {
  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: prefersReducedMotion ? 0 : index * 0.12 }}
      className="bg-white/[0.05] border-white/[0.08] hover:border-white/[0.16] backdrop-blur-sm rounded-xl2 p-6 border transition-colors duration-300"
    >
      <p className="text-text-muted text-sm leading-relaxed mb-6">&ldquo;{testimonial.quote}&rdquo;</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-accent/20 text-accent-text flex items-center justify-center text-sm font-semibold shrink-0">
          {getInitials(testimonial.name)}
        </div>
        <div>
          <p className="text-text-primary font-medium text-sm">{testimonial.name}</p>
          <p className="text-text-muted text-xs">
            {testimonial.title} &middot; {testimonial.company}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default function Testimonials() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  const prefersReducedMotion = useReducedMotion()

  if (!SHOW_TESTIMONIALS || testimonials.length === 0) return null

  return (
    <section id="testimonials" ref={sectionRef} className="py-20 px-6 bg-surface-raised">
      <div className="max-w-6xl mx-auto">
        <SectionHeading title="What colleagues say" align="center" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.name}
              testimonial={testimonial}
              index={index}
              isInView={isInView}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

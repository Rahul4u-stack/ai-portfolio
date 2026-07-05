import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import SectionHeading from './ui/SectionHeading'
import useReducedMotion from '../hooks/useReducedMotion'
import heroPhoto from '../assets/rahul-hero.webp'

const stats = [
  { label: 'Years Experience', value: 7, suffix: '+' },
  { label: 'GMV Managed', value: 3.4, suffix: 'M+', prefix: '$', decimals: 1 },
  { label: 'Integrations Led', value: 300, suffix: '+' },
  { label: 'Companies', value: 5, suffix: '' },
]

function AnimatedCounter({ value, suffix = '', prefix = '', decimals = 0, inView }) {
  const [count, setCount] = useState(value)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (!inView || prefersReducedMotion) return

    const end = value
    const duration = 2000
    const startTime = performance.now()

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = eased * end

      setCount(current)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [inView, value, prefersReducedMotion])

  const display = decimals > 0 ? count.toFixed(decimals) : Math.floor(count)

  return (
    <span>
      {prefix}
      {display}
      {suffix}
    </span>
  )
}

export default function About() {
  const sectionRef = useRef(null)
  const statsRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  const statsInView = useInView(statsRef, { once: true, margin: '-50px' })
  const prefersReducedMotion = useReducedMotion()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: prefersReducedMotion
        ? { duration: 0 }
        : {
            staggerChildren: 0.2,
            delayChildren: 0.1,
          },
    },
  }

  const itemVariants = {
    hidden: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReducedMotion ? 0 : 0.6, ease: 'easeOut' },
    },
  }

  return (
    <section id="about" className="py-20 px-6 bg-surface-raised">
      <div className="max-w-7xl mx-auto">
        <SectionHeading title="About Me" number="01" align="center" />

        {/* Two-column layout */}
        <motion.div
          ref={sectionRef}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-2 gap-12 md:gap-16 items-center mb-20"
        >
          {/* Left: Profile Photo */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <div className="relative">
              {/* Accent glow behind photo */}
              <div className="absolute -inset-2 bg-accent/20 rounded-2xl blur-xl" />
              <div className="relative rounded-2xl overflow-hidden border-2 border-accent/30 shadow-2xl shadow-glow-accent">
                <img
                  src={heroPhoto}
                  alt="Rahul Agarwal, Technical Product Manager"
                  width={480}
                  height={480}
                  loading="eager"
                  className="w-72 h-72 md:w-80 md:h-80 object-cover"
                />
              </div>
            </div>
          </motion.div>

          {/* Right: Bio Text */}
          <motion.div variants={containerVariants} className="space-y-5">
            <motion.p
              variants={itemVariants}
              className="text-text-muted text-lg leading-relaxed"
            >
              I'm a Technical Product Manager with nearly 7 years of experience
              building and scaling API-first payments products across B2B and B2C
              in the Fintech space.
            </motion.p>
            <motion.p
              variants={itemVariants}
              className="text-text-muted text-lg leading-relaxed"
            >
              My journey spans Amazon, Infosys, Shaadi.com, Juspay, and now
              Paysecure — where I've led 300+ payment integrations across SEA,
              MENA, and global markets.
            </motion.p>
            <motion.p
              variants={itemVariants}
              className="text-text-muted text-lg leading-relaxed"
            >
              What sets me apart is my hands-on approach to AI. I use LLMs like
              Claude, ChatGPT, and Gemini to automate complex workflows —
              reducing integration turnaround times from weeks to days. I also
              build AI-powered products like Smart Pantry in my spare time.
            </motion.p>
            <motion.p
              variants={itemVariants}
              className="text-text-muted text-lg leading-relaxed"
            >
              IIT Roorkee (CS) + IIM Kozhikode (MBA) — I bridge the gap between
              technology and business.
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Stats Grid */}
        <div ref={statsRef}>
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 30 }}
            animate={statsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: prefersReducedMotion ? 0 : index * 0.1 }}
                className="bg-surface-raised rounded-xl2 p-6 text-center border border-border-subtle hover:border-accent/30 transition-colors duration-300"
              >
                <div className="text-3xl font-bold text-accent mb-2">
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    prefix={stat.prefix || ''}
                    decimals={stat.decimals || 0}
                    inView={statsInView}
                  />
                </div>
                <div className="text-text-muted text-sm font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

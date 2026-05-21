import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const stats = [
  { label: 'Years Experience', value: 7, suffix: '+' },
  { label: 'GMV Managed', value: 3.4, suffix: 'M+', prefix: '$', decimals: 1 },
  { label: 'Integrations Led', value: 300, suffix: '+' },
  { label: 'Companies', value: 5, suffix: '' },
]

function AnimatedCounter({ value, suffix = '', prefix = '', decimals = 0, inView }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return

    let start = 0
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
  }, [inView, value])

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  }

  return (
    <section id="about" className="py-20 md:py-28 bg-[#0f172a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-50 mb-4">
            About Me
          </h2>
          <div className="w-20 h-1 bg-blue-500 mx-auto rounded-full" />
        </motion.div>

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
              {/* Blue glow behind photo */}
              <div className="absolute -inset-2 bg-blue-500/20 rounded-2xl blur-xl" />
              <div className="relative rounded-2xl overflow-hidden border-2 border-blue-500/30 shadow-2xl shadow-blue-500/10">
                <img
                  src="/profile.jpg"
                  alt="Rahul Agarwal"
                  className="w-72 h-72 md:w-80 md:h-80 object-cover"
                />
              </div>
            </div>
          </motion.div>

          {/* Right: Bio Text */}
          <motion.div variants={containerVariants} className="space-y-5">
            <motion.p
              variants={itemVariants}
              className="text-slate-400 text-lg leading-relaxed"
            >
              I'm a Technical Product Manager with nearly 7 years of experience
              building and scaling API-first payments products across B2B and B2C
              in the Fintech space.
            </motion.p>
            <motion.p
              variants={itemVariants}
              className="text-slate-400 text-lg leading-relaxed"
            >
              My journey spans Amazon, Infosys, Shaadi.com, Juspay, and now
              Paysecure — where I've led 300+ payment integrations across SEA,
              MENA, and global markets.
            </motion.p>
            <motion.p
              variants={itemVariants}
              className="text-slate-400 text-lg leading-relaxed"
            >
              What sets me apart is my hands-on approach to AI. I use LLMs like
              Claude, ChatGPT, and Gemini to automate complex workflows —
              reducing integration turnaround times from weeks to days. I also
              build AI-powered products like Smart Pantry in my spare time.
            </motion.p>
            <motion.p
              variants={itemVariants}
              className="text-slate-400 text-lg leading-relaxed"
            >
              IIT Roorkee (CS) + IIM Kozhikode (MBA) — I bridge the gap between
              technology and business.
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Stats Grid */}
        <div ref={statsRef}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={statsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[#1e293b] rounded-xl p-6 text-center border border-slate-700/50 hover:border-blue-500/30 transition-colors duration-300"
              >
                <div className="text-3xl md:text-4xl font-bold text-blue-500 mb-2">
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    prefix={stat.prefix || ''}
                    decimals={stat.decimals || 0}
                    inView={statsInView}
                  />
                </div>
                <div className="text-slate-400 text-sm font-medium">
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

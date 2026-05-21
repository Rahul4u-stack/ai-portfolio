import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const experiences = [
  {
    company: "Paysecure Technologies",
    role: "Product Manager",
    period: "Mar 2025 – Present",
    location: "Remote",
    highlights: [
      "Led 300+ end-to-end integrations with global PSPs, acquirers, and networks",
      "Automated gateway integrations using LLMs (Claude, ChatGPT, Gemini), reducing turnaround from 2 weeks to 2 days",
      "Documented 10+ PRDs covering GooglePay, ApplePay, recurring payments, and crypto on-ramp/off-ramp solutions",
      "Revamped 10+ developer documentation modules, reducing merchant integration errors by 20%"
    ]
  },
  {
    company: "Juspay Technologies",
    role: "Technical Product Manager",
    period: "Aug 2022 – Feb 2025",
    location: "Bangalore, India",
    highlights: [
      "Orchestrated global payment integrations ($3.4M GMV) across SEA and MENA regions",
      "Delivered 5+ B2B SaaS payment features across 10+ payment methods, achieving 5% increase in Success Rate",
      "Authored 20+ RCAs and executed 50+ actions, ensuring 99.9% uptime"
    ]
  },
  {
    company: "Shaadi.com",
    role: "Associate Product Manager",
    period: "Jun 2021 – Aug 2022",
    location: "Mumbai, India",
    highlights: [
      "Conducted 150+ user calls and 12 surveys, boosting user engagement by 5%",
      "Spearheaded integration of 3 new features, driving 15% growth in DAU"
    ]
  },
  {
    company: "Infosys Ltd.",
    role: "Specialist Programmer",
    period: "Jun 2017 – Apr 2019",
    location: "Pune, India",
    highlights: [
      "Automated report generation parsing 1M+ SQL query logs, reducing man-hours from 8 hours to 15 mins"
    ]
  },
  {
    company: "Amazon",
    role: "Software Development Engineer Intern",
    period: "May 2016 – Jul 2016",
    location: "Hyderabad, India",
    highlights: [
      "Migrated Amazon's Delivery Rule Portal using Java Spring MVC, reducing system downtime by 30%"
    ]
  }
];

function TimelineCard({ experience, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const isLeft = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={`relative flex items-center w-full mb-12 ${
        isLeft ? 'md:justify-start' : 'md:justify-end'
      }`}
    >
      {/* Timeline dot — centered on the line (desktop only) */}
      <div className="hidden md:block absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full border-4 border-[#0f172a] z-10" />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isLeft ? -60 : 60 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`w-full md:w-[45%] bg-[#1e293b] rounded-xl p-6 border border-slate-700 hover:border-blue-500/50 transition-colors duration-300 ${
          isLeft ? 'md:mr-auto' : 'md:ml-auto'
        }`}
      >
        <h3 className="text-xl font-bold text-slate-50">{experience.company}</h3>
        <p className="text-blue-500 font-medium mt-1">{experience.role}</p>
        <p className="text-slate-400 text-sm mt-1">
          {experience.period} &middot; {experience.location}
        </p>
        <ul className="mt-4 space-y-2">
          {experience.highlights.map((highlight, i) => (
            <li key={i} className="text-slate-400 text-sm flex items-start gap-2">
              <span className="text-blue-500 mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}

export default function Experience() {
  return (
    <section id="experience" className="py-20 px-6 bg-[#0f172a]">
      <div className="max-w-6xl mx-auto">
        {/* Section heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-slate-50 mb-4">
          Experience
        </h2>
        <div className="w-20 h-1 bg-blue-500 rounded mb-12" />

        {/* Timeline container */}
        <div className="relative">
          {/* Center line (desktop only) */}
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-blue-500/30" />

          {experiences.map((experience, index) => (
            <TimelineCard key={index} experience={experience} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

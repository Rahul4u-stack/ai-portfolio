import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { socialLinks, CONTACT_EMAIL } from '../data/social';
import SectionHeading from './ui/SectionHeading';
import useReducedMotion from '../hooks/useReducedMotion';

const contactLinks = [
  ...socialLinks.map((link) => ({
    icon: link.icon,
    label: link.label === 'Email' ? CONTACT_EMAIL : `${link.label} Profile`,
    href: link.href,
  })),
  {
    icon: FaMapMarkerAlt,
    label: 'Jaipur, India',
    href: null,
  },
];

export default function Contact() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const prefersReducedMotion = useReducedMotion();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const subject = encodeURIComponent(
      `Portfolio Contact from ${formData.name}`
    );
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 3000);
  };

  const inputClasses =
    'bg-surface-elevated border border-border-subtle rounded-lg px-4 py-3 text-text-primary focus:border-accent focus:ring-2 focus:ring-accent/40 focus:outline-none transition w-full placeholder:text-text-muted';

  return (
    <section id="contact" className="py-20 px-6 bg-surface">
      <div className="max-w-2xl mx-auto" ref={sectionRef}>
        <SectionHeading
          title="Let's Connect"
          number="06"
          className="mb-6"
        />
        <motion.p
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : (prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 30 })}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
          className="text-text-muted mb-12"
        >
          I'm always open to discussing product management, AI, payments, or
          potential collaborations.
        </motion.p>

        <motion.form
          onSubmit={handleSubmit}
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : (prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 40 })}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: prefersReducedMotion ? 0 : 0.2 }}
          className="space-y-5"
        >
          <div>
            <label htmlFor="contact-name" className="sr-only">
              Name
            </label>
            <input
              id="contact-name"
              type="text"
              name="name"
              placeholder="Your Name"
              required
              value={formData.name}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="contact-email" className="sr-only">
              Email
            </label>
            <input
              id="contact-email"
              type="email"
              name="email"
              placeholder="Your Email"
              required
              value={formData.email}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="contact-message" className="sr-only">
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows={4}
              placeholder="Your Message"
              required
              value={formData.message}
              onChange={handleChange}
              className={`${inputClasses} resize-none`}
            />
          </div>

          <div>
            <button
              type="submit"
              className="bg-accent-hover hover:brightness-110 text-white font-medium py-3 px-8 rounded-lg transition"
            >
              {submitted ? 'Opening email client...' : 'Send Message'}
            </button>
          </div>
        </motion.form>

        {/* Divider */}
        <div className="h-px bg-white/[0.08] my-12" />

        {/* Contact Links */}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : (prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 30 })}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: prefersReducedMotion ? 0 : 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {contactLinks.map((link) => {
            const Icon = link.icon;
            const content = (
              <span className="flex items-center gap-3 text-text-muted hover:text-accent-text transition">
                <Icon className="text-lg flex-shrink-0" />
                <span className="text-sm">{link.label}</span>
              </span>
            );

            return link.href ? (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith('mailto') ? undefined : '_blank'}
                rel={link.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
              >
                {content}
              </a>
            ) : (
              <div key={link.label}>{content}</div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

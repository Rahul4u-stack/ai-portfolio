import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaRegCopy, FaPaperPlane, FaCheck } from 'react-icons/fa';
import { findMeOnLinks, CONTACT_EMAIL, CONTACT_PHONE, FORMSPREE_ID } from '../data/social';
import SectionHeading from './ui/SectionHeading';
import AvailabilityBadge from './ui/AvailabilityBadge';
import useReducedMotion from '../hooks/useReducedMotion';

export default function Contact() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const prefersReducedMotion = useReducedMotion();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  // idle | sending | sent | mailto | error
  const [formStatus, setFormStatus] = useState('idle');
  // null | 'email' | 'phone'
  const [copied, setCopied] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCopy = async (text, key) => {
    // Fall back to execCommand whenever the Clipboard API path fails for any
    // reason (missing, or present but permission-denied) rather than only when
    // it's entirely absent, so a rejected writeText() doesn't silently no-op.
    let copiedOk = false;

    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(text);
        copiedOk = true;
      } catch {
        copiedOk = false;
      }
    }

    if (!copiedOk) {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        copiedOk = document.execCommand('copy');
        document.body.removeChild(textArea);
      } catch {
        copiedOk = false;
      }
    }

    if (copiedOk) {
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const subjectLine = formData.subject || `Portfolio Contact from ${formData.name}`;

    if (!FORMSPREE_ID) {
      const subject = encodeURIComponent(subjectLine);
      const body = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
      );
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;

      setFormStatus('mailto');
      setTimeout(() => {
        setFormStatus('idle');
        setFormData({ name: '', email: '', subject: '', message: '' });
      }, 3000);
      return;
    }

    setFormStatus('sending');
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...formData, _subject: subjectLine }),
      });
      if (!res.ok) throw new Error(`Formspree responded ${res.status}`);
      setFormStatus('sent');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setFormStatus('idle'), 4000);
    } catch {
      setFormStatus('error');
    }
  };

  const submitLabel = {
    idle: 'Send Message',
    sending: 'Sending…',
    sent: 'Message Sent ✓',
    mailto: 'Opening email client...',
    error: 'Send Message',
  }[formStatus];

  const inputClasses =
    'bg-surface border border-border-subtle rounded-lg px-4 py-3 text-text-primary focus:border-accent focus:ring-2 focus:ring-accent/40 focus:outline-none transition w-full placeholder:text-text-muted';
  const labelClasses = 'block text-sm text-text-muted mb-2';
  const cardClasses =
    'flex items-center gap-4 rounded-xl border border-border-subtle bg-surface-elevated p-5';
  const iconTileClasses =
    'w-11 h-11 shrink-0 rounded-lg bg-accent/10 text-accent-text flex items-center justify-center text-lg';

  const columnVariants = (delay) => ({
    initial: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 30 },
    animate: isInView ? { opacity: 1, y: 0 } : (prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 30 }),
    transition: { duration: prefersReducedMotion ? 0 : 0.6, delay: prefersReducedMotion ? 0 : delay },
  });

  return (
    <section id="contact" className="py-20 px-6 bg-surface">
      <div className="max-w-6xl mx-auto" ref={sectionRef}>
        <SectionHeading title="Let's Connect" number="06" className="mb-6" />

        <motion.h3
          {...columnVariants(0)}
          className="font-display text-3xl md:text-4xl font-bold text-text-primary mb-4"
        >
          Let's build something exceptional together
        </motion.h3>
        <motion.p {...columnVariants(0.1)} className="text-text-muted max-w-2xl mb-4">
          I'm always open to discussing product management, AI, payments, or
          potential collaborations — based in Jaipur, India and open to remote
          opportunities globally.
        </motion.p>
        <motion.div {...columnVariants(0.15)} className="mb-12">
          <AvailabilityBadge />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left: contact info cards */}
          <motion.div {...columnVariants(0.2)} className="space-y-4">
            <div className={cardClasses}>
              <span className={iconTileClasses} aria-hidden="true">
                <FaMapMarkerAlt />
              </span>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted mb-1">
                  Location
                </p>
                <p className="text-text-primary">Jaipur, India</p>
              </div>
            </div>

            <div className={cardClasses}>
              <span className={iconTileClasses} aria-hidden="true">
                <FaEnvelope />
              </span>
              <div className="min-w-0">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted mb-1">
                  Email
                </p>
                <p className="text-text-primary flex items-center gap-2">
                  <span className="truncate">{CONTACT_EMAIL}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(CONTACT_EMAIL, 'email')}
                    aria-label="Copy email address"
                    className="shrink-0 text-text-muted hover:text-accent-text transition-colors"
                  >
                    {copied === 'email' ? <FaCheck aria-hidden="true" /> : <FaRegCopy aria-hidden="true" />}
                  </button>
                  {copied === 'email' && <span className="text-xs text-accent-text">Copied!</span>}
                </p>
              </div>
            </div>

            <div className={cardClasses}>
              <span className={iconTileClasses} aria-hidden="true">
                <FaPhone />
              </span>
              <div className="min-w-0">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted mb-1">
                  Phone
                </p>
                <p className="text-text-primary flex items-center gap-2">
                  <span className="truncate">{CONTACT_PHONE}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(CONTACT_PHONE, 'phone')}
                    aria-label="Copy phone number"
                    className="shrink-0 text-text-muted hover:text-accent-text transition-colors"
                  >
                    {copied === 'phone' ? <FaCheck aria-hidden="true" /> : <FaRegCopy aria-hidden="true" />}
                  </button>
                  {copied === 'phone' && <span className="text-xs text-accent-text">Copied!</span>}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-border-subtle bg-surface-elevated p-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted mb-4">
                Find me on
              </p>
              <div className="flex flex-wrap gap-3">
                {findMeOnLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-border-subtle bg-surface px-4 py-2.5 text-sm text-text-secondary hover:text-accent-text hover:border-accent/40 transition-colors"
                    >
                      <Icon aria-hidden="true" />
                      {link.label}
                    </a>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Right: message form card */}
          <motion.div
            {...columnVariants(0.3)}
            className="rounded-2xl border border-border-subtle bg-surface-elevated p-6 md:p-8"
          >
            <h4 className="font-display text-2xl font-bold text-text-primary mb-6">
              Send a Message
            </h4>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="contact-name" className={labelClasses}>
                    Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    placeholder="Your name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className={labelClasses}>
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={inputClasses}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-subject" className={labelClasses}>
                  Subject
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  name="subject"
                  placeholder="What's this about?"
                  value={formData.subject}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>

              <div>
                <label htmlFor="contact-message" className={labelClasses}>
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  placeholder="Tell me about the opportunity..."
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className={`${inputClasses} resize-none`}
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={formStatus === 'sending'}
                  className="w-full inline-flex items-center justify-center gap-2 bg-brand-gradient hover:brightness-110 text-white font-medium py-3.5 px-8 rounded-lg transition disabled:opacity-60"
                >
                  {submitLabel}
                  <FaPaperPlane aria-hidden="true" className="text-sm" />
                </button>
                {formStatus === 'error' && (
                  <p role="alert" className="mt-3 text-sm text-text-muted">
                    Couldn&apos;t send right now — please email me directly at{' '}
                    <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent-text underline">
                      {CONTACT_EMAIL}
                    </a>
                    .
                  </p>
                )}
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

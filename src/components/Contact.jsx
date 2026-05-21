import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaEnvelope, FaLinkedin, FaGithub, FaMapMarkerAlt } from 'react-icons/fa';

const contactLinks = [
  {
    icon: FaEnvelope,
    label: 'rahulisatiitr@gmail.com',
    href: 'mailto:rahulisatiitr@gmail.com',
  },
  {
    icon: FaLinkedin,
    label: 'LinkedIn Profile',
    href: 'https://www.linkedin.com/in/rahul-agar/',
  },
  {
    icon: FaGithub,
    label: 'GitHub Profile',
    href: 'https://github.com/Rahul4u-stack',
  },
  {
    icon: FaMapMarkerAlt,
    label: 'Jaipur, India',
    href: null,
  },
];

export default function Contact() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

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
    window.location.href = `mailto:rahulisatiitr@gmail.com?subject=${subject}&body=${body}`;

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 3000);
  };

  const inputClasses =
    'bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-3 text-slate-50 focus:border-blue-500 focus:outline-none transition w-full placeholder:text-slate-500';

  return (
    <section id="contact" className="py-20 px-6 bg-[#0f172a]">
      <div className="max-w-2xl mx-auto" ref={sectionRef}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-50 mb-4">
            Let's Connect
          </h2>
          <div className="w-20 h-1 bg-blue-500 rounded mb-6" />
          <p className="text-slate-400 mb-12">
            I'm always open to discussing product management, AI, payments, or
            potential collaborations.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.6, delay: 0.2 }}
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
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-lg transition"
            >
              {submitted ? 'Opening email client...' : 'Send Message'}
            </button>
          </div>
        </motion.form>

        {/* Divider */}
        <div className="border-t border-slate-700 my-12" />

        {/* Contact Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {contactLinks.map((link) => {
            const Icon = link.icon;
            const content = (
              <span className="flex items-center gap-3 text-slate-400 hover:text-blue-500 transition">
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

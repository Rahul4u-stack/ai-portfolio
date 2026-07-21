import { FaLinkedin, FaGithub, FaEnvelope, FaInstagram } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

export const CONTACT_EMAIL = 'rahulisatiitr@gmail.com';
export const CONTACT_PHONE = '+91 9634088561';

// Formspree form ID (formspree.io → form endpoint https://formspree.io/f/<id>).
// Empty string = contact form falls back to a mailto: draft.
export const FORMSPREE_ID = 'mdaqdnel';

export const socialLinks = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/rahul-agar/',
    icon: FaLinkedin,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/Rahul4u-stack',
    icon: FaGithub,
  },
  {
    label: 'Email',
    href: `mailto:${CONTACT_EMAIL}`,
    icon: FaEnvelope,
  },
];

// Contact section "Find me on" pills (hero/footer keep the shorter socialLinks)
export const findMeOnLinks = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/rahul-agar/',
    icon: FaLinkedin,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/Rahul4u-stack',
    icon: FaGithub,
  },
  {
    label: 'X (Twitter)',
    href: 'https://x.com/RahulAg78135245',
    icon: FaXTwitter,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/rahulagarwal6622/',
    icon: FaInstagram,
  },
];

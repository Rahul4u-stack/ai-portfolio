import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';

export const CONTACT_EMAIL = 'rahulisatiitr@gmail.com';

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

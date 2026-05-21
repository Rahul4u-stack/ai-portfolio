import { FaEnvelope, FaLinkedin, FaGithub } from 'react-icons/fa';

const socialLinks = [
  {
    icon: FaLinkedin,
    href: 'https://www.linkedin.com/in/rahul-agar/',
    label: 'LinkedIn',
  },
  {
    icon: FaGithub,
    href: 'https://github.com/Rahul4u-stack',
    label: 'GitHub',
  },
  {
    icon: FaEnvelope,
    href: 'mailto:rahulisatiitr@gmail.com',
    label: 'Email',
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-[#0f172a]">
      <div className="max-w-6xl mx-auto py-8 px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">
            &copy; 2026 Rahul Agarwal. All rights reserved.
          </p>

          <p className="text-slate-500 text-sm">
            Built with AI using Claude Code
          </p>

          <div className="flex items-center gap-4">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('mailto') ? undefined : '_blank'}
                  rel={
                    link.href.startsWith('mailto')
                      ? undefined
                      : 'noopener noreferrer'
                  }
                  aria-label={link.label}
                  className="text-slate-400 hover:text-blue-500 transition text-lg"
                >
                  <Icon />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}

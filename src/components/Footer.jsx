import { socialLinks } from '../data/social';

export default function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-surface">
      <div className="max-w-6xl mx-auto py-8 px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-text-muted text-sm">
            &copy; 2026 Rahul Agarwal. All rights reserved.
          </p>

          <p className="text-text-muted text-sm">
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
                  className="text-text-muted hover:text-accent transition text-lg"
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

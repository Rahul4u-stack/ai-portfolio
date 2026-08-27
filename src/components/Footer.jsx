import { socialLinks } from '../data/social'
import { LOCATION, formatLastUpdated } from '../data/siteMeta'

export default function Footer() {
  const lastUpdated = formatLastUpdated()

  return (
    <footer className="border-t border-rule bg-ink">
      <div className="shell py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="font-display text-xl text-text-primary">Rahul Agarwal</p>
            <p className="label mt-1 normal-case tracking-normal">{LOCATION}</p>
          </div>

          <ul className="flex flex-wrap items-center gap-2">
            {socialLinks.map((link) => {
              const Icon = link.icon
              const isMail = link.href.startsWith('mailto')
              return (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={isMail ? undefined : '_blank'}
                    rel={isMail ? undefined : 'noopener noreferrer'}
                    aria-label={`${link.label} — Rahul Agarwal`}
                    className="btn-ghost min-w-[2.75rem]"
                  >
                    <Icon aria-hidden="true" size={18} />
                  </a>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-rule pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="label normal-case tracking-normal">
            &copy; 2026 Rahul Agarwal. All rights reserved.
          </p>
          <p className="label normal-case tracking-normal">
            Built with Claude Code
            {lastUpdated && (
              <>
                {' · '}
                Last updated <span className="metric text-text-secondary">{lastUpdated}</span>
              </>
            )}
          </p>
        </div>
      </div>
    </footer>
  )
}

import { Link } from 'react-router-dom'
import useDocumentMeta from '../hooks/useDocumentMeta'

/**
 * Catch-all route. Without this, an unknown path matched nothing in <Routes> and the page
 * rendered as an empty shell — navbar and footer around a blank <main>, with no explanation.
 *
 * A static SPA cannot send a real 404 status (Vercel rewrites every route to index.html with
 * a 200), so the honest fallback is a clear dead-end page that routes the visitor onward.
 */
export default function NotFound() {
  useDocumentMeta(
    'Page not found — Rahul Agarwal',
    'That route does not exist. The work, the decisions and the contact details are one click away.'
  )

  return (
    <div className="bg-ink pb-16 pt-32">
      <div className="shell max-w-prose">
        <p className="label">
          Route status <span className="text-coral">· not found</span>
        </p>
        <h1 className="mt-4 font-display text-4xl text-text-primary text-balance">
          This route doesn&rsquo;t reach a node.
        </h1>
        <p className="mt-4 text-base text-text-secondary">
          The address you followed doesn&rsquo;t exist on this site — the link may be stale or
          mistyped. Everything that does exist is reachable from here:
        </p>
        <ul className="mt-8 flex flex-wrap gap-3">
          <li>
            <Link to="/" className="btn-primary">
              Back to the homepage
            </Link>
          </li>
          <li>
            <Link to="/#work" className="btn-secondary">
              Selected work
            </Link>
          </li>
          <li>
            <Link to="/#contact" className="btn-secondary">
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}

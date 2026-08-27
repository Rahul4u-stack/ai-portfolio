import { selectedWork } from './work'
import { labProjects } from './lab'

/**
 * How many things on this site are actually shipped and publicly checkable.
 *
 * Derived, never written down. The old site claimed "10+ AI Products Shipped" while the data held
 * eight, and a hard-coded number drifts the moment a project is added or removed. The rule here is
 * deliberately strict: an entry counts only if it exposes a link a stranger can open — a live demo,
 * a playable build, or a public repository. Internal work with no public artefact (the Paysecure
 * integration workflow, for instance) is excluded, however real it is.
 */
function hasPublicLink(entry) {
  return (entry.links ?? []).some((link) => !link.internal && /^https?:\/\//.test(link.href))
}

export const shippedProjects = [...selectedWork, ...labProjects].filter(hasPublicLink)

export const shippedCount = shippedProjects.length

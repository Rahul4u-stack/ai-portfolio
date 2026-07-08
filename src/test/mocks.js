// Browser APIs missing from jsdom that this app depends on:
// - IntersectionObserver (Navbar scroll-spy, framer-motion useInView)
// - matchMedia (framer-motion useReducedMotion — uses the legacy addListener API)

export class MockIntersectionObserver {
  static instances = []

  constructor(callback, options) {
    this.callback = callback
    this.options = options
    this.elements = new Set()
    MockIntersectionObserver.instances.push(this)
  }

  observe(element) {
    this.elements.add(element)
  }

  unobserve(element) {
    this.elements.delete(element)
  }

  disconnect() {
    this.elements.clear()
  }

  takeRecords() {
    return []
  }
}

export function installIntersectionObserverMock() {
  window.IntersectionObserver = MockIntersectionObserver
  globalThis.IntersectionObserver = MockIntersectionObserver
}

export function resetIntersectionObserverMock() {
  MockIntersectionObserver.instances = []
}

const mediaQueryState = {
  prefersReducedMotion: false,
  isMobile: false,
  isCoarsePointer: false,
}
const mediaQueryListeners = new Map()

function matchesForQuery(query) {
  if (query.includes('prefers-reduced-motion')) return mediaQueryState.prefersReducedMotion
  if (query.includes('max-width')) return mediaQueryState.isMobile
  if (query.includes('pointer: coarse') || query.includes('pointer:coarse')) {
    return mediaQueryState.isCoarsePointer
  }
  return false
}

function listenersFor(query) {
  if (!mediaQueryListeners.has(query)) {
    mediaQueryListeners.set(query, new Set())
  }
  return mediaQueryListeners.get(query)
}

export function installMatchMediaMock() {
  window.matchMedia = (query) => ({
    get matches() {
      return matchesForQuery(query)
    },
    media: query,
    onchange: null,
    addListener: (cb) => listenersFor(query).add(cb),
    removeListener: (cb) => listenersFor(query).delete(cb),
    addEventListener: (_event, cb) => listenersFor(query).add(cb),
    removeEventListener: (_event, cb) => listenersFor(query).delete(cb),
    dispatchEvent: () => false,
  })
}

function notifyMatching(predicate) {
  mediaQueryListeners.forEach((listeners, query) => {
    if (!predicate(query)) return
    const matches = matchesForQuery(query)
    listeners.forEach((cb) => cb({ matches }))
  })
}

export function setPrefersReducedMotion(value) {
  mediaQueryState.prefersReducedMotion = value
  notifyMatching((query) => query.includes('prefers-reduced-motion'))
}

export function setViewportMobile(value) {
  mediaQueryState.isMobile = value
  notifyMatching((query) => query.includes('max-width'))
}

export function setCoarsePointer(value) {
  mediaQueryState.isCoarsePointer = value
  notifyMatching((query) => query.includes('pointer: coarse') || query.includes('pointer:coarse'))
}

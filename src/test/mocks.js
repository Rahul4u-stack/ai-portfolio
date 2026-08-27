// Browser APIs missing from jsdom that this app depends on:
// - IntersectionObserver (Navbar scroll-spy, Reveal, RoutingNetwork pause-when-offscreen)
// - matchMedia (useReducedMotion — supports the legacy addListener API for old Safari)
// - ResizeObserver (RoutingNetwork layout switch)

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

/**
 * Fire every live IntersectionObserver callback with the given intersecting state.
 * Lets tests drive scroll-triggered reveals deterministically.
 */
export function triggerIntersection(isIntersecting = true) {
  for (const instance of MockIntersectionObserver.instances) {
    const entries = Array.from(instance.elements, (target) => ({
      target,
      isIntersecting,
      intersectionRatio: isIntersecting ? 1 : 0,
    }))
    if (entries.length > 0) instance.callback(entries, instance)
  }
}

/**
 * ResizeObserver mock. RoutingNetwork uses it to pick between its wide and narrow layouts;
 * jsdom reports 0 width, so tests can push an explicit width instead.
 */
export class MockResizeObserver {
  static instances = []

  constructor(callback) {
    this.callback = callback
    this.elements = new Set()
    MockResizeObserver.instances.push(this)
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
}

export function installResizeObserverMock() {
  window.ResizeObserver = MockResizeObserver
  globalThis.ResizeObserver = MockResizeObserver
}

export function resetResizeObserverMock() {
  MockResizeObserver.instances = []
}

export function triggerResize(width, height = 300) {
  for (const instance of MockResizeObserver.instances) {
    const entries = Array.from(instance.elements, (target) => ({
      target,
      contentRect: { width, height },
    }))
    if (entries.length > 0) instance.callback(entries, instance)
  }
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

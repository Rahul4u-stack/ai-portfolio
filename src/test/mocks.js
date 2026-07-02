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

const mediaQueryState = { prefersReducedMotion: false }
const mediaQueryListeners = new Set()

export function installMatchMediaMock() {
  window.matchMedia = (query) => ({
    get matches() {
      return query.includes('prefers-reduced-motion')
        ? mediaQueryState.prefersReducedMotion
        : false
    },
    media: query,
    onchange: null,
    addListener: (cb) => mediaQueryListeners.add(cb),
    removeListener: (cb) => mediaQueryListeners.delete(cb),
    addEventListener: (_event, cb) => mediaQueryListeners.add(cb),
    removeEventListener: (_event, cb) => mediaQueryListeners.delete(cb),
    dispatchEvent: () => false,
  })
}

export function setPrefersReducedMotion(value) {
  mediaQueryState.prefersReducedMotion = value
  mediaQueryListeners.forEach((cb) => cb({ matches: value }))
}

import '@testing-library/jest-dom/vitest'
import { beforeEach } from 'vitest'
import {
  installIntersectionObserverMock,
  installMatchMediaMock,
  installResizeObserverMock,
  resetIntersectionObserverMock,
  resetResizeObserverMock,
  setPrefersReducedMotion,
} from './mocks'

installIntersectionObserverMock()
installResizeObserverMock()
installMatchMediaMock()

// jsdom doesn't implement these; Navbar calls both on link clicks.
Element.prototype.scrollIntoView = () => {}
window.scrollTo = () => {}

beforeEach(() => {
  resetIntersectionObserverMock()
  resetResizeObserverMock()
  setPrefersReducedMotion(false)
})

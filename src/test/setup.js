import '@testing-library/jest-dom/vitest'
import { beforeEach } from 'vitest'
import {
  installIntersectionObserverMock,
  installMatchMediaMock,
  resetIntersectionObserverMock,
  setPrefersReducedMotion,
} from './mocks'

installIntersectionObserverMock()
installMatchMediaMock()

// jsdom doesn't implement these; Navbar calls both on link clicks.
Element.prototype.scrollIntoView = () => {}
window.scrollTo = () => {}

beforeEach(() => {
  resetIntersectionObserverMock()
  setPrefersReducedMotion(false)
})

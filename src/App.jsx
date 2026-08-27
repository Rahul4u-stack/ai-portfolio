import { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Hero from './components/hero/Hero'
import ImpactRail from './components/sections/ImpactRail'
import SelectedWork from './components/sections/SelectedWork'
import Decisions from './components/sections/Decisions'
import Beliefs from './components/sections/Beliefs'
import Experience from './components/sections/Experience'
import BuildLab from './components/sections/BuildLab'
import About from './components/sections/About'
import Contact from './components/sections/Contact'
import PullQuote from './components/ui/PullQuote'
import BackToTop from './components/ui/BackToTop'
import NotFound from './components/NotFound'

// Case studies pull in the markdown renderer; keep it off the homepage critical path.
const CaseStudyPage = lazy(() => import('./components/CaseStudyPage'))

/**
 * Homepage narrative:
 *   claim → proof → work → judgment → career → lab → person → ask
 * Nothing above is gated behind an animation, a video runway or a scroll interaction.
 */
function HomePage() {
  return (
    <>
      <Hero />
      <ImpactRail />
      <SelectedWork />
      <PullQuote quote="The best payment integration is the one your merchant never notices." />
      <Decisions />
      <Beliefs />
      <Experience />
      <BuildLab />
      <About />
      <Contact />
    </>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-ink">
      <Navbar />
      {/*
        tabIndex={-1} is what makes the skip link actually work. Without it, activating
        "Skip to content" moves the browser's sequential-focus *starting point* but leaves
        document.activeElement on <body> — so a screen reader announces nothing and the user
        has no confirmation the skip happened.
      */}
      <main id="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/case-study/:slug"
            element={
              <Suspense fallback={<div className="min-h-screen bg-ink" />}>
                <CaseStudyPage />
              </Suspense>
            }
          />
          {/* Catch-all: an unknown path must never render an empty shell. */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <BackToTop />
    </div>
  )
}

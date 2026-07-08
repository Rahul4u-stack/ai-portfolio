import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Education from './components/Education'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Atmosphere from './components/ui/Atmosphere'
import BackToTop from './components/ui/BackToTop'

const CaseStudyPage = lazy(() => import('./components/CaseStudyPage'))

function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Skills />
      <Education />
      <Contact />
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <div className="relative z-[2] min-h-screen bg-surface">
      <Atmosphere />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/case-study/:slug"
          element={
            <Suspense fallback={<div className="min-h-screen bg-surface" />}>
              <CaseStudyPage />
            </Suspense>
          }
        />
      </Routes>
      <BackToTop />
    </div>
  )
}

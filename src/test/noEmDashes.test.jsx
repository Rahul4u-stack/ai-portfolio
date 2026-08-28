import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { render } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import App from '../App'
import CaseStudyPage from '../components/CaseStudyPage'

// Site copy must never contain an em dash (U+2014). Rahul's rule: the site
// shouldn't read like AI-written text. Rendered text is the source of truth;
// the raw-file checks additionally cover strings that render outside the DOM
// body (document titles, meta descriptions).
const EM_DASH = '—'
const ROOT = process.cwd()

function expectNoEmDash(text, label) {
  const index = text.indexOf(EM_DASH)
  const context = index === -1 ? '' : text.slice(Math.max(0, index - 60), index + 60)
  expect(`${label}: ...${context}...`).not.toContain(EM_DASH)
}

describe('no em dashes in user-visible copy', () => {
  it('homepage renders without em dashes', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    )
    expectNoEmDash(document.body.textContent, 'homepage')
  })

  it.each(['snake', 'personal-chatbot', 'youtube-summarizer'])(
    'case study "%s" renders without em dashes',
    (slug) => {
      render(
        <MemoryRouter initialEntries={[`/case-study/${slug}`]}>
          <Routes>
            <Route path="/case-study/:slug" element={<CaseStudyPage />} />
          </Routes>
        </MemoryRouter>
      )
      expectNoEmDash(document.body.textContent, `case study ${slug}`)
    }
  )

  it('copy source files contain no em dashes (data, case-study markdown, index.html)', () => {
    const files = [
      ...readdirSync(join(ROOT, 'src/data')).map((f) => join('src/data', f)),
      ...readdirSync(join(ROOT, 'src/content/case-studies')).map((f) =>
        join('src/content/case-studies', f)
      ),
      'index.html',
      'src/hooks/useDocumentMeta.js',
    ]
    for (const file of files) {
      expectNoEmDash(readFileSync(join(ROOT, file), 'utf8'), file)
    }
  })
})

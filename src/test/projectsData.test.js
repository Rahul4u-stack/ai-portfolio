import { projects } from '../data/projects'

const CASE_STUDY_SLUGS = ['snake', 'personal-chatbot', 'youtube-summarizer']

describe('projects data shape', () => {
  it('has exactly 4 featured projects', () => {
    const featured = projects.filter((p) => p.featured)
    expect(featured).toHaveLength(4)
  })

  it('gives every project a non-empty metric field', () => {
    for (const project of projects) {
      expect(typeof project.metric).toBe('string')
      expect(project.metric.trim().length).toBeGreaterThan(0)
    }
  })

  it('has exactly 3 projects with a caseStudy slug, matching the known set', () => {
    const withCaseStudy = projects.filter((p) => p.caseStudy)
    expect(withCaseStudy).toHaveLength(3)
    expect(withCaseStudy.map((p) => p.caseStudy).sort()).toEqual(
      [...CASE_STUDY_SLUGS].sort()
    )
  })

  it('has a markdown file for every caseStudy slug referenced in the data', async () => {
    const caseStudyFiles = import.meta.glob('../content/case-studies/*.md')
    const availableSlugs = Object.keys(caseStudyFiles).map((path) =>
      path.split('/').pop().replace('.md', '')
    )
    for (const project of projects.filter((p) => p.caseStudy)) {
      expect(availableSlugs).toContain(project.caseStudy)
    }
  })
})

import { useMemo } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import useDocumentMeta from '../hooks/useDocumentMeta'
import { selectedWork } from '../data/work'
import { labProjects } from '../data/lab'
import snakeContent from '../content/case-studies/snake.md?raw'
import personalChatbotContent from '../content/case-studies/personal-chatbot.md?raw'
import youtubeSummarizerContent from '../content/case-studies/youtube-summarizer.md?raw'
import networkContent from '../content/case-studies/payment-intelligence-network.md?raw'

/** Route slug → markdown. Keep in step with src/content/case-studies/. */
const caseStudyContent = {
  snake: snakeContent,
  'personal-chatbot': personalChatbotContent,
  'youtube-summarizer': youtubeSummarizerContent,
  'payment-intelligence-network': networkContent,
}

/**
 * Title/description for the document head, resolved from whichever data file owns the project.
 * Featured work lives in work.js; smaller builds live in lab.js and link by the same slug.
 */
function findProject(slug) {
  const featured = selectedWork.find((item) => item.slug === slug)
  if (featured) return { title: featured.title, description: featured.subtitle }
  const lab = labProjects.find((item) =>
    item.links?.some((link) => link.internal && link.href === `/case-study/${slug}`)
  )
  if (lab) return { title: lab.title, description: lab.note }
  return null
}

const markdownComponents = {
  h1: ({ children }) => (
    <h1 className="font-display text-4xl text-text-primary first:mt-0 mt-12 mb-4 text-balance">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="font-display text-2xl text-text-primary mt-12 mb-3">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-lg font-semibold text-text-primary mt-8 mb-2">{children}</h3>
  ),
  p: ({ children }) => <p className="text-text-secondary leading-relaxed mb-4">{children}</p>,
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-indigo-text underline underline-offset-2 hover:text-text-primary"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="mb-4 list-disc space-y-2 pl-5 text-text-secondary">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-4 list-decimal space-y-2 pl-5 text-text-secondary">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-text-primary">{children}</strong>,
  em: ({ children }) => <em className="text-text-primary">{children}</em>,
  hr: () => <hr className="my-12 border-rule" />,
  blockquote: ({ children }) => (
    <blockquote className="mb-4 border-l-2 border-indigo/60 pl-4 text-text-primary">
      {children}
    </blockquote>
  ),
  code: ({ inline, children }) =>
    inline ? (
      <code className="rounded border border-rule bg-panel px-1.5 py-0.5 font-mono text-sm text-text-secondary">
        {children}
      </code>
    ) : (
      <code className="font-mono text-sm">{children}</code>
    ),
  pre: ({ children }) => (
    <pre className="mb-4 overflow-x-auto rounded-card border border-rule bg-panel p-4 font-mono text-sm">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="mb-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="border-b border-rule">{children}</thead>,
  th: ({ children }) => (
    <th className="px-3 py-2 text-left font-semibold text-text-primary">{children}</th>
  ),
  td: ({ children }) => (
    <td className="border-b border-rule px-3 py-2 text-text-secondary">{children}</td>
  ),
}

export default function CaseStudyPage() {
  const { slug } = useParams()
  const content = caseStudyContent[slug]
  const project = useMemo(() => findProject(slug), [slug])

  useDocumentMeta(
    project ? `${project.title} — Case study — Rahul Agarwal` : undefined,
    project ? project.description : undefined
  )

  if (!content) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="bg-ink pb-16 pt-28">
      <div className="shell">
        <Link
          to="/#work"
          className="label inline-flex min-h-[2.75rem] items-center gap-2 normal-case tracking-normal
            hover:text-text-primary"
        >
          <span aria-hidden="true">←</span> Back to selected work
        </Link>
        <div aria-hidden="true" className="route-rule mt-2" />
        <article className="mx-auto mt-8 max-w-prose">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {content}
          </ReactMarkdown>
        </article>
        <div aria-hidden="true" className="route-rule mt-16" />
        <p className="mt-6 text-center">
          <Link to="/#work" className="btn-secondary">
            More selected work
          </Link>
        </p>
      </div>
    </div>
  )
}

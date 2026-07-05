import { useMemo } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import useDocumentMeta from '../hooks/useDocumentMeta'
import { projects } from '../data/projects'
import snakeContent from '../content/case-studies/snake.md?raw'
import personalChatbotContent from '../content/case-studies/personal-chatbot.md?raw'
import youtubeSummarizerContent from '../content/case-studies/youtube-summarizer.md?raw'

const caseStudyContent = {
  snake: snakeContent,
  'personal-chatbot': personalChatbotContent,
  'youtube-summarizer': youtubeSummarizerContent,
}

const markdownComponents = {
  h1: ({ children }) => (
    <h1 className="text-3xl md:text-4xl font-display font-bold text-text-primary mt-10 mb-4 first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl font-display font-bold text-text-primary mt-10 mb-4">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-bold text-text-primary mt-8 mb-3">{children}</h3>
  ),
  p: ({ children }) => <p className="text-text-muted leading-relaxed mb-4">{children}</p>,
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-accent-text hover:text-accent-hover underline underline-offset-2"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-inside text-text-muted mb-4 space-y-2">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside text-text-muted mb-4 space-y-2">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => <strong className="text-text-primary font-semibold">{children}</strong>,
  em: ({ children }) => <em className="text-text-secondary">{children}</em>,
  hr: () => <hr className="border-border-subtle my-10" />,
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-accent/40 pl-4 italic text-text-secondary mb-4">
      {children}
    </blockquote>
  ),
  code: ({ inline, children }) =>
    inline ? (
      <code className="font-mono text-sm px-1.5 py-0.5 rounded border border-accent/20 bg-surface-elevated/50 text-text-secondary">
        {children}
      </code>
    ) : (
      <code className="font-mono text-sm">{children}</code>
    ),
  pre: ({ children }) => (
    <pre className="font-mono text-sm p-4 rounded-lg border border-border-subtle bg-surface-elevated/50 overflow-x-auto mb-4">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto mb-6">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="border-b border-border-subtle">{children}</thead>,
  th: ({ children }) => (
    <th className="text-left text-text-primary font-semibold px-3 py-2">{children}</th>
  ),
  td: ({ children }) => (
    <td className="text-text-muted px-3 py-2 border-b border-border-subtle/50">{children}</td>
  ),
}

export default function CaseStudyPage() {
  const { slug } = useParams()
  const content = caseStudyContent[slug]
  const project = useMemo(() => projects.find((p) => p.caseStudy === slug), [slug])

  useDocumentMeta(
    project ? `${project.title} — Case Study — Rahul Agarwal` : undefined,
    project ? project.description : undefined
  )

  if (!content) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen bg-surface py-20 px-6">
      <div className="max-w-[70ch] mx-auto">
        <Link
          to="/#projects"
          className="inline-flex items-center gap-2 text-text-muted hover:text-accent-text transition-colors duration-200 text-sm mb-10"
        >
          ← Back to Projects
        </Link>
        <article>
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {content}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  )
}

import { useEffect } from 'react'

const DEFAULT_TITLE = 'Rahul Agarwal — Product Manager & AI Builder'
const DEFAULT_DESCRIPTION =
  'Technical Product Manager building AI-powered products across payments, fintech, and beyond.'

export default function useDocumentMeta(title, description) {
  useEffect(() => {
    const previousTitle = document.title
    document.title = title || DEFAULT_TITLE

    let meta = document.querySelector('meta[name="description"]')
    const previousDescription = meta ? meta.getAttribute('content') : null

    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'description')
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', description || DEFAULT_DESCRIPTION)

    return () => {
      document.title = previousTitle
      if (meta && previousDescription !== null) {
        meta.setAttribute('content', previousDescription)
      }
    }
  }, [title, description])
}

import { useState } from 'react'

export default function GameEmbed({ embedUrl, coverImage, title }) {
  const [activated, setActivated] = useState(false)

  if (!embedUrl) {
    return null
  }

  if (activated) {
    return (
      <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border-subtle">
        <iframe
          src={embedUrl}
          title={title}
          className="w-full h-full"
          allow="gamepad; fullscreen"
        />
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setActivated(true)}
      aria-label={`Play ${title}`}
      className="group relative w-full aspect-video rounded-lg overflow-hidden border border-border-subtle bg-surface-elevated"
    >
      {coverImage ? (
        <img
          src={coverImage}
          alt=""
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-accent-from/20 to-accent-to/20" />
      )}
      <div className="absolute inset-0 flex items-center justify-center bg-surface/40 group-hover:bg-surface/20 transition-colors duration-300">
        <span className="flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-surface font-medium">
          &#9654; Play
        </span>
      </div>
    </button>
  )
}

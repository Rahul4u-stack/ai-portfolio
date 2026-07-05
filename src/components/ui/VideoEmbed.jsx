export default function VideoEmbed({ videoUrl, posterUrl, title }) {
  if (!videoUrl) {
    return null
  }

  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border-subtle">
      <video
        src={videoUrl}
        poster={posterUrl}
        preload="none"
        controls
        className="w-full h-full"
        aria-label={title}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  )
}

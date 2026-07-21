export default function AvailabilityBadge({ className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 bg-surface/60 backdrop-blur-sm border border-emerald/30 text-emerald text-xs px-2.5 py-0.5 rounded-full font-medium ${className}`}
    >
      <span className="relative flex w-1.5 h-1.5">
        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald animate-ping opacity-75" />
        <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-emerald" />
      </span>
      Building AI products &middot; Open to conversations
    </span>
  )
}

export default function Atmosphere() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            'radial-gradient(ellipse 60% 50% at 12% 10%, rgba(99,102,241,0.20), transparent)',
            'radial-gradient(ellipse 50% 50% at 88% 18%, rgba(236,72,153,0.15), transparent)',
            'radial-gradient(ellipse 40% 40% at 80% 70%, rgba(139,92,246,0.15), transparent)',
            'radial-gradient(ellipse 60% 60% at 50% 95%, rgba(56,189,248,0.16), transparent)',
          ].join(', '),
        }}
      />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: [
            'linear-gradient(90deg, hsla(0,0%,100%,0.05) 1px, transparent 1px)',
            'linear-gradient(180deg, hsla(0,0%,100%,0.05) 1px, transparent 1px)',
          ].join(', '),
          backgroundSize: '64px 64px',
        }}
      />
    </div>
  )
}

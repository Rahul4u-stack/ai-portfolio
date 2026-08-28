export default function Atmosphere() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{ backgroundImage: 'var(--atmosphere)' }}
      />
      <div
        className="absolute inset-0 opacity-40"
        style={{ backgroundImage: 'var(--atmo-grid)', backgroundSize: '64px 64px' }}
      />
    </div>
  )
}

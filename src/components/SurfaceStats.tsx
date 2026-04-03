import type { IvSurface } from '../types'

interface Props {
  surface: IvSurface
}

export default function SurfaceStats({ surface }: Props) {
  const totalPoints = surface.expiries.reduce((acc, e) => acc + e.points.length, 0)
  const timestamp = new Date(surface.timestamp).toLocaleString()

  return (
    <div className="stats-row">
      <StatCard label="Currency" value={surface.currency} />
      <StatCard label="ATM Price" value={`$${surface.atmPrice.toLocaleString()}`} mono />
      <StatCard label="Expiries" value={surface.expiries.length.toString()} mono />
      <StatCard label="IV Points" value={totalPoints.toString()} mono />
      <StatCard label="Last Updated" value={timestamp} mono />
    </div>
  )
}

function StatCard({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="stat-card">
      <p className="stat-card__label">{label}</p>
      <p className={`stat-card__value${mono ? ' stat-card__value--mono' : ''}`}>{value}</p>
    </div>
  )
}

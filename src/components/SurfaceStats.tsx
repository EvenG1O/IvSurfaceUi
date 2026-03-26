import type { IvSurface } from '../types'

interface Props {
  surface: IvSurface
}

export default function SurfaceStats({ surface }: Props) {
  const totalPoints = surface.expiries.reduce((acc, e) => acc + e.points.length, 0)
  const timestamp = new Date(surface.timestamp).toLocaleString()

  return (
    <div style={{
      display: 'flex',
      gap: '16px',
      marginBottom: '24px',
      flexWrap: 'wrap'
    }}>
      <StatCard label="Currency" value={surface.currency} />
      <StatCard label="ATM Price" value={`$${surface.atmPrice.toLocaleString()}`} />
      <StatCard label="Expiries" value={surface.expiries.length.toString()} />
      <StatCard label="IV Points" value={totalPoints.toString()} />
      <StatCard label="Last Updated" value={timestamp} />
    </div>
  )
}

function StatCard({ label, value }: { label: string, value: string }) {
  return (
    <div style={{
      background: '#1a1a2e',
      border: '1px solid #2a2a4a',
      borderRadius: '8px',
      padding: '16px 20px',
      minWidth: '140px'
    }}>
      <p style={{ color: '#888', fontSize: '12px', marginBottom: '6px' }}>{label}</p>
      <p style={{ color: '#4a9eff', fontSize: '18px', fontWeight: 600 }}>{value}</p>
    </div>
  )
}

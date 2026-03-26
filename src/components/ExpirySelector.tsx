import type { IvExpiry } from '../types'

interface Props {
  expiries: IvExpiry[]
  selected: string | null
  onChange: (expiry: string | null) => void
}

export default function ExpirySelector({ expiries, selected, onChange }: Props) {
  return (
    <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
      <label style={{ color: '#888', fontSize: '14px' }}>Expiry:</label>
      <select
        value={selected ?? 'all'}
        onChange={e => onChange(e.target.value === 'all' ? null : e.target.value)}
      >
        <option value="all">All Expiries</option>
        {expiries.map(e => (
          <option key={e.expiry} value={e.expiry}>
            {new Date(e.expiry).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </option>
        ))}
      </select>
    </div>
  )
}

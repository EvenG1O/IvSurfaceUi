import type { IvExpiry } from '../types'

interface Props {
  expiries: IvExpiry[]
  selected: string | null
  onChange: (expiry: string | null) => void
}

export default function ExpirySelector({ expiries, selected, onChange }: Props) {
  return (
    <div className="expiry-row">
      <label className="expiry-row__label">Expiry</label>
      <select
        id="expiry-select"
        value={selected ?? 'all'}
        onChange={e => onChange(e.target.value === 'all' ? null : e.target.value)}
      >
        <option value="all">All Expiries (3D Surface)</option>
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

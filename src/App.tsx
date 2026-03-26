import { useState } from 'react'
import VolSurface from './components/VolSurface'
import SurfaceStats from './components/SurfaceStats'
import ExpirySelector from './components/ExpirySelector'
import { useSurfaceData } from './hooks/useSurfaceData'
import './index.css'

const CURRENCIES = ['BTC', 'ETH'] as const

function App() {
  const [selectedExpiry, setSelectedExpiry] = useState<string | null>(null)
  const [currency, setCurrency] = useState<string>(CURRENCIES[0])
  const { surface, loading, error } = useSurfaceData(currency)

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <h1 style={{ fontSize: '24px' }}>
          {currency} Implied Volatility Surface
        </h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          {CURRENCIES.map(c => (
            <button
              key={c}
              onClick={() => setCurrency(c)}
              style={{
                padding: '8px 20px',
                borderRadius: '6px',
                border: '1px solid #2a2a4a',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '14px',
                background: currency === c ? '#4a9eff' : '#1a1a2e',
                color: currency === c ? '#ffffff' : '#888888',
                transition: 'all 0.2s'
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <p style={{ color: '#4a9eff', fontSize: '18px' }}>⏳ Fetching {currency} IV Surface from Deribit...</p>
        </div>
      )}

      {error && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <p style={{ color: '#ff4a4a', fontSize: '18px' }}>❌ {error}</p>
        </div>
      )}

      {surface && !loading && (
        <>
          <SurfaceStats surface={surface} />
          <ExpirySelector
            expiries={surface.expiries}
            selected={selectedExpiry}
            onChange={setSelectedExpiry}
          />
          <VolSurface
            surface={surface}
            selectedExpiry={selectedExpiry}
          />
        </>
      )}
    </div>
  )
}

export default App

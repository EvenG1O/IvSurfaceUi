import { useState } from 'react'
import VolSurface from './components/VolSurface'
import SurfaceStats from './components/SurfaceStats'
import ExpirySelector from './components/ExpirySelector'
import { useSurfaceData } from './hooks/useSurfaceData'
import './App.css'
import './index.css'

const CURRENCIES = ['BTC', 'ETH'] as const

function App() {
  const [selectedExpiry, setSelectedExpiry] = useState<string | null>(null)
  const [currency, setCurrency] = useState<string>(CURRENCIES[0])
  const { surface, loading, error } = useSurfaceData(currency)

  return (
    <div className="app-shell">
      {/* ── Header ── */}
      <header className="app-header">
        <div className="app-title-group">
          <h1 className="app-title">{currency} Implied Volatility Surface</h1>
          <span className="app-badge">
            <span className="pulse-dot" />
            Deribit
          </span>
        </div>

        <div className="currency-toggle">
          {CURRENCIES.map(c => (
            <button
              key={c}
              onClick={() => setCurrency(c)}
              className={`currency-toggle__btn ${currency === c ? 'currency-toggle__btn--active' : ''}`}
            >
              {c}
            </button>
          ))}
        </div>
      </header>

      {/* ── Loading ── */}
      {loading && (
        <div className="loading-state">
          <div className="spinner" />
          <p className="loading-state__text">Fetching {currency} IV surface from Deribit…</p>
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div className="error-state">
          <div className="error-state__icon">!</div>
          <p className="error-state__text">
            <strong>Connection failed</strong><br />
            {error}
          </p>
        </div>
      )}

      {/* ── Data loaded ── */}
      {surface && !loading && (
        <div className="fade-in">
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
        </div>
      )}
    </div>
  )
}

export default App

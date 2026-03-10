import { useState, useEffect, useRef } from 'react'
import VolSurface from './components/VolSurface'
import SurfaceStats from './components/SurfaceStats'
import ExpirySelector from './components/ExpirySelector'
import './index.css'

export interface IvPoint {
  expiry: string
  strike: number
  type: string
  iv: number
  moneyness: number
}

export interface IvExpiry {
  expiry: string
  points: IvPoint[]
}

export interface IvSurface {
  atmPrice: number
  timestamp: string
  currency: string
  expiries: IvExpiry[]
}

const CURRENCIES = ['BTC', 'ETH']

function App() {
  const [surface, setSurface] = useState<IvSurface | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedExpiry, setSelectedExpiry] = useState<string | null>(null)
  const [currency, setCurrency] = useState('BTC')
  const surfaceCache = useRef<Record<string, {data : IvSurface; fetched: number}>>({})

  useEffect(() => {
    const fetchSurface = async () => {
      try {
        setLoading(true);
        setError(null);
        setSurface(null);
        setSelectedExpiry(null);

        const cached = surfaceCache.current[currency];
        const fiveMinutes  = 5 * 60 * 1000;
        
        if(cached && Date.now() - cached.fetched < fiveMinutes){
            console.log("cache working");
            setSurface(cached.data);
            setLoading(false);
            return
        }


        // No cache
        console.log("No cache");

        const response = await fetch(`https://localhost:51979/api/ivsurface?currency=${currency}`)
        const data: IvSurface = await response.json()
        surfaceCache.current[currency] = {
          data,
          fetched: Date.now()
        }

        setSurface(data);
      } catch (err) {
        setError('Failed to fetch surface data. Is the API running?');
      } finally {
        setLoading(false)
      }
    }

    fetchSurface()
  }, [currency])

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
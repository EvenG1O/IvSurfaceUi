import { useState, useEffect, useRef } from 'react'
import type { IvSurface } from '../types'

const API_BASE_URL = 'https://localhost:51979'
const CACHE_TTL_MS = 5 * 60 * 1000

interface CacheEntry {
  data: IvSurface
  fetched: number
}

export function useSurfaceData(currency: string) {
  const [surface, setSurface] = useState<IvSurface | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const cache = useRef<Record<string, CacheEntry>>({})

  useEffect(() => {
    const fetchSurface = async () => {
      try {
        setLoading(true)
        setError(null)
        setSurface(null)

        const cached = cache.current[currency]
        if (cached && Date.now() - cached.fetched < CACHE_TTL_MS) {
          setSurface(cached.data)
          setLoading(false)
          return
        }

        const response = await fetch(`${API_BASE_URL}/api/ivsurface?currency=${currency}`)
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`)
        }
        const data: IvSurface = await response.json()
        cache.current[currency] = { data, fetched: Date.now() }
        setSurface(data)
      } catch {
        setError('Failed to fetch surface data. Is the API running?')
      } finally {
        setLoading(false)
      }
    }

    fetchSurface()
  }, [currency])

  return { surface, loading, error }
}

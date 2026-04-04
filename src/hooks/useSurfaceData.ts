import { useState, useEffect } from 'react'
import type { IvSurface } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL

export function useSurfaceData(currency: string) {
  const [surface, setSurface] = useState<IvSurface | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let ws: WebSocket | null = null;
    let isMounted = true;
    let reconnectTimer: number | null = null;

    
    let wsUrl = import.meta.env.VITE_API_WS;
    if (API_BASE_URL) {
      try {
        const url = new URL(API_BASE_URL);
        const protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
        wsUrl = `${protocol}//${url.host}/ws/volsurface`;
      } catch (e) {
        // Fallback if URL parsing fails
      }
    }

    const connect = () => {
      if (!isMounted) return;
      
      setLoading(true);
      setError(null);
      
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        if (!isMounted) return;
        console.log('✅ Connected to Vol Surface stream!');
      };

      ws.onmessage = (event) => {
        if (!isMounted) return;
        try {
          const payload = JSON.parse(event.data);
          
          if (payload && payload.currency === currency) {
            setSurface((prev) => {
              // Extract the updated data from message, merging with prev surface if needed (like atmPrice)
              const expiries = Array.isArray(payload.data) ? payload.data : (payload.data?.expiries || payload.expiries || []);
              const atmPrice = payload.data?.atmPrice || payload.atmPrice || prev?.atmPrice || 0;
              
              return {
                atmPrice,
                timestamp: payload.timestamp ? new Date(payload.timestamp).toISOString() : new Date().toISOString(),
                currency: payload.currency,
                expiries: expiries
              };
            });
            setLoading(false);
            setError(null);
          }
        } catch (e) {
          console.warn("Received non-JSON or malformed data:", event.data);
        }
      };

      ws.onerror = () => {
        if (!isMounted) return;
        setError('WebSocket connection error.');
      };

      ws.onclose = () => {
        if (!isMounted) return;
        // Attempt reconnect after 3 seconds
        reconnectTimer = window.setTimeout(connect, 3000);
      };
    };

    connect();

    return () => {
      isMounted = false;
      if (reconnectTimer !== null) {
        clearTimeout(reconnectTimer);
      }
      if (ws) {
        ws.close();
      }
    };
  }, [currency]);

  return { surface, loading, error }
}

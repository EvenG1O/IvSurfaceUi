import Plot from 'react-plotly.js'
import type { IvSurface, IvExpiry } from '../types'
import { interpolateRow } from '../utils/interpolation'

interface Props {
  surface: IvSurface
  selectedExpiry: string | null
}

function SmileChart({ expiry }: { expiry: IvExpiry }) {
  const puts = expiry.points.filter((p) => p.type === 'put').sort((a, b) => a.strike - b.strike);
  const calls = expiry.points.filter((p) => p.type === 'call').sort((a, b) => a.strike - b.strike);

  return (
    <Plot
      data={[
        {
          type: 'scatter',
          mode: 'lines+markers',
          name: 'Puts',
          x: puts.map((p) => p.strike),
          y: puts.map((p) => p.iv),
          line: { color: '#ff6b6b', width: 2 },
          marker: { size: 6 },
          hovertemplate: 'Strike: $%{x}<br>IV: %{y:.2f}%<extra>Put</extra>'
        },
        {
          type: 'scatter',
          mode: 'lines+markers',
          name: 'Calls',
          x: calls.map((p) => p.strike),
          y: calls.map((p) => p.iv),
          line: { color: '#4a9eff', width: 2 },
          marker: { size: 6 },
          hovertemplate: 'Strike: $%{x}<br>IV: %{y:.2f}%<extra>Call</extra>'
        }
      ]}
      layout={{
        autosize: true,
        height: 500,
        paper_bgcolor: '#1a1a2e',
        plot_bgcolor: '#1a1a2e',
        font: { color: '#e0e0e0' },
        title: {
          text: `Vol Smile — ${new Date(expiry.expiry).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
          font: { color: '#ffffff', size: 16 }
        },
        xaxis: {
          title: { text: 'Strike ($)' },
          gridcolor: '#2a2a4a',
          color: '#e0e0e0',
          tickformat: ',.0f'
        },
        yaxis: {
          title: { text: 'IV %' },
          gridcolor: '#2a2a4a',
          color: '#e0e0e0'
        },
        legend: {
          font: { color: '#e0e0e0' }
        },
        margin: { l: 60, r: 20, t: 60, b: 60 }
      }}
      config={{ displayModeBar: true, responsive: true }}
      style={{ width: '100%' }}
    />
  )
}

function SurfaceChart({ surface, selectedExpiry }: Props) {
  const expiries = selectedExpiry
    ? surface.expiries.filter((e) => e.expiry === selectedExpiry)
    : surface.expiries

  const allStrikes = [...new Set(
    expiries.flatMap((e) => e.points.map((p) => p.strike))
  )].sort((a, b) => a - b)

  const expiryLabels = expiries.map((e) =>
    new Date(e.expiry).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  )

  const zMatrix = expiries.map((expiry) => {
    const raw = allStrikes.map((strike) => {
      const point = expiry.points.find((p) => p.strike === strike)
      return point ? point.iv : null
    })
    return interpolateRow(raw)
  })

  return (
    <Plot
      data={[{
        type: 'surface' as const,
        x: allStrikes,
        y: expiryLabels,
        z: zMatrix,
        colorscale: 'Viridis',
        colorbar: {
          title: { text: 'IV %', font: { color: '#e0e0e0' } },
          tickfont: { color: '#e0e0e0' }
        },
        hovertemplate:
          'Strike: $%{x}<br>' +
          'Expiry: %{y}<br>' +
          'IV: %{z:.2f}%<extra></extra>'
      }]}
      layout={{
        autosize: true,
        height: 600,
        paper_bgcolor: '#1a1a2e',
        plot_bgcolor: '#1a1a2e',
        font: { color: '#e0e0e0' },
        scene: {
          xaxis: { title: { text: 'Strike ($)' }, gridcolor: '#2a2a4a', color: '#e0e0e0' },
          yaxis: { title: { text: 'Expiry' }, gridcolor: '#2a2a4a', color: '#e0e0e0' },
          zaxis: { title: { text: 'IV %' }, gridcolor: '#2a2a4a', color: '#e0e0e0' },
          bgcolor: '#0a0a0f'
        },
        margin: { l: 0, r: 0, t: 0, b: 0 }
      }}
      config={{ displayModeBar: true, responsive: true }}
      style={{ width: '100%' }}
    />
  )
}

export default function VolSurface({ surface, selectedExpiry }: Props) {
  if (selectedExpiry) {
    const expiry = surface.expiries.find((e) => e.expiry === selectedExpiry);
    if (expiry) return (
      <div style={{ background: '#1a1a2e', border: '1px solid #2a2a4a', borderRadius: '8px', padding: '16px' }}>
        <SmileChart expiry={expiry} />
      </div>
    )
  }

  return (
    <div style={{ background: '#1a1a2e', border: '1px solid #2a2a4a', borderRadius: '8px', padding: '16px' }}>
      <SurfaceChart surface={surface} selectedExpiry={selectedExpiry} />
    </div>
  )
}

import Plot from 'react-plotly.js'
import type { IvSurface, IvExpiry } from '../types'
import { interpolateSurface } from '../utils/interpolation'

interface Props {
  surface: IvSurface
  selectedExpiry: string | null
}

const CHART_BG = 'rgba(14, 14, 26, 0.0)'
const SCENE_BG = '#0a0a14'
const GRID_COLOR = 'rgba(74, 158, 255, 0.06)'
const FONT_COLOR = '#a0a0b8'

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
          line: { color: '#f87171', width: 2.5, shape: 'spline' },
          marker: { size: 5, color: '#f87171', line: { color: 'rgba(248,113,113,0.3)', width: 2 } },
          hovertemplate: 'Strike: $%{x:,.0f}<br>IV: %{y:.2f}%<extra>Put</extra>'
        },
        {
          type: 'scatter',
          mode: 'lines+markers',
          name: 'Calls',
          x: calls.map((p) => p.strike),
          y: calls.map((p) => p.iv),
          line: { color: '#60a5fa', width: 2.5, shape: 'spline' },
          marker: { size: 5, color: '#60a5fa', line: { color: 'rgba(96,165,250,0.3)', width: 2 } },
          hovertemplate: 'Strike: $%{x:,.0f}<br>IV: %{y:.2f}%<extra>Call</extra>'
        }
      ]}
      layout={{
        autosize: true,
        height: 480,
        paper_bgcolor: CHART_BG,
        plot_bgcolor: CHART_BG,
        font: { color: FONT_COLOR, family: 'Inter, sans-serif', size: 12 },
        title: {
          text: `Vol Smile — ${new Date(expiry.expiry).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
          font: { color: '#ffffff', size: 15, family: 'Inter, sans-serif' },
          y: 0.96
        },
        xaxis: {
          title: { text: 'Strike ($)', standoff: 12 },
          gridcolor: GRID_COLOR,
          zerolinecolor: GRID_COLOR,
          color: FONT_COLOR,
          tickformat: ',.0f'
        },
        yaxis: {
          title: { text: 'IV %', standoff: 12 },
          gridcolor: GRID_COLOR,
          zerolinecolor: GRID_COLOR,
          color: FONT_COLOR
        },
        legend: {
          font: { color: FONT_COLOR },
          bgcolor: 'rgba(0,0,0,0)',
          x: 1, xanchor: 'right',
          y: 1, yanchor: 'top'
        },
        margin: { l: 60, r: 24, t: 50, b: 56 },
        hoverlabel: {
          bgcolor: '#1a1a2e',
          bordercolor: 'rgba(74,158,255,0.2)',
          font: { color: '#eee', family: 'Inter, sans-serif', size: 12 }
        }
      }}
      config={{ displayModeBar: false, responsive: true }}
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

  const rawMatrix = expiries.map((expiry) => allStrikes.map((strike) => {
    const point = expiry.points.find((p) => p.strike === strike);
    return point ? point.iv : null;
  }))
  const zMatrix = interpolateSurface(rawMatrix);

  return (
    <Plot
      data={[{
        type: 'surface' as const,
        x: allStrikes,
        y: expiryLabels,
        z: zMatrix,
        colorscale: [
          [0, '#7c3aed'],
          [0.25, '#3b82f6'],
          [0.5, '#06b6d4'],
          [0.75, '#34d399'],
          [1, '#fbbf24']
        ],
        colorbar: {
          title: { text: 'IV %', font: { color: FONT_COLOR, size: 12 } },
          tickfont: { color: FONT_COLOR, size: 11 },
          thickness: 14,
          len: 0.6,
          outlinewidth: 0,
          bgcolor: 'rgba(0,0,0,0)'
        },
        hovertemplate:
          'Strike: $%{x:,.0f}<br>' +
          'Expiry: %{y}<br>' +
          'IV: %{z:.2f}%<extra></extra>',
        lighting: {
          ambient: 0.7,
          diffuse: 0.5,
          specular: 0.3,
          roughness: 0.5
        },
        contours: {
          z: {
            show: true,
            usecolormap: true,
            highlightcolor: 'rgba(255,255,255,0.1)',
            project: { z: false }
          }
        }
      } as any]}

      layout={{
        autosize: true,
        height: 600,
        paper_bgcolor: CHART_BG,
        plot_bgcolor: CHART_BG,
        font: { color: FONT_COLOR, family: 'Inter, sans-serif', size: 11 },
        scene: {
          xaxis: { title: { text: 'Strike ($)' }, gridcolor: GRID_COLOR, color: FONT_COLOR, showbackground: false },
          yaxis: { title: { text: 'Expiry' }, gridcolor: GRID_COLOR, color: FONT_COLOR, showbackground: false },
          zaxis: { title: { text: 'IV %' }, gridcolor: GRID_COLOR, color: FONT_COLOR, showbackground: false },
          bgcolor: SCENE_BG,
          camera: {
            eye: { x: 1.6, y: -1.6, z: 0.9 },
            up: { x: 0, y: 0, z: 1 }
          }
        },
        margin: { l: 0, r: 0, t: 0, b: 0 },
        hoverlabel: {
          bgcolor: '#1a1a2e',
          bordercolor: 'rgba(74,158,255,0.2)',
          font: { color: '#eee', family: 'Inter, sans-serif', size: 12 }
        }
      }}
      config={{ displayModeBar: false, responsive: true }}
      style={{ width: '100%' }}
    />
  )
}

export default function VolSurface({ surface, selectedExpiry }: Props) {
  if (selectedExpiry) {
    const expiry = surface.expiries.find((e) => e.expiry === selectedExpiry);
    if (expiry) return (
      <div className="chart-container">
        <SmileChart expiry={expiry} />
      </div>
    )
  }

  return (
    <div className="chart-container">
      <SurfaceChart surface={surface} selectedExpiry={selectedExpiry} />
    </div>
  )
}

# iv-surface-ui

React frontend for visualizing the BTC/ETH Implied Volatility Surface. This is a pure UI layer — it contains no data fetching logic of its own beyond calling the backend API.

## What This Is

This repo is the frontend only. It:
- Fetches IV surface data from the [iv-surface-engine](https://github.com/EvenG1O/DotNetVolSurface) backend API
- Renders a live 3D volatility surface using Plotly.js
- Switches to a 2D vol smile chart when a single expiry is selected
- Supports BTC and ETH

All data comes from the backend. Without the backend running, this UI will show an error.

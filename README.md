# Real-Time Volatility Surface UI

A React frontend that visualizes live BTC and ETH implied volatility data. 

This repository acts purely as a UI layer, establishing a real-time WebSocket connection to the [.NET Backend](https://github.com/EvenG1O/DotNetVolSurface) to stream Deribit options data.

## Features
- **Live 3D Volatility Surfaces** using Plotly.js.
- **Dynamic 2D Volatility Smiles** for single expiries.
- **WebSocket Integration** for low-latency market updates.
- **Automated Deployment** to GitHub Pages via `npm run deploy`.


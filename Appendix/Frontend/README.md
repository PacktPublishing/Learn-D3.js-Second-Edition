# Frontend: React + D3 SPA demo

This folder contains a simple React Single‑Page Application that demonstrates running multiple D3 visualizations inside React. All visualizations render inside the main page and can be switched via tabs.

## Main changes from the previous `Appendix/Environment` setup
- The main page is a tabs‑based React app. Each tab mounts one D3 visualization inside an isolated container managed by a React component.
- The D3 visualizations are now React components, even though the D3 code is still imperative. The React components use `useEffect` to let D3 imperatively manage the DOM inside a container `div`. This is a common pattern for integrating D3 with React.
- The webpack was reduced to a single entry (`index`) and a single HTML page (`index.html`) that contains the React SPA. The D3 visualizations are now imported as React components instead of separate HTML pages.

## Important notes for React + D3 integration
Use a ref + `useEffect` to let D3 imperatively manage the SVG:
- Create a container `div` via `useRef`, select it with D3, and append/remove the `svg` inside the effect.
- Always clean up in the effect’s return function: remove the `svg` (plus any timers/listeners) to prevent duplicates (and possible memory leaks) during tab switches and hot reloads.
Don't put all D3‑generated DOM in React state. It's better to let D3 manage the DOM directly inside the effect. React state should only hold data that triggers a redraw. For scales, axes, and other derived values, compute them inside the effect or memoize them with `useMemo`. Let D3 update the DOM directly.
Keep the effect dependency array stable. Only include props that should trigger a redraw (e.g., `data`, `width`).

## Project layout (relevant to the SPA)
- `index.html` — HtmlWebpackPlugin template with `<div id="root"></div>`.
- `js/entries/index.js` — React entry that renders `<App/>`.
- `js/react/App.jsx` — App shell with a simple `<Tabs/>` component to switch visualizations.
- `js/react/Tabs.jsx` — A tab UI.
- `js/react/vizcomponents/` — React wrappers around D3 apps from the book: `Viz1.jsx`, `Viz2.jsx`, `Viz3.jsx`, `Viz4.jsx`, `Viz5.jsx`.
- `js/lib/` — Shared D3 utilities.
- `webpack.config.js` — Single entry (`index`), copies assets, transpiles JSX.

## Prerequisites
- Node.js, version 18+ LTS

## Install dependencies

From the repository root:
```bash
cd Appendix/Frontend
npm install
```

## Run the dev server
```bash
npm run dev
```
Open http://localhost:5173 — use the tabs to switch among all five visualizations.

## Build production bundle

```bash
npm run build
```
Artifacts:
- `dist/index.html` (React SPA)
- Hashed JS bundles under `dist/js/`
- Copied assets under `dist/data/`, `dist/css/`, and `dist/viz4/css/`

## Preview

```bash
npm run preview
```
Open http://localhost:8080

## Container (optional)

A simple `Dockerfile` is provided in this folder to serve the production build with nginx:
```bash
npm run build
docker build -t frontend-react-d3 .
docker run --rm -p 8080:80 frontend-react-d3
```
Open http://localhost:8080

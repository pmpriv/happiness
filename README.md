# Happiness Report

Happiness report provides data grid and visulations to analyze the results of Happiness report for years 2018 and 2019.

 - World choropleth map (overview)
 - Data Grid with detailed results
 - Scatter Bubble chart to analyze correlations between overall happiness score and different dimensions

## Stack

 - UI library: `React`/`TypeScript`
 - Bundler/Server: [Vite](https://vitejs.dev/)
 - State management and requests: [Redux Redux Toolkit](https://redux-toolkit.js.org/)

## Architecture and Data flow

Following Redux Toolkit approach, the code is organized in features. Each feature provides components and a store _slice_.
Data is loaded on-demand using RTK query, attached to the main store and consumed using the provided hooks.

## Scripts

- `npm run dev` - start dev server and open browser
- `build` - build for production
- `preview` - locally preview production build
- `process-data` - attach ISO country codes to the data

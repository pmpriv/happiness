# Happiness Report

Happiness report provides data grid and visualizations to analyze the results of [World Happiness report](https://www.kaggle.com/datasets/unsdsn/world-happiness) for years 2018 and 2019.

 - World choropleth map (overview)
 - Data Grid with detailed results
 - Scatter Bubble chart to analyze correlations between happiness score and different dimensions

Demo: https://pmpriv.github.io/happiness


## Stack

 - UI library: `React`/`TypeScript`
 - Bundler/Server: [Vite](https://vitejs.dev/)
 - State management and requests: [Redux Toolkit](https://redux-toolkit.js.org/)


## Architecture and Data flow

Following Redux Toolkit approach, the code is organized in features. Each feature provides components and a store _slice_.
Data is loaded on-demand using RTK query, attached to the main store and consumed using the provided hooks.


## Data and Visualization components:
 - Data Grid: [@mui/x-data-grid](https://mui.com/x/react-data-grid/getting-started/)
 - World map: https://airbnb.io/visx/docs/geo
 - Scatter/Bubble chart: [Victory Charts](https://formidable.com/open-source/victory/docs/victory-scatter/)


## About the data

Years 2018 and 2019 of the origin data source were chosen for this project because they contain the same fields but other years contain different sets of fields.

A script maps the country names to ISO country codes and attaches them to the data statically (see scripts section).


## Scripts

- `npm run dev` - start dev server and open browser
- `build` - build for production
- `preview` - locally preview production build
- `process-data` - attach ISO country codes to the data

## TODO:

 - Improve usability. Allow to switch between the different visualizations and require less scrolling
 - Consider accessibility
 - Make sure UI doesn't "jump" when showing tooltips
 - Improve colors palette overall and specifically in the world map
 - Improve mobile experience
 - Add a horizontal bars visualization to easily compare countries overall score
 - Reduce production main bundle by loading visualizations dynamically
 - Push state up (e.g. BubbleVis component) and add routing to be able to deep link to a specific state using query params
   * Add anchors to be able to link to a specic section
 - Add Analytics/Telemetry
 - Improve error handling, consider failing states add logging
 - Add tests for the common scenarios and the ones are not easily produced such as failing state.
 - Thoroughly check licenses and attribution for used packages
 - Make data retrieve URL configurable
 - Consider caching and immutability of the data files
 - Improve type definitions when it comes to mapping Record<> to DataRecord

## Production readiness:
 
 - [ ] lint in worfkflow commands and commit
 - [ ] test in worfkflow commands
 - [ ] Automatic licenses check
 - [ ] Automatic security check or fail on audit critical dependencies
 - [x] Production build
 - [x] Minified bundle
 - [ ] Set up a quota for main and secondary bundles
 - [x] Automatic deployment
 - [ ] Logging/Analytics/Telemetry
 - [ ] Monitoring & alarms

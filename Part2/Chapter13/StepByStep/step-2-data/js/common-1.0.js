import * as d3 from "https://cdn.skypack.dev/d3@7.9.0";
export { app, dim, chart };

// Will contain data used by the chart and controls to change the views
const chart = {};

const dim = {
    width: 800,
    margin: {top: 15, right: 10, bottom: 5, left: 100}
};

// An object for global settings, functions and configurations
const app = {
    barHeight: 40,      // will be used to compute the height of the chart
    numBars: 10,        // will be used to compute the height of the chart
    scale: {
        x: d3.scaleLinear().range([dim.margin.left, dim.width - dim.margin.right]),
        y: d3.scaleBand().padding(0.1)
    }
}

// Settings that depend on numBars and barHeight
dim.height = app.barHeight * app.numBars - 20;
app.scale.y.domain(d3.range(app.numBars+1))
           .range([dim.margin.top, dim.height - dim.margin.bottom + dim.height/app.numBars]);






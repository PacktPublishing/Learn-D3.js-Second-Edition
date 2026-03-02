import * as d3 from "https://cdn.skypack.dev/d3@7.9.0";
export { app, dim, chart, getTransition };

// Will contain data used by the chart and controls to change the views
const chart = {};

const dim = {
    width: 800,
    margin: {top: 15, right: 10, bottom: 5, left: 100}
};

// An object for global settings, functions and configurations
const app = {
    dur: 250,          // duration of the transition that changes the order of the bars
    numFrames: 10,      // number of transition frames
    barHeight: 40,      // will be used to compute the height of the chart
    numBars: 10,        // will be used to compute the height of the chart
    scale: {
        x: d3.scaleLinear().range([dim.margin.left, dim.width - dim.margin.right]),
        y: d3.scaleBand().padding(0.1)
    },
    color: d3.scaleOrdinal(d3.schemeCategory10.concat(d3.schemeCategory10.map(c => d3.color(c).darker()))),
    fmt: d3.format('.2s'),
}

// Directory where the flags are stored
app.imgDir = "../../data/flags/";

// Settings that depend on numBars and barHeight
dim.height = app.barHeight * app.numBars - 20;
app.scale.y.domain(d3.range(app.numBars+1))
           .range([dim.margin.top, dim.height - dim.margin.bottom + dim.height/app.numBars]);

app.axis = d3.axisTop()
             .scale(app.scale.x)
             .tickSizeOuter(0).tickSizeInner(-dim.height + dim.margin.top + dim.margin.bottom)
             .ticks(dim.width / 100, "s")
             .tickFormat(d => app.fmt(d).replace("G", 'B'));

function getTransition() {
    return d3.transition().duration(app.dur).ease(d3.easeLinear);
}




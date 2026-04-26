import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import {dim, data, app} from "./common.js";
import * as utils from "../../../../js/chart-utils.js";

const svg = d3.select("body").append("svg")
                             .attr("height", dim.height)
                             .attr("width", dim.width);
const chart = svg.append("g");

export function draw() {
    // Render area
    chart.append("path")
         .datum(data.extents)
         .attr("class", "area")
         .attr("d", app.area)
         .attr("fill", "orange")
         .attr("opacity", .5);

    // Render topline
    chart.append("path")
         .datum(data.extents)
         .attr("class", "topline")
         .attr("d", app.topline)
         .attr("fill", "none")
         .attr("stroke", "red")
         .attr("stroke-width", 1);

    // Render baseline
    chart.append("path")
         .datum(data.extents)
         .attr("class", "baseline")
         .attr("d", app.baseline)
         .attr("fill", "none")
         .attr("stroke", "blue")
         .attr("stroke-width", 1);

    // Render median
    chart.append("path")
         .datum(data.medians)
         .attr("class", "median")
         .attr("d", app.medianLine);

    // Draw axes
    utils.cartesianAxes()
         .container(chart)
         .xScale(app.scale.year)
         .yScale(app.scale.temp)
         .xLabel("Years")
         .yLabel("Anomaly (˚C)")();
}
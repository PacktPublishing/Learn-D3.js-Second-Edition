import * as d3 from "https://cdn.skypack.dev/d3@7.9.0";
import {dim, data, app} from "./common.js";
import * as utils from "../../../../js/chart-utils.js";

const svg = d3.select("body").append("svg")
                             .attr("height", dim.height)
                             .attr("width", dim.width);
const chart = svg.append("g");

export function draw() {
    // Draw line
    chart.datum(data.entries)
         .append("path")
            .attr("class", "line")
            .attr("d", app.line);

    // Draw axes
    utils.cartesianAxes()
         .container(chart)
         .xScale(app.scale.date)
         .yScale(app.scale.temp)
         .xLabel("Years")
         .yLabel("Anomaly (˚C)")();
}
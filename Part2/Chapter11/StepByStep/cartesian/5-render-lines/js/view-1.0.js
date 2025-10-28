import * as d3 from "https://cdn.skypack.dev/d3@7";
import {dim, data, app} from "./common-1.1.js";
import * as utils from "../../../../js/chart-utils.js";

const svg = d3.select("body").append("svg")
                             .attr("height", dim.height)
                             .attr("width", dim.width);
const chart = svg.append("g");

export function draw() {

    // Draw temperature lines
    chart.selectAll("g.line")
         .data(data.years)
           .join("g")
             .attr("class", "line")
             .append("path")
                .datum(d => d[1])
                .attr("class", "months")
                .attr("d", app.line)
                .style("stroke", d => app.color(d3.mean(d.map(v => v[1]))));

    // Draw axes
    utils.cartesianAxes()
         .container(chart)
         .xScale(app.scale.month)
         .yScale(app.scale.temp)
         .xLabel("Months")
         .yLabel("Anomaly (˚C)")();

}
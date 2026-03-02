import * as d3 from "https://cdn.skypack.dev/d3@7.9.0";
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

    // Configure events
    chart.selectAll("g.line")
        .on("mouseover", function(event, d) {
            const [x, y] = d3.pointer(event);
            const selectedLine = d3.select(event.target);

            chart.append("text")
                 .attr("class", "year")
                 .attr("x", x + 10)
                 .attr("y", y + 10)
                 .text(d[0])
                 .attr("fill", d3.color(app.color(d3.mean(d[1].map(v => v[1])))).darker().darker());

            chart.selectAll("g.line path") // make all other lines fainter
                 .style("opacity", .35);

            selectedLine.style("stroke-width", 5) // make current line thicker and opaque
                        .style("opacity", 1);
        })
        .on("mouseout", function() {
            chart.selectAll("text.year")
                 .remove(); // remove the year label
            chart.selectAll("g.line path")
                 .style("stroke-width", null)
                 .style("opacity", null); // restore default opacity and stroke-width for all lines
        });

}
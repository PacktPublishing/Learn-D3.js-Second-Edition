import * as d3 from "https://cdn.skypack.dev/d3@7";
import * as utils from "../../../js/chart-utils.js";
import {app, dim, data} from "./common-1.0.js";

const svg = d3.select("body")
              .append("svg")
                .attr("width", "100%")
                .attr("height", "100%")
                .attr("viewBox", `0 0 ${dim.width} ${dim.height}`);

export function draw() {
    // Render the areas
    svg.selectAll("path")
        .data(data.stacked)
        .join("path")
        .attr("d", app.area)
        .style("fill", (d,i) => app.color(i));

    // Render Cartesian axes
    const [,yAxis] = utils.cartesianAxes()
        .container(svg)
        .xScale(app.scale.x)
        .yScale(app.scale.y)
        .xLabel('Years')
        .yLabel('Slaves embarked')
        .showHorizontalGrid(true)();

    yAxis.tickFormat(d3.format(".2s"));
    d3.select("g.y-axis").call(yAxis);

    // add legend at right
    const legend = svg.append("g")
        .attr("transform", `translate(${[dim.width - dim.margin.right + 20, dim.margin.top]})`)

    // Uses the flags as data for the legend, and indexes for colors
    utils.legend()
        .container(legend)
        .data(data.keys)
        .color(app.color)();
}
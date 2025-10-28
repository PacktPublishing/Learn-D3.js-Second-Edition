import * as d3 from "https://cdn.skypack.dev/d3@7";
import * as utils from "../../../../js/chart-utils.js";
import {app, data, dim} from "./common.js";

const svg = d3.select("body")
    .append("svg")
    .attr("height", dim.height)
    .attr("width", dim.width);

export function draw() {
    const chart = svg.append("g");

    chart.append("path")
        .datum(data.stats)
        .attr("class", "area")
        .attr("d", app.area);

    chart.append("path")
        .datum(data.stats)
        .attr("class", "line")
        .attr("d", app.line.base)
        .style("stroke", app.color(0));

    chart.append("path")
        .datum(data.stats)
        .attr("class", "line")
        .attr("d", app.line.avg)
        .style("stroke", app.color(1));

    chart.append("path")
        .datum(data.stats)
        .attr("class", "line")
        .attr("d", app.line.top)
        .style("stroke", app.color(2));

    utils.cartesianAxes()
        .container(chart)
        .xScale(app.scale.x)
        .yScale(app.scale.y)
        .xLabel("Month")
        .yLabel("Rainfall (mm)")
        .showHorizontalGrid(true)();

    const legend = svg.append("g")
        .attr("transform", `translate(${dim.width - dim.margin.right}, ${dim.margin.top})`);
    utils.legend()
        .container(legend)
        .color(app.color)
        .data(["Record minimum", "Median", "Record maximum"])();
}
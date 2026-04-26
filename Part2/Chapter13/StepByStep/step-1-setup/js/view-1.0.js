import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

import {dim} from "./common-1.0.js";

const svg = d3.select("body").append("svg")
    .attr("class", "chart");

export function draw() {
    // 1) Set SVG dimensions
    svg.attr("width", dim.width).attr("height", dim.height);

    // 2) A label to display each year or step
    svg.append("text")
        .attr("class", "step label")
        .attr("x", dim.width - 5)
        .attr("y", dim.height - dim.margin.bottom)
        .text("YEAR");

    // 3) A container for the chart entries (bars + labels + icons)
    svg.append("g")
        .attr("class", "entries");
}
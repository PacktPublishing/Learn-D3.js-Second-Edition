import * as d3 from "https://cdn.skypack.dev/d3@7.9.0";

import {dim, chart, app} from "./common-1.1.js";

// Create SVG container
const svg = d3.select("body").append("svg")
              .attr("class", "chart")

/**
 * Appends the graphical elements (SVG) for the chart.
 * @returns {boolean}
 */
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

    // 4) Show a single year
    show(chart.data[0]);
}

function show(dataFrame) {
    const [year,data] = dataFrame;

    app.scale.x.domain([0, data[0].value * 1.1]);
    drawBars(data);

    d3.select(".step.label").text(year); // updates the date label
}

function drawBars(data) {
    const initWidth = d => app.scale.x(d.value) - app.scale.x(0);
    const initRank = d => `translate(${[app.scale.x(0), app.scale.y(d.rank)]})`;
    const visible = data.slice(0, app.numBars);

    const entry =  svg.select(".entries")
        .selectAll("g.entry")
        .data(visible)
        .join("g")
             .attr("class", "entry")
             .attr("transform", initRank);

    entry.append("rect")
        .attr("class", "bar")
        .attr("height", app.scale.y.bandwidth())
        .attr("width", d => initWidth(d))
        .style("fill", d => app.color(d.country));

    entry.append("text")
        .attr("class", "name label")
        .attr("y", app.scale.y.bandwidth()/2)
        .attr("x", -5) // and align right
        .text(d => d.country)

    entry.append("text")
        .attr("class", "value label")
        .attr("y", app.scale.y.bandwidth()/2)
        .attr("x", d => initWidth(d) + 5)
        .text(d => app.fmt(d.value).replace('G', 'B'))
}
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

    show(chart.data[0]);
}

export function show(dataFrame) {
    const [year,data] = dataFrame;

    app.scale.x.domain([0, data[0].value * 1.1]);
    drawBars(data);

    d3.select(".step.label").text(year); // updates the date label
}

function drawBars(data) {
    const visible = data.slice(0, app.numBars);
    const merged =
        svg.select(".entries")
            .selectAll("g.entry")
            .data(visible, d => d.country)  // must use the country as key
            .join(
                enter => joinEnter(enter),
                update => update,
                exit => joinExit(exit).remove()
            );
    joinUpdate(merged);
}

function joinEnter(enter) {
    const initWidth = d => app.scale.x(d.value) - app.scale.x(0);
    const initRank = d => `translate(${[app.scale.x(0), app.scale.y(d.rank)]})`;

    const enterGrp =
        enter.append("g")
            .attr("class", "entry")
            .attr("transform", initRank);

    enterGrp.append("rect")
        .attr("class", "bar")
        .attr("height", app.scale.y.bandwidth())
        .attr("width", d => initWidth(d))
        .style("fill", d => app.color(d.country));

    enterGrp.append("text")
        .attr("class", "name label")
        .attr("y", app.scale.y.bandwidth()/2)
        .attr("x", -5) // and align right
        .text(d => d.country)

    enterGrp.append("text")
        .attr("class", "value label")
        .attr("y", app.scale.y.bandwidth()/2)
        .attr("x", d => initWidth(d) + 5)
        .text(d => app.fmt(d.value).replace('G', 'B'));

    return enterGrp;
}

function joinUpdate(update) {
    const finalWidth = d => app.scale.x(d.value) - app.scale.x(0);
    const finalRank = d => `translate(${[app.scale.x(0), app.scale.y(d.rank)]})`;

    const updateGrp =
        update.transition().duration(1000)
            .attr("transform", finalRank);

    return resizeBars(updateGrp, finalWidth);
}

function resizeBars(group, width) {
    group.select("rect.bar").attr("width", width)
    group.select("text.value.label")
        .attr("x", d => width(d) + 5)
        .text(d => app.fmt(d.value).replace('G', 'B'));
    return group;
}

function joinExit(exit) {
    const nextRank = d => `translate(${[app.scale.x(0), app.scale.y(d.rank+1)]})`;
    return exit.transition().duration(1000)
               .attr("transform", nextRank);
}
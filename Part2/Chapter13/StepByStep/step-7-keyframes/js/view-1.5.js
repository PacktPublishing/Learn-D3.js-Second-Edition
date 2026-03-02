import * as d3 from "https://cdn.skypack.dev/d3@7.9.0";

import {dim, chart, app, getTransition} from "./common-1.3.js";

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

    // 4) Show the first year
    show(chart.data[0]);
}

export function show(dataFrame) {
    const [year,data] = dataFrame;

    app.scale.x.domain([0, data[0].value * 1.1]);
    drawBars(data);

    d3.select(".step.label").text(Math.round(year)); // this is the only change in this version
}

function drawBars(data) {
    const visible = data.slice(0, app.numBars);

    const merged =
        svg.select(".entries")
            .selectAll("g.entry")
            .data(visible, d => d.country)
            .join(
                enter => joinEnter(enter),
                update => update,
                exit => joinExit(exit).remove()
            );
    joinUpdate(merged);
}

function joinEnter(enter) {
    const initRank = d => `translate(${[app.scale.x(0), app.scale.y(chart.prv(d).rank)]})`;
    const initWidth  = d => app.scale.x(chart.prv(d).value) - app.scale.x(0);
    const initOpacity = d => chart.prv(d).value === d.value ? 1 : 0;

    const enterGrp =
        enter.append("g")
            .attr("class", "entry")
            .attr("transform", initRank)
            .style("opacity", initOpacity)

    enterGrp.append("rect")
        .attr("class", "bar")
        .attr("height", app.scale.y.bandwidth())
        .attr("width", initWidth)
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
    const prevValue = d => chart.prv(d).value;
    const finalRank = d => `translate(${[app.scale.x(0), app.scale.y(d.rank)]})`;
    const finalWidth = d => app.scale.x(d.value) - app.scale.x(0);

    const updateGrp = update.transition(getTransition())
                            .attr("transform", finalRank)
                            .style("opacity", 1)
    return resizeBars(updateGrp, finalWidth, prevValue);
}

function joinExit(exit) {
    const nextValue = d => chart.nxt(d).value;
    const nextRank = d => `translate(${[app.scale.x(0), app.scale.y(chart.nxt(d).rank)]})`;
    const nextWidth = d => app.scale.x(nextValue(d)) - app.scale.x(0);

    const exitGrp = exit.transition(getTransition())
                        .attr("transform", nextRank)
                        .style("opacity", 0)
    return resizeBars(exitGrp, nextWidth, nextValue);
}

function resizeBars(group, width, value) {
    group.select("rect.bar").attr("width", width)
    group.select("text.value.label").attr("x", d => width(d) + 5)
        .textTween(function(d) {
            const i = d3.interpolateNumber(value(d), d.value);
            return t => app.fmt(i(t)).replace("G", 'B');
        });
    return group;
}

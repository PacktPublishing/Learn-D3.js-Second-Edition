import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

import {dim, chart, app, getTransition} from "./common-1.6.js";
import * as animation from "./animation-1.2.js";
import * as utils from "../../../js/chart-utils.js";

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

    // 4) Axes
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${dim.margin.top})`);

    // 5) Create clipping paths for the images - added in this version
    createClipping(svg, app.numBars);

    // 6) Show the first year
    show(chart.data[0]);

    // 7) Add a button to pause the animation
    svg.on("click", animation.pause);

    showLegend();
}

function showLegend() {
    const legend = d3.select("body").append("svg");
    utils.legend()
        .container(legend)
        .color(app.color)
        .useDataAsIndex(true)
        .data(d3.union(chart.continents.values()))();
}

// Create an ID usable in HTML
const makeID = country => country.replace(/ /g,"_");

function createClipping() {
    svg.append("defs")
       .selectAll("clipPath")
         .data(chart.keys)
           .join("clipPath")
             .attr("id", d => `clip-${makeID(d)}`)
             .append("use")
               .attr("href", d => `#bar-${makeID(d)}`);
}

export function show(dataFrame) {
    const [year,data] = dataFrame;

    app.scale.x.domain([0, data[0].value * 1.1]);
    drawBars(data);

    d3.select(".step.label").text(Math.round(year));

    d3.select(".axis")
        .transition(getTransition())
        .call(app.axis);
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
        .attr("id", d => `bar-${makeID(d.country)}`)  // changed - added an ID to the bar
        .attr("height", app.scale.y.bandwidth())
        .attr("width", initWidth)
        .style("fill", d => app.color(chart.continents.get(d.country)));

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

    // added this code to include the flag icons
    const icon = (key) => app.imgDir + chart.icons.get(key) + '.png';

    enterGrp.append("image")
        .attr("class", "bar")
        .attr("preserveAspectRatio", "none")
        .attr("href", d => icon(d.country))
        .attr("height", app.scale.y.bandwidth())
        .attr("width", app.scale.y.bandwidth() * (1 + 2/3))
        .attr("x", d => initWidth(d) - app.scale.y.bandwidth() * (1 + 2/3))
        .attr("clip-path", d => `url(#clip-${makeID(d.country)})`)

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
    group.select("image.bar")
         .attr("x", d => width(d) - app.scale.y.bandwidth() * (1 + 2/3))  // added this line

    return group;
}

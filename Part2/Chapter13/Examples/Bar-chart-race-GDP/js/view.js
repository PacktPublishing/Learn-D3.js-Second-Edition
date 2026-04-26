import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as utils from "../../../js/chart-utils.js";

import {app, dim, chart, getTransition} from "./common.js";
import {togglePause} from "./chart.js";

// Create the SVG container
const svg = d3.select("body")
              .append("svg")
              .attr("class", "chart")


/**
 * Appends the graphical elements (SVG) for the chart.
 * @returns {boolean}
 */
export function renderChart() {

    svg.attr("width", dim.width)
       .attr("height", dim.height);

    // 1) Create clipping paths for the images in bars (to clip the image if the bar is smaller)
    if(app.useIcon) {
        createClipping(svg, app.numBars);
    }

    // 2) Create the axis
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${dim.margin.top})`);

    // 3) A label to display each year or step
    svg.append("text")
        .attr("class", "step label")
        .attr("x", dim.width - 5)
        .attr("y", dim.height - dim.margin.bottom);

    // 4) A container for the chart entries (bars + labels + icons)
    svg.append("g")
        .attr("class", "entries");

    svg.on("click", togglePause); // adds a click event to pause/resume the animation

    // 5) If categories are used, show a legend
    if(app.useCategory) {
        showLegend();
    }

    return true;
}


/**
 * Updates the chart with the current data frame.
 * @param dataFrame
 */
export function updateChart(dataFrame) {
    // updates the x-scale and axis
    app.scale.x.domain([0, dataFrame[1][0].value * 1.1]);
    d3.select(".axis")
        .transition(getTransition())
        .call(app.axis);

    d3.select(".step.label").text(Math.round(dataFrame[0]));   // updates the step label
    updateBars(dataFrame[1]);  // updates the bars and labels
}

/**
 * Make an ID usable in SVG, given a readable name (replaces spaces for "_")
 * @param name
 * @returns {*}
 */
function makeID(name) {
    return name.replace(" ","_");
}

/**
 * Used in updateBars to get the color of the bar. Will use the category if available,
 * otherwise it will use the key itself for colors (colors will repeat after 10 elements).
 * @param key
 * @returns {*}
 */
function color(key) {
    return app.useCategory ? app.colorScale(chart.cats.get(key))
                           : app.colorScale(key); // using the name as a key for colors
}

/**
 * Used in updateBars to get the URL of the image, if the bar has an icon.
 * @param key
 * @returns {string}
 */
function icon(key) {
    return app.img.directory + chart.icons.get(key) + '.png';
}

/**
 * Creates clipping paths (in SVG) for the icons in the bars, if icons are used. This will clip the image
 * if the bar is shorter than the image.
 */
function createClipping() {
    svg.append("defs")
       .selectAll("clipPath")
         .data(chart.keys)
           .join("clipPath")
              .attr("id", d => `clip-${makeID(d)}`)
              .append("use")
                 .attr("href", d => `#bar-${makeID(d)}`);
}

/**
 * Shows a legend if the data contains categories. The legend will use the color scale to show the categories.
 */
function showLegend() {
    const legend = d3.select("body").append("svg");
    utils.legend()
         .container(legend)
         .color(app.colorScale)
         .useDataAsIndex(true)
         .data(d3.union(chart.cats.values()))();
}

/**
 * Updates the bars. It will create, update and remove bars as needed. Bars are g.entry elements and contain
 * a rect.bar element for the bar itself, a text.name.label for the name, and a text.value.label for the value.
 * If icons are used, it will also contain an image.bar element. Updates change the vertical position of the
 * g.entry elements, the width of the rect.bar elements, the x positions of the image.bar elements, and the
 * text.value.label. The text.value.label element will also change its text (in a tween).
 *
 * @param data
 */

function updateBars(data) {
    // Helper functions for previous, next and final width of the bars
    const prevValue = d => chart.prv(d).value;
    const nextValue = d => chart.nxt(d).value;
    const prevWidth  = d => app.scale.x(prevValue(d)) - app.scale.x(0); // previous width
    const nextWidth  = d => app.scale.x(nextValue(d)) - app.scale.x(0); // next width
    const finalWidth = d => app.scale.x(d.value) - app.scale.x(0); // final width

    const merged =
        svg.select(".entries")
            .selectAll("g.entry")
            .data(data.slice(0, app.numBars), d => d.name)
            .join(
                enter => joinEnter(enter, prevWidth),
                update => update,
                exit => joinExit(exit, nextWidth, nextValue).remove()
            );
    joinUpdate(merged, finalWidth, prevValue);
}

/**
 * The enter selection. Called when a new bar is created.
 * @param enter
 * @param barWidth
 * @returns {*}
 */
function joinEnter(enter, barWidth) {
    const enterGrp =
        enter.append("g")
            .attr("class", "entry")
            .attr("transform", d => `translate(${app.scale.x(0)},${app.scale.y(chart.prv(d).rank)})`)
            .style("opacity", d => chart.prv(d).rank <= app.numBars - 1 ? 1 : 0);

    enterGrp.append("rect")
        .attr("class", "bar")
        .attr("id", d => `bar-${makeID(d.name)}`)
        .attr("height", app.scale.y.bandwidth())
        .style("fill", d => color(d.name))
        .attr("width", barWidth)

    if(app.useIcon) {
        enterGrp.append("image")
            .attr("class", "bar")
            .attr("preserveAspectRatio", app.img.svgAspectRatio)
            .attr("href", d => icon(d.name))
            .attr("height", app.scale.y.bandwidth())
            .attr("width", app.scale.y.bandwidth() * (1 + app.img.extraWidth))
            .attr("x", d => barWidth(d) - app.scale.y.bandwidth() * (1 + app.img.extraWidth))
            .attr("clip-path", d => `url(#clip-${makeID(d.name)})`)
    }

    enterGrp.append("text")
        .attr("class", "name label")
        .attr("y", app.scale.y.bandwidth()/2)
        .attr("x", -5) // and align right
        .style("text-anchor", "end")
        .text(d => d.name)

    enterGrp.append("text")
        .attr("class", "value label")
        .attr("y", app.scale.y.bandwidth()/2)
        .attr("x", d => barWidth(d) + 5)
        .text(d => d.value)

    return enterGrp;
}

/**
 * The merged update selection. Called when a bar is updated.
 * @param update
 * @param barWidth
 * @param value
 */
function joinUpdate(update, barWidth, value) {
    const updateGrp =
        update.transition(getTransition())
            .attr("transform", d => `translate(${app.scale.x(0)},${app.scale.y(d.rank)})`)
            .style("opacity", 1)
    resizeBars(updateGrp, barWidth, value);
}

/**
 * The exit selection. Called before a bar is removed.
 * @param exit
 * @param barWidth
 * @param value
 * @returns {*}
 */
function joinExit(exit, barWidth, value) {
    const exitGrp =
        exit.transition(getTransition())
            .attr("transform", d => `translate(${app.scale.x(0)},${app.scale.y(chart.nxt(d).rank)})`)
            .style("opacity", 0)

    return resizeBars(exitGrp, barWidth, value);
}

/**
 * Called by joinExit() and joinUpdate() to resize the bars and update the labels.
 * @param group
 * @param width
 * @param value
 * @returns {*}
 */
function resizeBars(group, width, value) {
    group.select("rect.bar").attr("width", width)
    group.select("image.bar").attr("x", d => width(d) - app.scale.y.bandwidth() * (1 + app.img.extraWidth))
    group.select("text.value.label").attr("x", d => width(d) + 5)
        .textTween(function(d) {
            const i = d3.interpolateNumber(value(d), d.value);
            return t => app.replaceBillions ? app.fmt(i(t)).replace("G", 'B') : app.fmt(i(t));
        });
    return group;
}
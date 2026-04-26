import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import {dim, app} from "./constants.js";

// handle for this page's body tag
const body = d3.select("body");

/**
 * Renders a bar chart with average, maximum or minimum orbital distances in AU.
 */
export function drawChart() {
    sortData();

    // computations
    app.yscale.domain(app.data);
    app.barHeight = app.yscale.bandwidth();
    app.xscale.domain([0, d3.max(app.data, d => d3.max([d.avg,d.max,d.min]))]);
    app.color.domain(app.yscale.domain());

    // draw the chart
    body.append("h1")
        .text(" distance from the Sun")
        .append('span').lower()
             .attr('id', 'title')
             .text(app.charts.get(app.current).title);

    const svg = body.append("svg")
                    .attr("id", "bar-chart")
                    .attr("width", dim.width)
                    .attr("height", dim.height);

    const entries = svg.selectAll(".entry")
                       .data(app.data)
                         .join("g")
                            .attr("class", "entry")
                            .attr("transform", d => `translate(70, ${app.yscale(d)})`);

    entries.append("rect")
            .attr("class", "bar")
            .attr("height", app.barHeight)
            .attr("width", d => app.xscale(d[app.current]))
            .style("fill", d => d.color);

    entries.append("text")
            .attr("class", "category")
            .attr("x", -5)
            .attr("y", app.barHeight/2)
            .text(d => d.name);

    entries.append("text")
            .attr("class", "value")
            .attr("x", d => app.xscale(d[app.current]) + 5)
            .attr("y", app.barHeight/2)
            .text(d => `${app.fmt(d[app.current])} AU`);
}

/**
 * Sorts the dataset
 */
function sortData() {
    app.data.sort((a, b) => d3.ascending(a[app.current], b[app.current]));
}

/**
 * Renders three control buttons to select which chart is to be displayed
 */
export function renderControls() {
    const form = body.append("form");
    app.charts.forEach( (value, key) => {
        form.append("button")
            .attr("type", "button")
            .attr("id", key)
            .property("disabled", app.current === key)
            .on("click", update)
            .text(value.title);
    })
}

/**
 * Updates the chart with new data.
 * @param event The DOM 'click' event. Use event.target to access the button
 * and event.target.id to access the button's id property.
 */
function update(event) {
    app.current = event.target.id; // set new current chart type

    // Update interface
    d3.select("#title")
        .text(app.charts.get(app.current).title);

    d3.selectAll("button")
        .property("disabled", false);
    d3.select(`#${app.current}`)
        .property("disabled", true);

    // Update chart
    sortData(); // re-sort the array with new data

    const entries = body.select("#bar-chart")
                        .selectAll(".entry")
                           .data(app.data) // needs update, because the order changed
                              .transition().duration(1000).delay((d,i) => i*50);

    entries.select(".bar")
            .style("fill", d => d.color) // needs update, because the order changed
            .attr("width", d => app.xscale(d[app.current]));

    entries.select(".category")
            .text(d => d.name); // needs update, because the order changed

    entries.select(".value")
            .attr("x", d => app.xscale(d[app.current]) + 5)
            .text(d => `${app.fmt(d[app.current])} AU`);
}
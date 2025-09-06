import * as d3 from 'https://cdn.skypack.dev/d3@7';
import {dim, app} from './common-1.3.js';

export function draw() {
    d3.select("#chart")
        .append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", `0 0 ${dim.w} ${dim.h}`);

    drawAxes();
    drawChart();
}

function drawChart() {
    d3.select("svg")
        .selectAll("circle.dot")
        .data(app.data.countries)
        .join("circle").attr("class", "dot")
        .attr("r", 1.5)
        .attr("cx", d => app.scale.x(d.hdi))
        .attr("cy", d => app.scale.y(d.gdp));
}

function drawAxes() {
    d3.select("svg")
        .append("g")
        .attr("class", "x-axis")
        // .attr("transform", `translate(${[0, dim.h - dim.margin.h]})`)    // original
        .attr("transform", `translate(${[0, dim.margin.h]})`)               // modified - moves ticks to the top
        .call(app.axis.x);

    d3.select("svg")
        .append("g")
        .attr("class", "y-axis")
        // .attr("transform", `translate(${[dim.margin.w,0]})`)             // original
        .attr("transform", `translate(${[dim.w - dim.margin.w/2, 0]})`)     // modified - moves ticks to the right
        .call(app.axis.y);

    d3.select("svg")
        .append("text")
        .attr("class","label")
        .text("Human Development Index (HDI)")
        .attr("transform", `translate(${[dim.w/2, dim.h - 3]})`)

    d3.select("svg")
        .append("text")
        .attr("class","label")
        .text("Annual GDP per capita (International USD)")
        .attr("transform", `translate(${[3, dim.h/2]}) rotate(90)`)

    // removes the domain lines (not used - see change in main-1.0.css)
    // d3.select(".domain").remove();
}
import * as d3 from 'https://cdn.skypack.dev/d3@7';
import {dim, app} from './common-1.2.js';

export function draw() {
    // Modify the viewBox to show all quadrants
    d3.select("#chart")
        .append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", `${-dim.w} ${0} ${dim.w*2} ${dim.h*2}`)
            .style("background-color", "#e0e0f0")
            .style("border", "0px");

    // Hightlight just the chart area
    d3.select("svg")
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", dim.w)
        .attr("height", dim.h)
        .attr("fill", "white")
        .attr("stroke", "black")

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
        .attr("transform", `translate(${[0, dim.h - dim.margin.h]})`)  // original position
        .call(app.axis.x);

    d3.select("svg")
        .append("g")
        .attr("class", "y-axis")
        .attr("transform", `translate(${[dim.margin.w,0]})`)            // original position
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

    d3.selectAll(".y-axis line, .x-axis line")
        .style("stroke-width", 1)
        .style("stroke", "black");
}
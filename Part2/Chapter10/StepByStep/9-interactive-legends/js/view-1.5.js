import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';
import {dim, app} from './common-1.5.js';
import {drawLegend} from './legend-1.1.js';
import * as tooltip from './tooltips-1.0.js';

export function draw() {
    d3.select("#chart")
        .append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", `0 0 ${dim.w} ${dim.h}`);

    drawAxes();
    drawChart();
    drawLegend();
    tooltip.draw();
}

function drawChart() {
    d3.select("svg")
      .selectAll("circle.dot")
        .data(app.data.countries)
          .join("circle").attr("class", "dot")
            .attr("r", 1.5)
            .attr("cx", d => app.scale.x(d.hdi))
            .attr("cy", d => app.scale.y(d.gdp))
            .style("fill", d => app.color(d.continent))
            .on("mouseenter", tooltip.show)                  // added for tooltip events
            .on("mouseleave", tooltip.clear);
}

function drawAxes() {
    d3.select("svg")
        .append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(${[0, dim.margin.h]})`)
        .call(app.axis.x);

    d3.select("svg")
        .append("g")
        .attr("class", "y-axis")
        .attr("transform", `translate(${[dim.w - dim.margin.w/2, 0]})`)
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
}
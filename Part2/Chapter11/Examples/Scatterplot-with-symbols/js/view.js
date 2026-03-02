import * as d3 from 'https://cdn.skypack.dev/d3@7.9.0';

import * as utils from '../../../js/chart-utils.js';

import {dim, app} from './common.js';
import {drawLegend} from './legend.js';
import * as tooltip from './tooltips.js';

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
            .join("path").attr("class", "dot")
            .attr("d", d => d3.symbol().type(d3[app.symbol(d.continent)]).size(12)(d))
            .attr("transform", d => `translate(${[app.scale.x(d.hdi), app.scale.y(d.gdp)]})`)
            .style("stroke", d => app.color(d.continent))
            .on("mouseenter", tooltip.show)                  // added for tooltip events
            .on("mouseleave", tooltip.clear);
}

function drawAxes() {
    const [xAxis,yAxis] =
        utils.cartesianAxes().container(d3.select("svg"))
         .xScale(app.scale.x)
         .yScale(app.scale.y)
         .xLabel('Human Development Index (HDI)')
         .yLabel('Annual GDP per capita (International USD)')
         .showHorizontalGrid(true)
         .showVerticalGrid(true)();
    d3.select(".x-axis .label").attr("dy", "-1em");
    yAxis.ticks(8, ',');
    d3.select(".y-axis").call(yAxis);
}
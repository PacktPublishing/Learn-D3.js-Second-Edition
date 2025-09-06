import * as d3 from 'https://cdn.skypack.dev/d3@7';
import {dim, app} from './common-1.0.js';

export function draw() {
    d3.select("#chart")
        .append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", `0 0 ${dim.w} ${dim.h}`);

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

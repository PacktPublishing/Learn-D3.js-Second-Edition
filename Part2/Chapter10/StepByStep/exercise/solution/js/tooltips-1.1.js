import * as d3 from 'https://cdn.skypack.dev/d3@7.9.0';
import {app} from './common-1.6.js';

export {draw, show, clear};

const fields = [
    {field: "name", text: d => d.name},
    {field: "gdp", text: d => "GDP: " + app.format.gdp(d.gdp)},
    {field: "hdi", text: d => "HDI: " + d.hdi},
    {field: "pop", text: d => "Population: " + app.format.pop(d.pop).replace("G","B")}
];

const padding = 3;
const lineH = 15;

// tooltips
function draw() {
    const tooltip = d3.select("svg")
                      .append("g")
                        .attr("class", "tooltip")
                        .attr("opacity", 0);

    tooltip.append("rect")
           .attr("width", 80)
           .attr("height", fields.length * lineH)
           .attr("rx", 3)
           .attr("ry", 3)
           .attr("x", -padding)
           .attr("y", -padding);

    tooltip.selectAll("text")
        .data(fields.map(f => f.field))
        .join("text")
        .attr("class", d => d)
        .attr("y", (d, i) => i * lineH);
}

function show(event, d) {
    d3.select(event.target).style("stroke-width", 2);
    makeTooltip(d);
    placeAndShow(d);
}

function makeTooltip(d) {
    fields.forEach(f => d3.select(".tooltip ." + f.field)
          .text(f.text(d)));

    const lengths = d3.selectAll(".tooltip text").nodes()
                      .map(t => t.getComputedTextLength());

    const boxWidth = d3.max(lengths) + padding * 2;

    d3.select(".tooltip rect")
      .attr("width", boxWidth);
}

function placeAndShow(d) {
    const position = [app.scale.x(d.hdi) + 7,
                      app.scale.y(d.gdp) + padding - fields.length * lineH/2];

    d3.select(".tooltip")
      .attr("transform", `translate(${position})`)
      .attr("opacity", 1)
}

function clear(event) {
    d3.select(event.target).style("stroke-width", null);
    d3.select(".tooltip")
        .attr("opacity", 0)
}
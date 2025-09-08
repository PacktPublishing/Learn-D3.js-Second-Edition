import * as d3 from 'https://cdn.skypack.dev/d3@7';
import {app} from './common.js';

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
    d3.select(".tooltip rect").attr("width", boxWidth);
}

function placeAndShow(d) {
    // a) Get the dimensions of the tooltip box
    const boxWidth  = d3.select(".tooltip rect").attr("width");
    const boxHeight = d3.select(".tooltip rect").attr("height");

    // b) Compute where to place the tooltip so that it isn't cropped off the screen
    const dx   = app.scale.x.range()[1] - app.scale.x(d.hdi);
    const xPos = dx < boxWidth ? app.scale.x(d.hdi) - boxWidth - 5
                               : app.scale.x(d.hdi) + 10;

    const dy   = app.scale.y(d.gdp) - app.scale.y.range()[1];
    const yPos = app.scale.y(d.gdp) > boxHeight/2 ? app.scale.y(d.gdp) - boxHeight/4 - 10
                                                  : boxHeight/4 + app.scale.y(d.gdp) - dy;

    // c) Place the tooltip near the object
    d3.select(".tooltip")
      .attr("opacity", 1)
      .attr("transform", `translate(${[xPos, yPos]})`)
}

function clear(event) {
    d3.select(event.target).style("stroke-width", null);
    d3.select(".tooltip")
        .attr("opacity", 0)
}
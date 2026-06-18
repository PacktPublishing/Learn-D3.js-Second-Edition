import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';
import {app} from './common-1.5.js';

export {draw, show, clear};

const fields = [
    {field: "name", text: d => d.name},
    {field: "gdp", text: d => "GDP: " + app.format.gdp(d.gdp)},
    {field: "hdi", text: d => "HDI: " + d.hdi}
];

const padding = 3;
const lineH = 15;

// tooltips
function draw() {
    // Create a group for the tooltip elements, initially hidden, at 0,0
    const tooltip = d3.select("svg")
                      .append("g")
                        .attr("class", "tooltip")
                        .attr("opacity", 0);

    // Add a rectangle as the background for the tooltip
    tooltip.append("rect")
           .attr("width", 80)
           .attr("height", fields.length * lineH)
           .attr("rx", 3)
           .attr("ry", 3)
           .attr("x", -padding)
           .attr("y", -padding);

    // Add text elements for each field in the tooltip
    tooltip.selectAll("text")
        .data(fields.map(f => f.field))
        .join("text")
        .attr("class", d => d)
        .attr("y", (d, i) => i * lineH);
}

function show(event, d) {
    d3.select(event.target).attr("r", 4);
    makeTooltip(d);
    placeAndShow(d);
}

function makeTooltip(d) {
    // Update the text fields in the tooltip - select by class name and set text using the functions in the fields array
    fields.forEach(f => d3.select(".tooltip ." + f.field)
          .text(f.text(d)));

    // Get the width of the longest text element
    const lengths = d3.selectAll(".tooltip text").nodes()
                      .map(t => t.getComputedTextLength());

    // Compute the width of the tooltip box based on the longest text element
    const boxWidth = d3.max(lengths) + padding * 2;

    // Update the width of the tooltip rectangle
    d3.select(".tooltip rect")
        .attr("width", boxWidth);
}

function placeAndShow(d) {
    // Calculate the position for the tooltip
    const position = [app.scale.x(d.hdi) + 7,
                      app.scale.y(d.gdp) + padding - fields.length * lineH/2];

    // Place and show the tooltip
    d3.select(".tooltip")
      .attr("transform", `translate(${position})`)
      .attr("opacity", 1)
}

function clear(event) {
    d3.select(event.target).attr("r", 1.5);
    d3.select(".tooltip")
        .attr("opacity", 0)
}
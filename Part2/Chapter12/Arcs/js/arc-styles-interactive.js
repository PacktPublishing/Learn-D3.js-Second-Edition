import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const svg = d3.select(".chart-panel svg");

const dim = {};
dim.width  = svg.attr("width");
dim.height = svg.attr("height");

svg.append("g")
    .attr("class", "chart")
    .attr("transform", `translate(${[dim.width/2, dim.height/2]})`);

const slices = [
    {startAngle: 0,        endAngle: Math.PI * 120/180},
    {startAngle: Math.PI * 120/180, endAngle: Math.PI * 210/180},
    {startAngle: Math.PI * 210/180, endAngle: Math.PI * 270/180},
    {startAngle: Math.PI * 270/180, endAngle: Math.PI * 300/180},
    {startAngle: Math.PI * 300/180, endAngle: Math.PI * 330/180},
    {startAngle: Math.PI * 330/180, endAngle: Math.PI * 350/180},
    {startAngle: Math.PI * 350/180, endAngle: Math.PI * 2}
];
const arc = d3.arc();
const colors = d3.scaleOrdinal(d3.schemeCategory10);

d3.select(".chart")
    .selectAll("path.slice")
    .data(slices)
    .join("path")
    .attr("class", "slice")
    .attr("d", arc)
    .style("fill", (d,i) => colors(i));

const elements = ["outerRadius", "innerRadius", "cornerRadius", "padAngle", "padRadius", "strokeWidth", "stroke"];

elements.forEach(element => {
    d3.select(`#${element}`)
        .on("input", function(event, d) {
            d3.select(`#${element}Value`)
                .text(event.target.value);
            update(arc);
        });
});

update(arc);

// Update the arc styles
function update(arc) {

    const outerRadius  = d3.select("#outerRadiusValue").text();
    const innerRadius  = d3.select("#innerRadiusValue").text();
    const cornerRadius = d3.select("#cornerRadiusValue").text();
    const padAngle     = d3.select("#padAngleValue").text();
    const padRadius    = d3.select("#padRadiusValue").text();
    const strokeWidth  = d3.select("#strokeWidthValue").text();
    const stroke       = d3.select("#strokeValue").text();

    arc.innerRadius(innerRadius)
        .outerRadius(outerRadius)
        .cornerRadius(cornerRadius)
        .padAngle(padAngle)
        .padRadius(padRadius);

    d3.selectAll(".slice")
        .attr("d", arc)
        .style("stroke-width", strokeWidth)
        .style("stroke", stroke);
}
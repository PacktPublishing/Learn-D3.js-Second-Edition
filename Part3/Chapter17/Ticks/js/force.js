import * as d3 from "https://cdn.skypack.dev/d3@7.9.0";

const width = 400, height = 400;
const svg = d3.select("body").append("svg").attr("width",width).attr("height",height);
const chart = svg.append("g").attr("transform", `translate(${[width/2,height/2]})`);

export const nodes = [
    {node: 'A', value: 79},
    {node: 'B', value: 15},
    {node: 'C', value: 24},
    {node: 'D', value: 44},
    {node: 'E', value: 125},
    {node: 'F', value: 22},
    {node: 'G', value: 20},
    {node: 'H', value: 64},
];

const color = d3.scaleOrdinal(d3.schemeCategory10)
    .domain([0,nodes.length]);

export function draw() {
    chart.selectAll("circle")
        .data(nodes).join("circle")
        .attr("r", 15)
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .style("fill", (d,i) => color(i));
}

export function redraw() {
    chart.selectAll("circle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
}
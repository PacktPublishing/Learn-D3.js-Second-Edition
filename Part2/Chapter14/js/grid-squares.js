import * as d3 from "https://cdn.skypack.dev/d3@7.9.0";
import {gridData} from "./grid-data.js";

export {makeChart, drawGrid, drawSquare, container};

// initial viewport
const svg = d3.create("svg")
              .attr("class", "main-svg")
              .style("border", "1px solid blue");

// fixed context layer (for axes, grids, legends, and other fixed elements)
const ctx = svg.append("g")
                 .attr("class", "context");

// zoomable viewport
const chart = ctx.append("svg")
                 .attr("class", "chart");

// container for all zoomable objects (apply the transform to this object)
const container = chart.append("g")
                       .attr("class", "container");

const lineWidth = d => d[0][0] === chart.width/2 || d[1][1] === chart.height/2 ? 3 : 1;

// Draw the grid
function makeChart(margin, width, height) {
    chart.width = width - margin * 2;
    chart.height = height - margin * 2;

    // Set dimensions and positions
    svg.attr("width", width).attr("height", height);                // main viewport (fixed)
    ctx.attr("transform", `translate(${[margin,margin]})`);         // context layer (fixed)
    chart.attr("width", chart.width).attr("height", chart.height);  // zoomable viewport

    // A border for the context layer
    ctx.append("rect")
        .attr("width", chart.width).attr("height", chart.height)
        .style("fill", "none").style("stroke", "green");

    d3.select("body").append(() => svg.node());

    return chart;
}

function drawGrid(width, height) {

    // background (to allow pointer events over empty parts of the chart)
    container.append("rect")
             .attr("class", "grid background")
             .attr("width", width)
             .attr("height", height)
             .style("fill", "none")
             .style("pointer-events", "all");

    return container.selectAll("path.grid")
                    .data(gridData(width, height))
                      .join("path")
                        .attr("class",d => `grid ${lineWidth(d) === 3 ? "major" : "minor"}`)
                        .attr("d", d3.line())
                        .style("stroke", "#777")
                        .style("stroke-width", d => lineWidth(d));
}

// Draw one square
function drawSquare(x,y,w,h,color) {
    return container.append("rect").attr("class","square")
                    .attr("x",x).attr("y",y)
                    .attr("width", w).attr("height", h)
                    .style("fill", color)
                    .style("stroke", "black")
                    .style("fill-opacity", .8);
}


import * as d3 from "https://cdn.skypack.dev/d3@7.9.0";
import {gridData} from "./grid-data.js";

export {makeCanvas, paintGrid, paintSquare, canvas, ctx};

const canvas = d3.create("canvas")
                 .style("border", "solid 1px green");
const ctx = canvas.node().getContext("2d");
const chart = {}    // zoomable area

// Set up the initial canvas
function makeCanvas(margin, width, height) {
    chart.width = width - margin * 2;
    chart.height = height - margin * 2;

    canvas.attr("width", chart.width)
          .attr("height", chart.height)

    d3.select("body")
        .append("div")
        .style("border", "solid 1px blue")
        .style("width", width + "px")
        .style("height", height + "px")
        .style("padding-top", margin + "px")
        .style("padding-left", margin + "px")
        .append(() => canvas.node());

    return chart;
}

const lineWidth = d => d[0][0] === chart.width/2 || d[1][1] === chart.height/2 ? 3 : 1;

// Paint the canvas (called after each update)
function paintGrid(width, height) {
    const data = gridData(width, height);
    ctx.fillStyle = "transparent";
    ctx.strokeStyle = "#777";
    data.forEach(d => {
        ctx.beginPath();
        ctx.lineWidth = lineWidth(d);
        d3.line().context(ctx)(d);
        ctx.stroke();
    });
    ctx.strokeStyle = "transparent";
}

// Paint one square
function paintSquare(x,y,w,h,color) {
    ctx.fillStyle = color;
    ctx.strokeStyle = "black";
    ctx.globalAlpha = 0.8;
    ctx.fillRect(x,y,w,h);
    ctx.strokeRect(x,y,w,h);
}
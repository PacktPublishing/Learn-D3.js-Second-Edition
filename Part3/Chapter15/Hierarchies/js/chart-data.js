import * as d3 from "https://cdn.skypack.dev/d3@7";

export function drawChartSize(chart, chartSize) {
    chart.append("rect")    // draw the box to show the computed size used for the chart
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", chartSize[0])
        .attr("height", chartSize[1])
        .style("fill", "none")
        .style("stroke", "red");

    // draw a lightgray grid with 100px spacing
    for(let i = 0; i < chartSize[0]; i += 100) {
        chart.append("line")
            .attr("x1", i)
            .attr("y1", 0)
            .attr("x2", i)
            .attr("y2", chartSize[1])
            .style("stroke", "lightgray");
    }
    for(let i = 0; i < chartSize[1]; i += 100) {
        chart.append("line")
            .attr("x1", 0)
            .attr("y1", i)
            .attr("x2", chartSize[0])
            .attr("y2", i)
            .style("stroke", "lightgray");
    }
}
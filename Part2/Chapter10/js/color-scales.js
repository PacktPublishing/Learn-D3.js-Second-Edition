import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';

/**
 * Draws a simple color channel scale
 * @param order 0, 1, 2 - where the channel will be displayed (first, second or third)
 * @param scale A scaling function for the channel
 * @param axis  The axis for the channel
 * @param data  The data for the channel
 * @param func  The function to be used to generate the colors (one variable dimension, two fixed dimensions)
 * @param label The label to be placed at right
 */
export function drawScale(order, scale, axis, data, func, label) {
    // channel axis
    const channel = d3.select("svg")
        .append("g")
        .call(axis)
        .attr("transform",`translate(0,${50 * order})`);

    // colors
    channel.selectAll("rect")
        .data(data).join("rect")
        .attr("width",2.5)
        .attr("height",20)
        .attr("x", scale)      // same as d => scale(d)
        .attr("y",-20)
        .style("fill", func);  // same as d => func(d)

    // label
    channel.append("text")
        .attr("class", "label")
        .attr("x", 510)
        .attr("y",-5)
        .text(label)
}
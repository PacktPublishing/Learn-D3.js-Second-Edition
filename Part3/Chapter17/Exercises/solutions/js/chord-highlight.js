/**
 * This module provides functions to add interactive highlighting and tooltips to D3.js chord diagrams.
 * Instructions:
 * 1. Import the module using a prefix like `import * as highlight from './chord-highlight.js';`
 * 2. Call `highlight.setup(chords, headers, color, minimum)` to set up the highlighting and tooltips, where
 *   - `chords` is the array of chord data,
 *   - `headers` is the array of group names,
 *   - `color` is a D3 color scale function (optional, defaults to d3.interpolateRainbow),
 *   - `minimum` is the minimum value to display in the tooltip (optional, defaults to 100). If a value is below this,
 *      the tooltip will display "less than [minimum]".
 *
 * @module chord-highlight
 */

import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

let chords = [];
let headers = [];
let color = null;
let minimum = 100; // Minimum value to display

export function setup(_chords, _headers, _color = d3.scaleSequential(d3.interpolateRainbow), _minumum = 100) {
    if(arguments.length < 2) {
        throw new Error("setup function requires at least two arguments: chords and headers");
    }
    chords = _chords;
    headers = _headers;
    color = _color;
    minimum = _minumum;

    const tooltip = d3.select(".chart")
        .append("g")
        .attr("class", 'tooltip hidden')
        .attr("transform", `translate(${[-75, -50]})`)
        .style("opacity", 0)
        .style("pointer-events", "none");

    // Add tooltip rectangles
    tooltip.append("rect").attr("class", "in")
        .attr("width",150)
        .attr("height",50)
        .attr("rx", 10)
        .attr("ry", 10)
        .style("fill-opacity", .8)
        .style("stroke",'gray');

    tooltip.append("rect").attr("class", "out")
        .attr("y", 60)
        .attr("width",150)
        .attr("height",50)
        .attr("rx", 10)
        .attr("ry", 10)
        .style("fill-opacity", .8)
        .style("stroke",'gray');

    tooltip.append("text").attr('id', 'btoa')
        .attr("x", 5)
        .attr("y", 20)
        .each(function() {
            d3.select(this).append('tspan').text('')
            d3.select(this).append('tspan').attr("x",20).attr('dy', 15).text('');
        });

    tooltip.append("text").attr('id', 'atob')
        .attr("x", 5)
        .attr("y", 80)
        .each(function() {
            d3.select(this).append('tspan').text('')
            d3.select(this).append('tspan').attr("x",20).attr('dy', 15).text('');
        });

    // Add interactive highlighting
    d3.select(".chart").selectAll('path.arc')
        .on("mouseover", highlightNode)
        .on("mouseout", () => d3.selectAll("path.arc, path.ribbon").classed('faded', false));

    d3.select(".chart").selectAll('path.ribbon')
        .on("mouseover", highlightRibbon)
        .on("mouseout", () => {
            d3.selectAll("path.arc, path.ribbon").classed('faded', false);
            d3.select('.tooltip').transition().style("opacity", 0);
        });
}

// Highlights selected node, all ribbons connected to it, and connected nodes
function highlightNode(evt, node) {
    const connected = chords.filter(edge => edge.source.index === node.index || edge.target.index === node.index);
    d3.selectAll("path.arc")
        .classed('faded', n => !(n.index === node.index)
            && !connected.some(t => t.target.index === n.index)
            && !connected.some(t => t.source.index === n.index));
    d3.selectAll("path.ribbon")
        .classed('faded', e => !(e.source.index === node.index || e.target.index === node.index));
}

// Highlights selected ribbon and both nodes it connects
function highlightRibbon(evt, edge) {
    d3.selectAll("path.arc")
        .classed('faded', node => !(node.index === edge.source.index || node.index === edge.target.index))
    d3.selectAll("path.ribbon")
        .classed('faded', e => !(e.source.index === edge.source.index && e.target.index === edge.target.index));
    showTooltip(edge);
}

// Show tooltip with information about the hovered ribbon
function showTooltip(edge) {
    const fmt = d3.format(",.0f");
    d3.select('.tooltip')
        .transition()
        .style("opacity", 1);
    d3.select('.tooltip .in')
        .transition()
        .style("fill", color(edge.source.index))
    d3.select('.tooltip .out')
        .transition()
        .style("fill", color(edge.target.index))

    d3.select('#atob tspan:nth-child(1)').text(headers[edge.source.index] + " to " + headers[edge.target.index]);
    d3.select('#btoa tspan:nth-child(1)').text(headers[edge.target.index] + " to " + headers[edge.source.index]);
    d3.select('#atob tspan:nth-child(2)').text(edge.target.value ? fmt(edge.target.value) : 'less than ' + fmt(minimum));
    d3.select('#btoa tspan:nth-child(2)').text(edge.source.value ? fmt(edge.source.value) : 'less than ' + fmt(minimum));
}
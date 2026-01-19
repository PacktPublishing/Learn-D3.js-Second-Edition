/**
 * Repeated code from chord examples in the draw function.
 */

import * as d3 from "https://cdn.skypack.dev/d3@7.9.0";

export const dim = {width: 800, height: 800, margin: 100};
export const chart = d3.select("body").append("svg").attr("width", dim.width).attr("height", dim.height)
                       .append("g").attr("class", "chart")
                       .attr("transform", `translate(${[dim.margin / 2 + dim.width / 2, dim.margin / 2 + dim.height / 2]})`);

// Default data
export const matrix = [
    [0, 3, 3, 3, 0, 0, 0, 2, 4],
    [3, 0, 5, 0, 0, 0, 0, 0, 0], // smallest group (B)
    [8, 5, 0, 6, 0, 0, 4, 0, 0],
    [9, 0, 8, 0, 9, 0, 0, 0, 0], // largest group (D)
    [0, 0, 0, 9, 0, 8, 0, 0, 0],
    [0, 0, 0, 0, 9, 0, 7, 8, 0],
    [0, 0, 9, 0, 0, 7, 0, 7, 0],
    [3, 0, 0, 0, 0, 8, 6, 0, 7],
    [4, 0, 0, 0, 0, 0, 0, 9, 0]
];
export const headers = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

// Configure chords function to sort subgroups in descending order
// wider ribbons in each node will be first, thinner ones last
const chord = d3.chord()
                .padAngle(.3)
                .sortGroups((a, b) => d3.descending(a, b))
                .sortSubgroups((a, b) => d3.descending(a, b)); // sort subgroups (ribbons) within each group (node)

// Create the chords from the matrix data
export const chords = chord(matrix);

// Create the ribbon generator
const radius = dim.height / 2 - dim.margin;
const ribbon = d3.ribbon().radius(radius);

// Color scale function
export const color = d3.scaleSequential(d3.interpolateRainbow).domain([0, matrix.length]);

// Draw the chord diagram
export function draw(chords, _headers = headers, interactive = false) {
    chart.selectAll('path.ribbon')
        .data(chords)
            .join("path").attr("class", 'ribbon')
            .attr("d", ribbon)
            .style("fill", d => color(d.source.index));

    const arc = d3.arc().innerRadius(radius + 2).outerRadius(radius + 30);
    chart.selectAll('path.arc')
        .data(chords.groups)
            .join("path").attr("class", 'arc')
            .attr("d", arc)
            .style("fill", d => d3.color(color(d.index)).darker());

    const textAngle = d => (arc.endAngle()(d) + arc.startAngle()(d)) * 90 / Math.PI;
    chart.selectAll("text")
        .data(chords.groups)
            .join("text")
            .attr("x", d => arc.centroid(d)[0])
            .attr("y", d => arc.centroid(d)[1])
            .style("fill", d => d.value === 0 ? 'black' : contrast(color(d.index)))
            .text(d => _headers[d.index])
            .attr("transform", d => `rotate(${textAngle(d)},${arc.centroid(d)})`);

    // Add interactivity if specified
    if(interactive) {
        const tooltip = d3.select(".chart")
            .append("g")
            .attr("class", 'tooltip hidden')
            .attr("transform", `translate(${[-75, -50]})`)
            .style("opacity", 0)
            .style("pointer-events", "none");

        // Add tooltip rectangles
        tooltip.append("rect")
            .attr("width",150)
            .attr("height",50)
            .attr("rx", 10)
            .attr("ry", 10)
            .style("fill-opacity", .8)
            .style("stroke",'gray');

        tooltip.append("rect")
            .attr("y", 60)
            .attr("width",150)
            .attr("height",50)
            .attr("rx", 10)
            .attr("ry", 10)
            .style("fill-opacity", .8)
            .style("stroke",'gray');

        tooltip.append("text").attr('id', 'atob')
            .attr("x", 5)
            .attr("y", 20)
            .each(function() {
                d3.select(this).append('tspan').text('')
                d3.select(this).append('tspan').attr("x",20).attr('dy', 15).text('');
            });

        tooltip.append("text").attr('id', 'btoa')
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
        d3.select('.tooltip rect:nth-child(1)')
            .transition()
            .style("fill", color(edge.source.index))
        d3.select('.tooltip rect:nth-child(2)')
            .transition()
            .style("fill", color(edge.target.index))

        d3.select('#atob tspan:nth-child(1)').text(_headers[edge.source.index] + " to " + _headers[edge.target.index]);
        d3.select('#btoa tspan:nth-child(1)').text(_headers[edge.target.index] + " to " + _headers[edge.source.index]);
        d3.select('#atob tspan:nth-child(2)').text(fmt(edge.source.value));
        d3.select('#btoa tspan:nth-child(2)').text(fmt(edge.target.value));
    }
}

// Luminance contrast function
export function contrast(color, darker = false) {
    const c = d3.hsl(darker ? color : d3.color(color).darker());
    return c.l > .5 ? 'black' : 'white';
}
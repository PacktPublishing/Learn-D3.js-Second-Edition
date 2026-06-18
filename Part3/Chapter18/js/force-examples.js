/**
 * Created by helderdarocha on 17/01/19.
 */

import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';

// Diverging colors (blue is negative, red is positive)
const colors = ['#b2182b','#d6604d','#f4a582','#fddbc7','#f7f7f7','#d1e5f0','#92c5de','#4393c3','#2166ac'];

// Reference setup
export const dim = {width: 500, height: 500, margin: 100, cols: 3};
const svg = d3.select("body").append("svg").attr("width",dim.width).attr("height",dim.height);
export const chart = svg.append("g").attr("transform", `translate(${[dim.width/2,dim.height/2]})`);

export function setup(width, height) {
    dim.width = width;
    dim.height = height;
    svg.attr("width",dim.width).attr("height",dim.height);
    chart.attr("transform", `translate(${[dim.width/2,dim.height/2]})`);
}

// Update simulation positions
export function updateChart() {
    chart.selectAll('line.simulation')
        .attr("x1", d => d.source.x)
        .attr("x2", d => d.target.x)
        .attr("y1", d => d.source.y)
        .attr("y2", d => d.target.y);

    chart.selectAll('g.simulation')
        .attr("transform", d => `translate(${[d.x, d.y]})`);
}

// Using grid for positioning
function grid(nodes) {
    // Initial position in grid
    const step = (dim.width - dim.margin) * dim.cols / (nodes.length);
    nodes.forEach(function(node, i) {
        node.x = (-i % dim.cols + (nodes.length/dim.cols-1)/2) * step;
        node.y = (-Math.floor(i/dim.cols) + (nodes.length/dim.cols-1)/2) * step;
    });
}

// Using center for positioning
function center(nodes) {
    // Initial position - all nodes overlapped in center
    nodes.forEach(function(node, i) {
        node.x = 0;
        node.y = 0;
    });
}

// These functions must be called *after* setting up the nodes positions
// (after calling forceSimulation(nodes) and forceLink(links) if links are used)
export function drawReferenceBackgroundGrid(nodes, links) {
    drawReferenceBackground(grid, nodes, links)
}

export function drawReferenceBackgroundCenter(nodes) {
    drawReferenceBackground(center, nodes)
}

function drawReferenceBackground(reference, nodes, links) {
    // draw margins
    svg.append('line').attr("x1", dim.margin/2).attr("y1", dim.margin/2).attr("x2", dim.margin/2).attr("y2", dim.height-dim.margin/2)
        .attr("class", 'margin')
    svg.append('line').attr("x1", dim.width-dim.margin/2).attr("y1", dim.margin/2).attr("x2", dim.width-dim.margin/2).attr("y2", dim.height-dim.margin/2)
        .attr("class", 'margin')
    svg.append('line').attr("x1", dim.margin/2).attr("y1", dim.margin/2).attr("x2", dim.width - dim.margin/2).attr("y2", dim.margin/2)
        .attr("class", 'margin')
    svg.append('line').attr("x1", dim.margin/2).attr("y1", dim.height-dim.margin/2).attr("x2", dim.width-dim.margin/2).attr("y2", dim.height-dim.margin/2)
        .attr("class", 'margin')

    reference(nodes);

    // draw grid
    chart.selectAll("line.v")
        .data(nodes.filter((n,i) => Math.floor(i / 3) === 0))
        .join("line").attr("class", 'v')
        .attr("x1", d => d.x).attr("y1", -dim.height/2).attr("x2", d => d.x).attr("y2", dim.height/2)
        .style("stroke", 'rgb(255,0,0,.3)');
    chart.selectAll("line.h")
        .data(nodes.filter((n,i) => i % 3 === 0))
        .join("line").attr("class", 'h')
        .attr("x1", -dim.width/2).attr("y1", d => d.y).attr("x2", dim.width/2).attr("y2", d => d.y)
        .style("stroke", 'rgb(255,0,0,.3)')

    // draw link references if links object exists (must call forceLink(links) first because it references x,y coords in source and target nodes)
    if(links) {
        chart.selectAll('line.reflink')
            .data(links)
            .join('line').attr("class",'reflink')
            .attr("x1", d => d.source.x)
            .attr("x2", d => d.target.x)
            .attr("y1", d => d.source.y)
            .attr("y2", d => d.target.y)
            .style("fill", 'none')
            .style("stroke", 'black')
            .style("stroke-width", 2)
    }

    // draw reference
    chart.selectAll('g.reference')
        .data(nodes)
        .join("g").attr("class", "reference")
        .each(function(d,i) {
            d3.select(this)
                .append("circle")
                .attr("r", 15)
                .attr("cx", d => d.x)
                .attr("cy", d => d.y)
                .style("fill", '#ddd')
                .style("stroke", '#999')
                .attr('stroke-dasharray', '2 2');
            d3.select(this)
                .append("text")
                .style("fill", 'gray')
                .text(d => d.node)
                .attr("x", d => d.x)
                .attr("y", d => d.y);

        });
}

export function drawChart(nodes, links, nodeSize = 15, text = d => d.node, strokeWidth = 2) {
    if(links) {
        chart.selectAll('line.simulation')
            .data(links).enter()
            .append('line').attr("class",'simulation')
            .attr("x1", d => d.source.x)
            .attr("x2", d => d.target.x)
            .attr("y1", d => d.source.y)
            .attr("y2", d => d.target.y)
            .style("fill", 'none')
            .style("stroke", 'black')
            .style("stroke-width", strokeWidth)
    }

    chart.selectAll('g.simulation')
        .data(nodes).join("g").attr("class", "simulation")
        .attr("transform", d => `translate(${[d.x, d.y]})`)
        .each(function(d,i) {
            d3.select(this)
                .append("circle")
                .attr("r", nodeSize)
                .style("fill", colors[i])
                .style("stroke", 'black')
            d3.select(this)
                .append("text")
                .text(text)
                .style("fill", contrast(colors[i]))
        });

    return chart;
}


export function drawGuidelinesX(value) {
    chart.append("line").attr("class", "center")
        .attr("x1", -value).attr("y1", -dim.height / 2).attr("x2", -value).attr("y2", dim.height / 2)
        .style("stroke", 'green')
        .style("stroke-dasharray", "5 5");
    chart.append("line").attr("class", "center")
        .attr("x1", value).attr("y1", -dim.height / 2).attr("x2", value).attr("y2", dim.height / 2)
        .style("stroke", 'green')
        .style("stroke-dasharray", "5 5");
}

export function drawCrossline(x, y) {
    chart.append("line").attr("class", "center")
        .attr("x1", x).attr("y1", y - 40).attr("x2", x).attr("y2", y + 40)
        .style("stroke", 'green');
    chart.append("line").attr("class", "center")
        .attr("x1", x - 40).attr("y1", y).attr("x2", x + 40).attr("y2", y)
        .style("stroke", 'green');
}

export function drawGuidelinesY(value) {
    chart.append("line").attr("class", "center")
        .attr("x1", -dim.width / 2).attr("y1", -value).attr("x2", dim.width / 2).attr("y2", -value)
        .style("stroke", 'green')
        .style("stroke-dasharray", "5 5");
    chart.append("line").attr("class", "center")
        .attr("x1", -dim.width / 2).attr("y1", value).attr("x2", dim.width / 2).attr("y2", value)
        .style("stroke", 'green')
        .style("stroke-dasharray", "5 5");
}

export function drawGuideCircle(radius) {
    chart.append("circle").attr("class", "center")
        .attr("r", radius)
        .style("fill","none")
        .style("stroke", 'green')
        .style("stroke-dasharray", "5 5");
}

export function contrast(color) {
    const c = d3.rgb(color);
    return (c.r * 0.299 + c.g * 0.587 + c.b * 0.114) > 130 ? 'black' : 'white';
}
/**
 * Force Simulator
 */

import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export {setupPanel, init};

const width = 800;
const height = 600;
const margin = 100;

const color = d3.scaleOrdinal(d3.schemeCategory10);
const radius = d3.scaleLinear().range([10,50]);

const nodes = [
    {node: 'A', value: 79},
    {node: 'B', value: 15},
    {node: 'C', value: 24},
    {node: 'D', value: 44},
    {node: 'E', value: 125},
    {node: 'F', value: 22},
    {node: 'G', value: 20},
    {node: 'H', value: 64},
    {node: 'I', value: 69},
    {node: 'J', value: 2},
    {node: 'K', value: 8},
    {node: 'L', value: 40},
    {node: 'M', value: 26},
    {node: 'N', value: 69},
    {node: 'O', value: 77},
    {node: 'P', value: 17},
    {node: 'Q', value: 1},
    {node: 'R', value: 58},
    {node: 'S', value: 63},
    {node: 'T', value: 91},
    {node: 'U', value: 29},
    {node: 'V', value: 10},
    {node: 'W', value: 23},
    {node: 'X', value: 2},
    {node: 'Y', value: 20},
    {node: 'Z', value: 1},
];

const links = [
    {source: 0, target: 4, value: 2},
    {source: 4, target: 8, value: 2},
    {source: 8, target: 14, value: 2},
    {source: 14, target: 20, value: 2},
    {source: 0, target: 1, value: 1},
    {source: 1, target: 2, value: 1},
    {source: 2, target: 3, value: 1},
    {source: 3, target: 4, value: 1},
    {source: 4, target: 5, value: 1},
    {source: 5, target: 6, value: 1},
    {source: 6, target: 7, value: 1},
    {source: 7, target: 8, value: 1},
    {source: 8, target: 9, value: 1},
    {source: 9, target: 10, value: 1},
    {source: 10, target: 11, value: 1},
    {source: 11, target: 12, value: 1},
    {source: 12, target: 13, value: 1},
    {source: 13, target: 14, value: 1},
    {source: 14, target: 15, value: 1},
    {source: 15, target: 16, value: 1},
    {source: 16, target: 17, value: 1},
    {source: 17, target: 18, value: 1},
    {source: 18, target: 19, value: 1},
    {source: 19, target: 20, value: 1},
    {source: 20, target: 21, value: 1},
    {source: 21, target: 22, value: 1},
    {source: 22, target: 23, value: 1},
    {source: 23, target: 24, value: 1},
    {source: 24, target: 25, value: 1}
];

color.domain([0,nodes.length]);
radius.domain(d3.extent(nodes, d => d.value));

const svg = d3.select(".svg").append("svg").attr("width",width).attr("height",height);
const chart = svg.append("g").attr("transform", `translate(${[margin/2 + width/2,margin/2 + height/2]})`);

const sim = d3.forceSimulation(nodes).stop(); // initially stopped
sim.on("tick", ticked);

// Move nodes to fixed positions
const nodeDragged = d3.drag().on('drag', function(evt, d) {
    d.x = evt.x;
    d.y = evt.y;
    sim.stop()
    if(sim.alpha() < sim.alphaMin()) {
        sim.alpha(sim.alpha() * 100);
        sim.restart();
    }
    sim.tick();
    ticked();
});

const forceMap = new Map();

function updateForces() {
    const str =  d3.select("#inout").node().value;
    const cx  = +d3.select("#cx").node().value * width/2;
    const cy  = +d3.select("#cy").node().value * height/2;
    const x   = +d3.select("#x").node().value * width/2;
    const y   = +d3.select("#y").node().value * width/2;

    sim.force("manybody", forceMap.get("manybody") ? d3.forceManyBody().strength(str) : null);
    sim.force("center", forceMap.get("center") ? d3.forceCenter(cx,cy) : null);
    sim.force("x", forceMap.get("x") ? d3.forceX().x(x) : null);
    sim.force("y", forceMap.get("y") ? d3.forceY().y(y) : null);
    sim.force("link", forceMap.get("link") ? d3.forceLink(links) : null);
    sim.force("collide", forceMap.get("collide") ? d3.forceCollide(d => radius(d.value)) : null);
}

function setupPanel() {
    d3.select('#ck_manybody').on('change', evt => forceMap.set("manybody", evt.target.checked));
    d3.select('#ck_center').on('change', evt => forceMap.set("center", evt.target.checked));
    d3.select('#ck_x').on('change', evt => forceMap.set("x", evt.target.checked));
    d3.select('#ck_y').on('change', evt => forceMap.set("y", evt.target.checked));
    d3.select('#ck_collide').on('change', evt => forceMap.set("collide", evt.target.checked));

    d3.select('#cx').on('input', function() {
        const val = +this.value;
        if (!isNaN(val)) {
            d3.select('#ck_center').property('checked', true);
            forceMap.set("center", true);
        }
    });
    d3.select('#cy').on('input', function() {
        const val = +this.value;
        if (!isNaN(val)) {
            d3.select('#ck_center').property('checked', true);
            forceMap.set("center", true);
        }
    });
    d3.select('#x').on('input', function() {
        const val = +this.value;
        if (!isNaN(val)) {
            d3.select('#ck_x').property('checked', true);
            forceMap.set("x", true);
        }
    });
    d3.select('#y').on('input', function() {
        const val = +this.value;
        if (!isNaN(val)) {
            d3.select('#ck_y').property('checked', true);
            forceMap.set("y", true);
        }
    });

    d3.select('#ck_link').on('change', function(evt) {
        const checked = evt.target.checked;
        forceMap.set("link", checked);
        d3.select('#show_lines').property('disabled', !checked).property('checked', checked);
        checked ? d3.selectAll("line").style("opacity", 1) : d3.selectAll("line").style("opacity", 0);
    });

    d3.select('#show_lines').on('change', function() {
        this.checked ? d3.selectAll("line").style("opacity",1) : d3.selectAll("line").style("opacity",0) ;
    });

    d3.select('#tick').on('click', clickedTick);
    d3.select('#stop').on('click', stop);
    d3.select('#restart').on('click', start);
    d3.select("#reset").on('click', reset);

    d3.select('#c_alpha').on('input', function(d,i,n) {
        sim.alpha(+this.value/1000);
        d3.select('#alpha').text(sim.alpha())
            .style('color', sim.alpha() < sim.alphaMin() ? 'red' : 'black')
    });
    d3.select('#c_alphaDecay').on('input', function(d,i,n) {
        sim.alphaDecay(+this.value/1000);
        d3.select('#alphaDecay').text(sim.alphaDecay());
    });
    d3.select('#c_alphaTarget').on('input', function(d,i,n) {
        sim.alphaTarget(+this.value/1000);
        d3.select('#alphaTarget').text(sim.alphaTarget());
    });
    d3.select('#c_alphaMin').on('input', function(d,i,n) {
        sim.alphaMin(+this.value/1000);
        d3.select('#alphaMin').text(sim.alphaMin());
    });
    d3.select('#c_velocityDecay').on('input', function(d,i,n) {
        sim.velocityDecay(+this.value/1000);
        d3.select('#velocityDecay').text(sim.velocityDecay());
    });
}

function clickedTick() {
    sim.tick();
    ticked();
}

function ticked() {
    updateForces();
    redraw();
    d3.select('#alpha')
        .style('color', sim.alpha() < sim.alphaMin() ? 'red' : 'black')
        .text(sim.alpha());
    d3.select('#alphaMin')
        .text(sim.alphaMin());
    d3.select('#alphaTarget')
        .text(sim.alphaTarget());
    d3.select('#alphaDecay')
        .text(sim.alphaDecay());
    d3.select('#velocityDecay')
        .text(sim.velocityDecay());
    d3.select('#c_alpha').node().value  = sim.alpha() * 1000;
}

function start() {
    d3.select('#restart').property('disabled', true);
    d3.select('#stop').property('disabled', false);
    d3.select('#tick').property('disabled', true);
    if (sim.alpha() < sim.alphaMin()) {
        sim.alpha(1);
    }
    sim.restart();
}

function stop() {
    sim.stop();
    d3.select('#restart').property('disabled', false);
    d3.select('#stop').property('disabled', true);
    d3.select('#tick').property('disabled', false);
}

function reset() {
    location.reload();
}

function init() {
    forceMap.set("center", null);
    forceMap.set("manybody", null);
    forceMap.set("collide", null);
    forceMap.set("x", null);
    forceMap.set("y", null);
    forceMap.set('radius', null);
    forceMap.set("link", null);

    d3.select('#alpha').text(sim.alpha());
    d3.select('#alphaMin').text(sim.alphaMin());
    d3.select('#alphaTarget').text(sim.alphaTarget());
    d3.select('#alphaDecay').text(sim.alphaDecay());
    d3.select('#velocityDecay').text(sim.velocityDecay());

    d3.select('#restart').property('disabled', false);
    d3.select('#stop').property('disabled', true);
    d3.select('#tick').property('disabled', false);

    chart.selectAll('line')
        .data(links)
        .join('line')
        .attr("x1", d => d.source.x)
        .attr("x2", d => d.target.x)
        .attr("y1", d => d.source.y)
        .attr("y2", d => d.target.y)
        .style("fill", 'none')
        .style("stroke", 'black')
        .style("stroke-width", d => d.value * d.value)

    const n = chart.selectAll('g.node')
        .data(nodes)
        .join("g").attr("class", 'node')
        .attr("transform", d => `translate(${[d.x, d.y]})`)
        .call(nodeDragged);

    n.append("circle")
        .attr("r", d => radius(d.value))
        .style("fill", (d,i) => color(i))
        .style("stroke", 'black')

    n.append("text")
        .text(d => d.node)
        .style("font-size", d => radius(d.value))
        .style("fill", (d,i) => contrast(color(i)))

    // Initially check ManyBody force
    d3.select('#ck_manybody').property('checked', true);
    forceMap.set("manybody", true);

}

function redraw() {
    chart.selectAll('g.node')
        .attr("transform", d => `translate(${[d.x, d.y]})`);

    chart.selectAll('line')
        .attr("x1", d => d.source.x)
        .attr("x2", d => d.target.x)
        .attr("y1", d => d.source.y)
        .attr("y2", d => d.target.y)
}

function contrast(color) {
    const c = d3.hsl(color);
    return c.l > .5 ? 'black' : 'white';
}
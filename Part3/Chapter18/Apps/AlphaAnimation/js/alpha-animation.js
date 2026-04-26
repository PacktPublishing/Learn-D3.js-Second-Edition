import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import {LogSlider} from "./logslider.js";

export {setupPanel, drawReferences, init};

const width = 800;
const height = 600;
const margin = 100;

const tickScale  = d3.scaleLinear().range([0, width-margin]).domain([0,1]);

// initial scale type (can be changed by the user)
let scaleType = 'log'; // 'linear' | 'log'

const alphaScaleLinear = d3.scaleLinear().range([height-margin, 0]).domain([.0001,1]);
const alphaScaleLog    = d3.scaleLog().range([height-margin, 0]).domain([.0001,1]);

// mutable current alpha scale
let alphaScale = scaleType === 'linear' ? alphaScaleLinear : alphaScaleLog;

const alphaSlider       = new LogSlider({maxpos: 1000, minval: 0.0001, maxval: 1});
const alphaDecaySlider  = new LogSlider({maxpos: 1000, minval: 0.001, maxval: 1});
const alphaMinSlider    = new LogSlider({maxpos: 1000, minval: 0.0001, maxval: 1});
const alphaTargetSlider = new LogSlider({maxpos: 1000, minval: 0.0001, maxval: 1});

const events = [];

const format = d3.format('.6f');

const axisX = d3.axisBottom(tickScale);
const axisY = d3.axisLeft(alphaScale)
    .tickPadding(15)
    .ticks(16, '');

const svg = d3.select(".svg")
    .append("svg")
    .attr("width", width)
    .attr("height",height);

svg.append("g").attr("class", "x-axis")
    .attr("transform", `translate(${[margin/2,height - margin/2]})`)
    .call(axisX);
svg.append("g").attr("class", "y-axis")
    .attr("transform", `translate(${[margin/2,margin/2]})`)
    .call(axisY);

const chart = svg.append("g").attr("class", 'chart')
    .attr("transform", `translate(${[margin/2, margin/2]})`)

let tickCount = 0;

const sim = d3.forceSimulation().stop();
sim.alphaTarget(0.0001);

events.push({count: tickCount, alpha: sim.alpha()});




function init() {
    sim.on("tick", ticked);
}

function drawReferences() {
    chart.selectAll('.point')
        .data(events).enter()
        .append("circle")
        .attr("class",'point')
        .attr("r", 2)
        .style("fill", d => d.alpha > sim.alphaMin() ? 'darkgreen' : 'red')
        .attr("cx", d => tickScale(d.count))
        .attr("cy", d => alphaScale(d.alpha));

    chart.append('line').attr("class",'lineMin')
        .attr("x1", 0)
        .attr("x2", width-margin)
        .attr("y1", alphaScale(sim.alphaMin()))
        .attr("y2", alphaScale(sim.alphaMin()))
        .style("stroke", 'orange');

    chart.append('line').attr("class",'lineTarget')
        .attr("x1", 0)
        .attr("x2",width-margin)
        .attr("y1", alphaScale(sim.alphaTarget()))
        .attr("y2", alphaScale(sim.alphaTarget()))
        .style("stroke", 'blue');
}

function getDecayRate(iterations) {
    if(scaleType === 'linear') {
        return 1 - Math.pow(sim.alphaMin() - sim.alphaTarget(), 1 / (iterations));
    } else {
        return 1 - Math.pow(sim.alphaMin(), 1 / iterations);
    }
}

function getIterations(decayRate) {
    if (scaleType === 'linear') {
        return Math.round(Math.log(sim.alphaMin() - sim.alphaTarget()) / Math.log(1 - decayRate));
    } else {
        return Math.round(Math.log(sim.alphaMin()) / Math.log(1 - decayRate));
    }
}

function setupPanel() {
    d3.select('#tick').on('click', staticTick).property('disabled', false);
    d3.select('#stop').on('click', stop).property('disabled', true);
    d3.select('#restart').on('click', start).property('disabled', false);
    d3.select("#reset").on('click', reset);

    d3.select('#alpha').text(format(sim.alpha()));
    d3.select('#alphaMin').text(format(sim.alphaMin()));
    d3.select('#alphaTarget').text(format(sim.alphaTarget()));
    d3.select('#alphaDecay').text(format(sim.alphaDecay()));
    d3.select('#iterations').text(getIterations(sim.alphaDecay()));

    d3.select('#c_alpha').node().value = alphaSlider.position(sim.alpha());
    d3.select('#c_alpha').on('input', function() {
        sim.alpha(alphaSlider.value(+this.value));
        d3.select('#alpha').text(format(sim.alpha()))
            .style('color', sim.alpha() < sim.alphaMin() ? 'red' : 'black')
    });

    d3.select('#c_alphaDecay').node().value = alphaDecaySlider.position(sim.alphaDecay());
    d3.select('#c_alphaDecay').on('input', function() {
        sim.alphaDecay(alphaDecaySlider.value(+this.value));
        d3.select('#alphaDecay').text(format(sim.alphaDecay()));
        d3.select('#c_iterations').node().value = getIterations(sim.alphaDecay());
        d3.select('#iterations').text(getIterations(sim.alphaDecay()));
    });

    d3.select('#c_iterations').node().value = getIterations(sim.alphaDecay());
    d3.select('#c_iterations').on('input', function() {
        sim.alphaDecay(getDecayRate(+this.value));
        d3.select('#iterations').text(+this.value);
        d3.select('#c_alphaDecay').node().value = alphaDecaySlider.position(sim.alphaDecay());
        d3.select('#c_alphaDecay').dispatch('input')
    });

    d3.select('#c_alphaTarget').node().value = alphaTargetSlider.position(sim.alphaTarget());
    d3.select('#c_alphaTarget').on('input', function() {
        sim.alphaTarget(alphaTargetSlider.value(+this.value));
        d3.select('#alphaTarget').text(format(sim.alphaTarget()))
        if (scaleType === 'linear') {
            d3.select('#iterations').text(getIterations(sim.alphaDecay()));
            d3.select('#c_iterations').node().value = getIterations(sim.alphaDecay());
        }
        updateAlphaTargetReference()
    });

    d3.select('#c_alphaMin').node().value = alphaMinSlider.position(sim.alphaMin());
    d3.select('#c_alphaMin').on('input', function() {
        sim.alphaMin(alphaMinSlider.value(+this.value));
        d3.select('#alphaMin').text(format(sim.alphaMin()))
        d3.select('#iterations').text(getIterations(sim.alphaDecay()));
        d3.select('#c_iterations').node().value = getIterations(sim.alphaDecay());
        updateAlphaMinReference()
    });

    // wire the scaleType radio buttons
    d3.selectAll('input[name="scaleType"]').on('change', function() {
        setScaleType(this.value);
    });
}

function setScaleType(type) {
    scaleType = type;
    alphaScale = scaleType === 'linear' ? alphaScaleLinear : alphaScaleLog;
    // update axis scale and re-render axis and references
    axisY.scale(alphaScale);
    d3.select('.y-axis').transition().call(axisY);
    updateAlphaMinReference();
    updateAlphaTargetReference();
    redraw();
}

function start() {
    d3.select('#restart').property('disabled', true);
    d3.select('#stop').property('disabled', false);
    d3.select('#tick').property('disabled', true);
    if (sim.alpha() < sim.alphaMin()) {
        sim.alpha(1);
        events.length = 0;
        tickCount = 0;
        events.push({count: tickCount, alpha: sim.alpha()});
        chart.selectAll('.point').remove();
    }
    sim.restart();
}

function stop() {
    sim.stop();
    d3.select('#restart').property('disabled', false).text(sim.alpha() < sim.alphaMin() ? 'Start' : 'Restart');
    d3.select('#stop').property('disabled', true);
    d3.select('#tick').property('disabled', false);
}

function reset() {
    location.reload();
}

function staticTick() {
    sim.tick();
    ticked();
    stop();
}

function ticked() {
    events.push({count: ++tickCount, alpha: sim.alpha()});
    tickScale.domain([0,tickCount]);
    d3.select('.x-axis').call(axisX);
    updatePanel();
    redraw();
}

function updatePanel() {
    d3.select('#alpha')
        .style('color', sim.alpha() < sim.alphaMin() ? 'red' : 'black')
        .text(format(sim.alpha()));
    d3.select('#alphaMin')
        .text(format(sim.alphaMin()));
    d3.select('#alphaTarget')
        .text(format(sim.alphaTarget()));
    d3.select('#alphaDecay')
        .text(format(sim.alphaDecay()));
    d3.select('#iterations')
        .text(getIterations(sim.alphaDecay()));
    d3.select('#c_alpha').node().value = alphaSlider.position(sim.alpha());
    d3.select('#restart').property('disabled', sim.alpha() >= sim.alphaMin())
        .text(sim.alpha() < sim.alphaMin() ? 'Start' : 'Restart');
    d3.select('#stop').property('disabled', sim.alpha() < sim.alphaMin())
}

function updateAlphaTargetReference() {
    chart.select('.lineTarget')
        .attr("y1", alphaScale(sim.alphaTarget()))
        .attr("y2", alphaScale(sim.alphaTarget()));
}

function updateAlphaMinReference() {
    chart.select('.lineMin')
        .attr("y1", alphaScale(sim.alphaMin()))
        .attr("y2", alphaScale(sim.alphaMin()));
}

function redraw() {
    const selection = chart.selectAll('.point').data(events);

    selection.enter()
        .append("circle").attr("class",'point')
        .attr("r", 2)
        .style("fill", d => d.alpha > sim.alphaMin() ? 'darkgreen' : 'red')
        .merge(selection)
        .attr("cx", d => tickScale(d.count))
        .attr("cy", d => alphaScale(d.alpha));
}
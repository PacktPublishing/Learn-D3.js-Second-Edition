/**
 * Comparing distributions of D3 random number generators
 */

import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';

const dim = {
    width: 1000,
    height: 600,
    cols: 5,
    rows: 4,
    margin: {left: 10, top: 20}
};

const randomFunctions = [
    ["randomUniform",[0,1]],
    ["randomInt",[0,1000]],
    ["randomNormal",[1,0.5]],
    ["randomLogNormal",[1,.3]],
    ["randomBates",[2.5]],
    ["randomIrwinHall",[25]],
    ["randomExponential",[1/20]],
    ["randomPareto",[100]],
    ["randomBernoulli",[.75]],
    ["randomGeometric",[0.25]],
    ["randomBinomial",[100, .1]],
    ["randomGamma",[5,-1]],
    ["randomGamma",[2,2]],
    ["randomBeta",[2,1.2]],
    ["randomCauchy",[5,10]],
    ["randomLogistic",[0,1]],
    ["randomPoisson",[10]],
    ["randomWeibull",[100]],
    ["randomWeibull",[-100]],
    ["randomWeibull",[3]]
];

const color  = d3.scaleSqrt().range(["#003399", "#ff4400"]);

const scaleX = d3.scaleLinear().range([dim.margin.left, dim.width/dim.cols - dim.margin.left]);
const scaleY = d3.scaleLinear().range([dim.height/dim.rows-1, dim.margin.top * 2]);

const svg = d3.select("body")
    .append("svg").attr("height", dim.height).attr("width", dim.width);

randomFunctions.forEach((d,i) => draw(d[0], d[1],i));

/**
 * Draws a chart for each random number generator
 * @param func function
 * @param args arguments
 * @param index
 */
function draw(func, args, index) {

    const data = generateData(func, args);

    scaleX.domain(d3.extent(data.values));
    scaleY.domain(d3.extent(data.bins, d => d.length));
    color.domain(scaleY.domain());

    // Chart coordinates
    const x = index % dim.cols;
    const y = Math.floor(index / dim.cols);

    // Chart
    const g = svg.append("g")
        .attr("transform", `translate(${[x * dim.width/dim.cols,y * dim.height/dim.rows]})`);

    // Label (function name)
    g.append("text")
        .text(`d3.${func}(${args.join(", ")})`)
        .attr("text-anchor", "middle")
        .attr("x", dim.width/(dim.cols * 2))
        .attr("y", dim.height/dim.rows - dim.margin.top/2);

    // Bars
    g.selectAll("rect.bar")
        .data(data.bins)
        .join("rect").attr("class", "bar")
        .attr("x", d => scaleX(d.x0))
        .attr("width", (dim.width/dim.cols) / (data.bins.length+15))
        .attr("y", d => scaleY(d.length) - 30)
        .attr("height", d => dim.height/dim.rows - scaleY(d.length))
        .style("fill", d => color(d.length))
}

/**
 * Generates 10000 random numbers and bins.
 * @param generator
 * @param args
 * @returns {{bins, values}}
 */
function generateData(generator, args) {
    const data = {
        values: [],
        bins: undefined
    };

    // Creates a random number generator
    const random = d3[generator].apply(d3, args);

    data.values = [...Array(10000)].map(() => random());

    const bin = d3.bin().thresholds(50);
    data.bins = bin(data.values);
    return data;
}
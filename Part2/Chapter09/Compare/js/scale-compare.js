import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// Page properties
const range = [0, 600 - (15 * 2)];
const width = 600;
const margin = 15;

// Scale properties
const scaleTypes = [
    {name: 'scaleLinear', domain: [-20, 20]},
    {name: 'scalePow', domain: [-20, 20], exponent: 2},
    {name: 'scaleSqrt', domain: [-20, 20]},
    {name: 'scaleRadial', domain: [-20, 20]},
    {name: 'scaleLog', domain: [1, 40], base: 10},
    {name: 'scaleSymlog', domain: [-20, 20], constant: 1},
];

const extraFields = new Map();
extraFields.set("scalePow", "exponent");
extraFields.set("scaleLog", "base");
extraFields.set("scaleSymlog", "constant");

// Run
comparativeChart();

/**
 * Call this to initialize the chart
 */
function comparativeChart() {
    scaleTypes.forEach(d => {
        createCanvas(d);
        setScale(d);
        drawChart(d);
    })
}

/**
 * Create elements that will render the chart
 * @param type Type of scale (object)
 */
function createCanvas(type) {
    // Add the chart container
    const chart = d3.select("body")
        .append("div")
        .attr("class", "chart")
        .attr("id", type.name);

    // Add the panel with the scale info
    const panel = chart.append("div");
    panel.append("span").attr("class", "type").text(`d3.${type.name}()`);
    panel.append("span").text(`.domain([${type.domain}])`);

    //Some scales have extra fields
    const extra = extraFields.get(type.name);
    if(extra) {
        panel.append("span").text(`.${extra}(${type[extra]})`);
    }

    // Add the SVG viewport
    chart.append("svg")
         .attr("width", width).attr("height", 50)
         .append("g")
         .attr("class", "axis")
         .attr("transform",`translate(${margin},${margin})`);
}

/**
 * Create the scale object and add to type object
 * @param {string} type Type of scale (object)
 */
function setScale(type) {
    type.scale = d3[type.name]().range(range);
    const extra = extraFields.get(type.name);
    if(extra) {
        type.scale[extra](type[extra]);
    }
    type.scale.domain(type.domain);
}

// EVENTS
/**
 * Draw the chart
 * @param type Type of scale (object)
 */
function drawChart(type) {

    const svg = d3.select(`#${type.name} svg`);

    const data = d3.range(type.scale.domain()[0], type.scale.domain()[1]+1);

    const xAxis = d3.axisBottom()
        .scale(type.scale)
        .tickSize(margin);

    svg.select(".axis").call(xAxis);

    svg.selectAll("circle")
        .data(data)
        .join("circle")
        .attr("r", 3)
        .attr("cy", margin)
        .join("circle")
        .attr("cx", d => type.scale(d) + margin)
}
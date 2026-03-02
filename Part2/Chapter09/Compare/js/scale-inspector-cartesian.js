import * as d3 from "https://cdn.skypack.dev/d3@7.9.0";

const fields = new Map(); // Map to store, retrieve, configure and attach input fields

// Cartesian axis chart
const cartesian = {
    type: 'cartesian',
    maxVal: 100,
    defaultVal: 100,
    scale: null,
    data: null,
    range: [500,0],
    margin: 25,
    width: 600,
    height: 560,
    step: 10
};
cartesian.scaleX = d3.scaleLinear().domain([-cartesian.maxVal,cartesian.maxVal]).range([50,550]);

let chart = cartesian;  // default chart

cartesianChart();

function createCartesianCanvas() {
    const svg = d3.select("body").append("svg");
    svg.attr("width", cartesian.width).attr("height", cartesian.height);

    svg.append("g")
        .attr("transform",`translate(${cartesian.margin*2},${cartesian.margin})`)
        .attr("class", "y-axis");

    svg.append("g")
        .attr("transform",`translate(0,${cartesian.margin})`)
        .attr("class", "x-axis")
}

function cartesianChart() {
    chart = cartesian;
    createCartesianCanvas();
    createInterface(onChangeScale);
    createFieldMap(updateCartesianChart);
    updateScale('scaleLinear');
    updateCartesianChart();
}

// EVENTS

function updateCartesianChart() {

    updateInputs();
    updateData();

    const xAxis = d3.axisBottom()
        .scale(cartesian.scaleX).tickSize(500);
    const yAxis = d3.axisRight()
        .scale(cartesian.scale).tickSize(500);

    d3.selectAll(".tick line")
        .filter(d => d == 0)
        .style("stroke", "black")

    d3.select(".x-axis").call(xAxis);
    d3.select(".y-axis").call(yAxis);

    d3.select("svg")
        .selectAll("circle")
        .data(cartesian.data)
        .join("circle")
        .attr("r", 1)
        .attr("cx", d=>cartesian.scaleX(d))
        .attr("cy", d=>cartesian.scale(d)+25);

}

function updateData() {
    chart.data = d3.range(chart.scale.domain()[0],chart.scale.domain()[1]+1);
}

function updateInputs() {
    const domain = [+getField('domainFrom').value, +getField('domainTo').value];
    chart.scale.domain(domain);
    chart.scaleX.domain(domain);
    const exclusive = d3.select("#exclusive").select("input").node();
    if(exclusive) {
        chart.scale[exclusive.name](exclusive.value);
    }
}

function onChangeScale(event) {
    updateScale(event.target.value);
}

/**
 * Update the scale, extra input fields and the chart
 * @param {string} name name of the scale
 */
function updateScale(name) {
    d3.select("#exclusive").selectAll("*").remove();
    chart.scale = d3[name]().range(chart.range);

    const input = getField(name);
    if(input) {
        d3.select("#exclusive")
            .append("label")
            .text(`${input.name}: `)
            .append(() => input); // append exclusive field if available

        chart.scale[input.name](input.value);
    }

    const domainFields = [getField('domainFrom'), getField('domainTo')];

    if(name === 'scaleLog') {
        domainFields[0].value = 1;
        domainFields[0].min = 1;
        domainFields[1].min = 1;
        domainFields[1].max = chart.maxVal*2;
        domainFields[1].value = chart.defaultVal*2;
    } else {
        domainFields[0].value = -chart.defaultVal;
        domainFields[0].min = -chart.maxVal;
        domainFields[1].min = -chart.maxVal;
        domainFields[1].max = chart.maxVal;
        domainFields[1].value = chart.defaultVal;
    }

    const domain = domainFields.map(d => +d.value);
    chart.scale.domain(domain);
    chart.scaleX.domain(domain);

    updateCartesianChart();
}


// INITIALIZATION - for cartesian or single axis
/**
 * Create the map of input fields
 */
function createFieldMap(chartHandler) {
    fields.set("domainFrom", d3.select("input#domainFrom"));
    fields.set("domainTo", d3.select("input#domainTo"));
    fields.set("scalePow", createField("exponent", 2, 0, 10, .1).on("change", chartHandler));
    fields.set("scaleLog", createField("base", 10, 1, 10).on("change", chartHandler));
    fields.set("scaleSymlog", createField("constant", 1, 1, 10).on("change", chartHandler));

    d3.selectAll("input[type=number]").on("change", chartHandler);
}

function getField(name) {
    const field = fields.get(name);
    return field ? field.node() : null;
}

function createField(name, value, min, max, step = 1) {
    return d3.create("input")
        .attr("type", "number")
        .attr("step", step)
        .attr("id", name)
        .attr("name", name)
        .attr("min", min)
        .attr("max", max)
        .attr("value", value);
}
/**
 * Create the interface
*/
function createInterface(scaleHandler) {
    const form = d3.select("body").append("form");

    const scales = [
        'scaleLinear',
        'scalePow',
        'scaleSqrt',
        'scaleRadial',
        'scaleLog',
        'scaleSymlog',
       // 'scaleIdentity',
       // 'scaleTime',
       // 'scaleUtc',
    ];

    form.append("select")
        .attr("name", "scale")
        .on("change", scaleHandler)
          .selectAll("option")
            .data(scales)
              .join("option")
                .attr("value", d => d)
                .text(d => `d3.${d}`);

    const label = form.append("label");
    label.append("span").text(" domain: [")
    label.append(() => createField('domainFrom', 0, -chart.maxVal, chart.maxVal, chart.step).node())
    label.append("span").text(",")
    label.append(() => createField('domainTo', chart.defaultVal, -chart.maxVal, chart.maxVal, chart.step).node())
    label.append("span").text("] ")

    form.append("span")
        .attr("id","exclusive");
}
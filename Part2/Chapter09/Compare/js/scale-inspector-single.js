import * as d3 from "https://cdn.skypack.dev/d3@7.9.0";

const fields = new Map(); // Map to store, retrieve, configure and attach input fields

// Single axis chart
const single = {
    type: 'single',
    maxVal: 50,
    defaultVal: 10,
    scale: null,
    data: null,
    margin: 15,
    width: 600,
    step: 1
};
single.range = [0, single.width - (single.margin * 2)];

let chart = single;  // default chart

singleAxisChart();

function createSingleAxisCanvas() {
    d3.select("body").append("svg")
        .attr("width", single.width).attr("height", 50)
        .append("g")
         .attr("class", "axis")
         .attr("transform",`translate(${single.margin},${single.margin})`);
}

// Call this to initialize
function singleAxisChart() {
    chart = single;
    createSingleAxisCanvas();
    createInterface();
    createFieldMap();
    updateScale('scaleLinear');
    updateSingleAxisChart();
}

// EVENTS

function updateSingleAxisChart() {

    const svg = d3.select("svg");

    updateInputs();
    updateData();

    const xAxis = d3.axisBottom()
        .scale(single.scale)
        .tickSize(single.margin);

    svg.select(".axis").call(xAxis);

    svg.selectAll("circle")
        .data(single.data)
        .join("circle")
        .attr("r", 3)
        .attr("cy", single.margin)
        .join("circle")
        .attr("cx", d => single.scale(d) + single.margin)
}

function updateData() {
    chart.data = d3.range(chart.scale.domain()[0],chart.scale.domain()[1]+1);
}

function updateInputs() {
    const domain = [+fields.get('domainFrom').node().value, +fields.get('domainTo').node().value];
    chart.scale.domain(domain);
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

    if(fields.get(name)) {
        const input = fields.get(name).node();
        d3.select("#exclusive")
            .append("label")
            .text(`${input.name}: `)
            .append(() => input); // append exclusive field if available

        chart.scale[input.name](input.value);
    }

    const domainFields = [fields.get('domainFrom').node(), fields.get('domainTo').node()];

    if(name === 'scaleLog') {
        domainFields[0].value = 1;
        domainFields[0].min = 1;
    } else {
        domainFields[0].value = -chart.defaultVal;
        domainFields[0].min = -chart.maxVal;
    }
    domainFields[1].max = chart.maxVal;
    domainFields[1].value = chart.defaultVal;

    const domain = domainFields.map(d => +d.value);
    chart.scale.domain(domain);

    updateSingleAxisChart();
}


// INITIALIZATION - for cartesian or single axis
/**
 * Create the map of input fields
 */
function createFieldMap() {
    fields.set("domainFrom", d3.select("input#domainFrom").on("change", updateSingleAxisChart));
    fields.set("domainTo", d3.select("input#domainTo").on("change", updateSingleAxisChart));
    fields.set("scalePow", createField("exponent", 2, 0, 10, .1));
    fields.set("scaleLog", createField("base", 10, 1, 10));
    fields.set("scaleSymlog", createField("constant", 1, 1, 10));
}

function createField(name, value, min, max, step = 1) {
    return d3.create("input")
        .attr("type", "number")
        .attr("step", step)
        .attr("id", name)
        .attr("name", name)
        .attr("min", min)
        .attr("max", max)
        .attr("value", value)
        .on("change", updateSingleAxisChart);
}

function appendFields(form) {
    const label = form.append("label");
    label.append("span").text(" domain: [")
    label.append(() => createField('domainFrom', 0, -chart.maxVal, chart.maxVal, chart.step).node())
    label.append("span").text(",")
    label.append(() => createField('domainTo', chart.defaultVal, -chart.maxVal, chart.maxVal, chart.step).node())
    label.append("span").text("] ")

    form.append("span")
        .attr("id","exclusive");
}

/**
 * Create the interface
*/
function createInterface() {
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

    const form = d3.select("body").append("form");

    form.append("select")
        .attr("name", "scale")
        .on("change", onChangeScale)
          .selectAll("option")
            .data(scales)
              .join("option")
                .attr("value", d => d)
                .text(d => `d3.${d}`);

    appendFields(form)


}
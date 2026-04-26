import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const dim = {
    width: 600, height: 300, margin: 30
};

const scale = {
    // This scale will fit each chart to its cell horizontally.
    // The width (range) is computed based on the number of columns
    x: d3.scaleLinear().range([dim.margin, dim.width - dim.margin]),

    // This scale will fit each chart to its cell vertically.
    // The height (range) is computed based on the number of rows
    y: d3.scaleLinear().range([dim.height - dim.margin, dim.margin/2])
}

// These are the sample data points for the line chart ([x,y])
const data = [[0,0],
    [1,8],
    [4,6],
    [3,4],
    [6,1],
    [7,4],
    [8,1]];

// All curves in d3-shapes (03-2024)
const curves = [
    'curveLinear',
    'curveLinearClosed',

    'curveBasis',
    'curveBasisClosed',
    'curveBasisOpen',

    'curveBundle',

    'curveCardinal',
    'curveCardinalClosed',
    'curveCardinalOpen',

    'curveCatmullRom',
    'curveCatmullRomClosed',
    'curveCatmullRomOpen',

    'curveMonotoneX',
    'curveMonotoneY',

    'curveBumpX',
    'curveBumpY',

    'curveStep',
    'curveStepBefore',
    'curveStepAfter',

    'curveNatural'
];

const fmt = d3.format(".2f");

scale.x.domain(d3.extent(data, d => d[0]));
scale.y.domain(d3.extent(data, d => d[1]));

const point = d3.symbol().type(d3.symbolCircle).size(25);

const line = d3.line()
    .x(d => scale.x(d[0]))
    .y(d => scale.y(d[1]));
const guide = d3.line()
    .x(d => scale.x(d[0]))
    .y(d => scale.y(d[1]));


// Current curve
let currentCurve = curves[0];

// Curves that have tension controls
const tensionMap = new Map();
tensionMap.set("curveCardinal", {name: "tension", default: 0});
tensionMap.set("curveCatmullRom", {name: "alpha", default: 0.5});
tensionMap.set("curveBundle", {name:"beta", default: 0.85});

// To drag the points
const drag = d3.drag()
    .on("drag", function(event, d) {
        const point = d3.pointer(event, svg.node());

        // update the data with new values
        d[0] = scale.x.invert(point[0]);
        d[1] = scale.y.invert(point[1]);

        // move the point
        d3.select(this).attr("transform", "translate("+[point[0], point[1]]+")");

        // update the guide and the line
        updateLine();
        updateGuide();
    });

const svg = d3.select("body")
              .append("svg")
              .attr("height", dim.height)
              .attr("width", dim.width);

export function start() {
    renderControls();
    draw(currentCurve);
}

/**
 * Returns true if curve allows configuration of parameters
 * @param curve
 * @returns {boolean|boolean}
 */
function isAdjustableCurve(curve) {
    return curve.startsWith("curveCardinal") ||
        curve.startsWith("curveCatmullRom") ||
        curve === "curveBundle";
}

/**
 * Renders a control panel to select curves and adjust parameters.
 */
function renderControls() {

    const controls = d3.select("body")
        .append("div")
        .attr("class", "controls");

    // Create a pull-down menu to select the curve type
    const select = controls.append("select")
        .on("change", function() {
            currentCurve = this.value;
            svg.selectAll("*").remove(); // TODO 2: Refactor to reuse lines instead of removing them

            // Show additional controls (slider) if curve is adjustable
            if(isAdjustableCurve(currentCurve)) {
                const curveType = currentCurve.replace(/(Closed|Open)/, "");
                const tension = tensionMap.get(curveType);

                const tensionControl = d3.select("div#tension");
                tensionControl.style("visibility", "visible");

                const slider = tensionControl.select("input")
                slider.node().value = tension.default;

                tensionControl.select("span#tension-label")
                    .text(tension.name);
                tensionControl.select("#tension-value")
                    .text(fmt(tension.default));
            } else {
                d3.select("#tension")
                    .style("visibility", "hidden");
            }
            draw(currentCurve);
        });

    // Populate the <select> pull-down menu with available curves
    select.selectAll("option")
          .data(curves)
             .join("option")
                 .attr("value", d => d)
                 .text(d => `d3.${d}`);

    // Parameter tension slider for required curves
    const tensionCtrl = controls.append("div")
        .attr("id", "tension")
        .style("visibility", "hidden");

    tensionCtrl.append("span")
        .attr("id", "tension-label");

    tensionCtrl.append("input")
        .attr("type", "range")
        .attr("min", 0)
        .attr("max", 1)
        .attr("step", 0.01)
        .attr("value", 0)
        .on("input", function(event) {
            svg.selectAll("*").remove();  // TODO 1: Refactor to reuse lines instead of removing them
            tensionCtrl.select("#tension-value")
                .text(fmt(event.target.value));
            draw(currentCurve);
        });

    tensionCtrl.append("span").attr("id", "tension-value");

    // Removes all points from the chart
    controls.append("button")
        .text("Clear all points")
        .on("click", function() {
            data.splice(0, data.length);
            svg.selectAll("*").remove();
            draw(currentCurve);
        });

    // Resets the chart to its initial state
    controls.append("button")
        .text("Refresh")
        .on("click", () => location.reload());

    controls.append("p")
        .text("Click to add, click again to remove, or drag existing points.");
}

/**
 * @param curveType
 */
function draw(curveType) {

    const chart = svg.append("g")
                     .attr("class", "chart")
                     .attr("transform", "translate("+[0,0]+")");

    // Draw a guide line (always linear)
    chart.append("path")
         .attr("class", "guide")
         .attr("d", guide(data))
         .style("stroke", "lightgray")
         .style("fill", "none");

    // Apply the curve
    line.curve(d3[curveType]);

    // if the curve type supports alpha, beta or tension, set it to 0
    if(isAdjustableCurve(curveType)) {
        line.curve(d3[curveType]
            [tensionMap.get(currentCurve.replace(/(Closed|Open)/, "")).name]
        (d3.select("input").node().value));
    }

    // Draw the curve
    chart.append("path")
        .attr("class", "line")
        .attr("d", line(data))
        .style("stroke", "blue");

    updatePoints();
}

function updateGuide() {
    d3.select(".guide").attr("d", guide(data));
}

function updateLine() {
    d3.select(".line").attr("d", line(data));
}

function updatePoints() {
    d3.select(".chart").selectAll(".point")
     .data(data)
        .join("path")
           .attr("class", "point")
           .attr("d", point)
           .style("fill", 'red')
           .attr("transform", d => "translate("+[scale.x(d[0]), scale.y(d[1])]+")")
           .call(drag);
}

// Add or remove points on click
svg.on("click", function(event) {
    // if there already is a point near the click, remove it
    const threshold = 5;
    const [x,y] = d3.pointer(event);
    const near = d => Math.abs(scale.x(d[0]) - x) < threshold
                   && Math.abs(scale.y(d[1]) - y) < threshold;

    // update dataset
    if(data.some(near)) {
        const index = data.findIndex(near);
        data.splice(index, 1);  // remove the point from the dataset
    } else {
        data.push([scale.x.invert(x), scale.y.invert(y)]);
    }

    updateGuide();
    updateLine();
    updatePoints();

});
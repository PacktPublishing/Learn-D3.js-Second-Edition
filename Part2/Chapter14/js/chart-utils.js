/**
 * Axes generator functions. ES module.
 *
 * Exported functions:
 * radialAxes()
 * cartesianAxes()
 * legend()
 * p2c()
 * c2p()
 * updateTextLabels()
 * pieLabels()
 *
 * Exported constants:
 * direction
 *
 * @version 4.0 2025-03-22
 */

import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';

export {cartesianAxes, radialAxes, legend, p2c, c2p, updateTextLabels, pieLabels, direction};

/**
 * Creates a Cartesian axes generator function.
 * @returns A function that when called will generate a system of cartesian axes. This function returns the axes [axisX, axisY].
 *
 * Methods:
 * - container(selection) - get/set the container (e.g. <svg> or <g>), required. Container will be tagged with the class 'chart' and 'cartesian'.
 * - xScale(function) - get/set the xScale function, required
 * - yScale(function) - get/set the yScale function, required
 * - xLabel(string) - get/set the x-axis label, default = 'x values'
 * - yLabel(string) - get/set the y-axis label, default = 'y values'
 * - showHorizontalGrid(boolean) - turn on or off the horizontal grid, default = false
 * - showVerticalGrid(boolean) - turn on or off the vertical grid, default = false
 * - arrowheads(string) - get/set the arrowheads to use for the axes: "end", "start", "both", "none"; default = "none"
 *
 */
function cartesianAxes() {
    let container = null;
    let xScale = null;
    let yScale = null;
    let xLabel = 'x values';
    let yLabel = 'y values';
    let showHorizontalGrid = false;
    let showVerticalGrid = false;
    let arrowheads = "none";

    function f() {
        return __drawCartesianAxes(container, xScale, yScale, xLabel, yLabel, showHorizontalGrid, showVerticalGrid, arrowheads);
    }

    f.container = arg => (arguments.length) ? container : (container = arg, f);
    f.xScale = arg => (arguments.length) ? xScale : (xScale = arg, f);
    f.yScale = arg => (arguments.length) ? yScale : (yScale = arg, f);
    f.xLabel = arg => (arguments.length) ? xLabel : (xLabel = arg, f);
    f.yLabel = arg => (arguments.length) ? yLabel : (yLabel = arg, f);
    f.showHorizontalGrid = arg => (arguments.length) ? showHorizontalGrid : (showHorizontalGrid = arg, f);
    f.showVerticalGrid = arg => (arguments.length) ? showVerticalGrid : (showVerticalGrid = arg, f);
    f.arrowheads = arg => (arguments.length) ? arrowheads : (arrowheads = arg, f);

    return f;
}

/**
 * Creates a radial axes generator
 * @returns a function that when called will generate a system of radial axes
 */

/**
 * Creates a radial axes generator function.
 * @returns A function that when called will generate a system of cartesian axes. This function
 *          returns the axis object.
 *
 * Methods:
 * - container(selection) - get/set the container (e.g. <svg> or <g>), required. Container will be tagged with the classes 'chart' and 'radial'.
 * - aScale(function) - get/set the angular scale function, required
 * - rScale(function) - get/set the radial scale function, required
 * - angularData(array) - get/set the angular data labels, default = [0,1,2,3,4,5,6,7,8,9,10,11]
 * - numTicks(number) - get/set the number of ticks per axis, default = 6
 * - useGrid(boolean) - get/set whether to draw a grid or not, default = false
 * - backdropOpacity(number) - get/set the opacity of the backdrop behind the radial labels, default = 1
 * - backdropColor(string) - get/set the color of the backdrop behind the radial labels, default = "white"
 * - arrowheads(string) - get/set the arrowheads to use for the axes: "end", "start", "both", "none"; default = "none"
 *
 */
function radialAxes() {
    let container = null;
    let aScale = null;
    let rScale = null;
    let angularData = d3.range(0,12);
    let numTicks = 6;
    let useGrid = false;
    let backdropOpacity = 1;
    let backdropColor = "white";
    let arrowheads = "none";

    function f() {
        return __drawRadialAxes(container, aScale, rScale, angularData, numTicks, useGrid, backdropOpacity, backdropColor, arrowheads);
    }

    f.container = arg => (arguments.length) ? container : (container = arg, f);
    f.aScale = arg => (arguments.length) ? aScale : (aScale = arg, f);
    f.rScale = arg => (arguments.length) ? rScale : (rScale = arg, f);
    f.angularData = arg => (arguments.length) ? angularData : (angularData = arg, f);
    f.numTicks = arg => (arguments.length) ? numTicks : (numTicks = arg, f);
    f.useGrid = arg => (arguments.length) ? useGrid : (useGrid = arg, f);
    f.backdropOpacity = arg => (arguments.length) ? backdropOpacity : (backdropOpacity = arg, f);
    f.backdropColor = arg => (arguments.length) ? backdropColor : (backdropColor = arg, f);
    f.arrowheads = arg => (arguments.length) ? arrowheads : (arrowheads = arg, f);

    return f;
}

/**
 * Creates a legend generator function.
 * @returns A function that when called will generate a legend for the chart.
 *
 * Methods:
 * - container(selection) - get/set the container (e.g. <svg> or <g>), required. Container will be tagged with the class 'legend'.
 * - data(array) - get/set the data to use for the legend (an array of strings to display), required
 * - color(function) - get/set the color scale function that selects a color for each data item, required
 * - useDataAsIndex(boolean) - get/set whether color or symbol function will the datum (d) as index, otherwise with the data position (i), default = false
 * - symbol(function) - get/set the d3.symbol function or scale, default = d3.symbolSquare
 *
 */
function legend() {
    let container = null;
    let data = null;
    let color = null;
    let useDataAsIndex = false;
    let symbol = d3.symbolSquare;

    function f() {
        return __displayLegend(container, data, color, useDataAsIndex, symbol);
    }

    f.container = arg => (arguments.length) ? container : (container = arg, f);
    f.data = arg => (arguments.length) ? data : (data = arg, f);
    f.color = arg => (arguments.length) ? color : (color = arg, f);
    f.useDataAsIndex = arg => (arguments.length) ? useDataAsIndex : (useDataAsIndex = arg, f);
    f.symbol = arg => (arguments.length) ? symbol : (symbol = arg, f);

    return f;
}

/**
 * Converts polar coordinates to Cartesian coordinates
 * @param angle The angle in radians
 * @param radius The radius
 * @returns {number[]} The cartesian coordinates [x,y]
 */
function p2c(angle, radius) {
    return [radius * (Math.cos(angle - Math.PI/2)), radius * (Math.sin(angle - Math.PI/2))];
}

/**
 * Converts Cartesian coordinates to polar coordinates
 * @param x The x coordinate
 * @param y The y coordinate
 * @returns {number[]} The polar coordinates [angle, radius]
 */
function c2p(x, y) {
    return [Math.atan2(y, x) + Math.PI / 2, Math.sqrt(x * x + y * y)];
}

/**
 * Updates text labels for radial axes
 * @param opacity
 * @param color
 */
function updateTextLabels(opacity = 1, color = "white") {
    const g = d3.select("g.chart");
    // Centers tick lines in relation to domain line
    g.selectAll(".tick line")
        .attr("y1", -3)
        .attr("y2", 4);

    // Backdrop applied to first axis (a white 24x16 rectangle behind the text)
    const rh = 16, rw = 24; // note that they are inverted
    g.select(".axis") // selects only first axis
        .selectAll(".tick")
        .insert("rect", ".tick text")
        .attr("x", -rh/2)
        .attr("y", -rw/2)
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("width", rh)
        .attr("height", rw)
        .style("fill", color)
        .style("opacity", opacity);

    // Centers tick text in relation to domain line
    g.selectAll(".tick text")
        .attr("y", -4)
        .attr("transform", "rotate(90)");
}

/**
 * Creates a pie labels generator function.
 *
 * @returns A function that when called will place labels on a pie chart.
 *
 * Methods:
 * - container(selection) - get/set the container (e.g. <svg> or <g>), required
 * - arc(function) - get/set the arc generator function for the pie slices, required
 * - property(string) - get/set the property of the data to display, required
 * - direction(number) - get/set the direction of the labels (direction.RADIAL, direction.TANGENTIAL, or direction.NONE), default = direction.NONE
 * - radius(number) - get/set the radius of the labels, default = 1
 * - format(function) - get/set the format function for the labels, default = null
 *
 */
function pieLabels() {
    let container = null;
    let arc = null;
    let property = null;
    let direction = 0;
    let radius = 1;
    let format = null;

    function f() {
        return __placePieLabels(container, arc, property, direction, radius, format);
    }

    f.container = arg => (arguments.length) ? container : (container = arg, f);
    f.arc = arg => (arguments.length) ? arc : (arc = arg, f);
    f.property = arg => (arguments.length) ? property : (property = arg, f);
    f.direction = arg => (arguments.length) ? direction : (direction = arg, f);
    f.radius = arg => (arguments.length) ? radius : (radius = arg, f);
    f.format = arg => (arguments.length) ? format : (format = arg, f);

    return f;
}


const direction = {TANGENTIAL: 1, RADIAL: 2, NONE: 0};


/**
 * Display a legend
 * @param container The container selection (usually <svg> or <g>)
 * @param data The data to use for the legend (an array of strings to display)
 * @param color A color scale function that selects a color for each data item
 * @param useDataAsIndex If true, the color & symbol functions will be called with the datum, otherwise with the index
 * @param symbol A d3.symbol function (default is d3.symbolSquare) or an ordinal scale of symbols
 */
const __displayLegend = function(container, data, color, useDataAsIndex = false, symbol = d3.symbolSquare) {
    container.attr("class", "legend");
    container.selectAll("g.entry")
        .data(data).join("g")
        .attr("class", "entry")
        .attr("transform", (d, i) => `translate(0, ${i * 20})`)
        .each(function (d,i) {
            d3.select(this).append("path")
                .attr("d", d3.symbol(symbol.draw ? symbol : symbol(i)))
                .attr("transform", "translate(5, 5)")
                .style("fill", color(useDataAsIndex ? d : i));

            d3.select(this).append("text")
                .attr("class", "label")
                .attr("x", 15)
                .attr("y", 9)
                .text(d);
        })

    // These are XML attributes and can be overriden using CSS styles
    container.selectAll(".legend text.label")
        .attr("font-family", "sans-serif")
        .attr("font-size", "12px")
        .attr("text-anchor", "start");

}

/**
 * @param container The container where to draw the axes (top-left corner at the origin)
 * @param xScale  The scale for the x-axis
 * @param yScale  The scale for the y-axis
 * @param xLabel  The label for the x-axis, default = 'x values'
 * @param yLabel  The label for the y-axis, default = 'y values'
 * @param showHorizontalGrid  Whether to show horizontal grid lines, default = false
 * @param showVerticalGrid  Whether to show vertical grid lines, default = false
 *
 * @returns The axis objects for x and y as an array [axisX, axisY]
 */
const __drawCartesianAxes = function(container, xScale, yScale,
                                   xLabel = 'x values',
                                   yLabel = 'y values',
                                   showHorizontalGrid = false,
                                   showVerticalGrid = false,
                                   arrowheads = "none") {

    const g = container.append("g")
        .attr("class", "chart cartesian")

    const top = yScale.range()[0];
    const left = xScale.range()[0];
    const bottom = yScale.range()[1];
    const right = xScale.range()[1];

    const labelPadding = -40;
    const tickBleed = 5;

    const axisX = d3.axisBottom(xScale)
                    .tickPadding(tickBleed);
    const axisY = d3.axisLeft(yScale)
                    .tickPadding(tickBleed);
    const axisZero = d3.axisRight(yScale)
                       .tickValues([0])
                       .tickSizeOuter(0)
                       .tickSizeInner(right - left);

    if (showHorizontalGrid) {
        axisY.tickSize(left - right)
            .tickSizeOuter(0);
    }
    if (showVerticalGrid) {
        axisX.tickSize(bottom - top)
            .tickSizeOuter(0);
    }

    const xG = g.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${top})`)
        .call(axisX);

    const yG = g.append("g")
        .attr("class", "y-axis")
        .attr("transform", `translate(${left},0)`)
        .call(axisY);

    if(yScale.domain()[0] < 0 && yScale.domain()[1] > 0) {
        g.append("g").attr("class", "zero-axis")
            .attr("transform", `translate(${[left,0]})`)
            .call(axisZero);
    }

    xG.append("text")
        .attr("class","label")
        .text(xLabel)
        .attr("transform", `translate(${[(right + left)/2, -labelPadding]})`);
    yG.append("text")
        .attr("class","label")
        .text(yLabel)
        .attr("transform", `translate(${[labelPadding, (top + bottom)/2]}) rotate(90)`);

    if(arrowheads !== "none") {
        setArrows(container, arrowheads, xG);
        setArrows(container, arrowheads, yG);
    }

    // These are XML attributes and can be overriden using CSS styles
    container.selectAll(".label")
        .attr("text-anchor", "middle")
        .attr("font-size", "11px")
        .attr("fill", "black");

    container.selectAll(".tick line")
        .attr("stroke", "lightgray");

    container.selectAll(".zero-axis line")
        .attr("stroke", "darkslategray");

    container.selectAll(".tick text")
        .attr("font-size", "10px");

    return [axisX,axisY];
}

function setArrows(container, arrowheads, g) {
    const svg = d3.select(container.node() ? container.node() : container.node().ownerSVGElement);
    const defs = svg.select("defs");
    addArrows(defs.node() ? defs : svg.append("defs"), "arrowhead", 10, 5);

    if (arrowheads === "end" || arrowheads === "both") {
        g.selectAll(".domain").attr("marker-end", "url(#arrowhead)");
    }
    if (arrowheads === "start" || arrowheads === "both") {
        g.selectAll(".domain").attr("marker-start", "url(#arrowhead)");
    }
}

/**
 * Creates a radial grid. To be used with chart-utils.css.
 *
 * @param container The SVG container where to draw the axes (will be placed at the origin)
 * @param aScale The scale used for the angular data
 * @param rScale The scale used for the radial data, which also determines the size of the system
 * @param angularData The array of data labels for the axes, default = [0,1,2,3,4,5,6,7,8,9,10,11]
 * @param numTicks The number of ticks per axis, default = 6
 * @param useGrid Whether to draw a grid or not, default = false
 * @param backdropOpacity The opacity of the backdrop behind the text, default = 1
 * @param backdropColor The color of the backdrop behind the text, default = "white"
 * @param arrowheads The arrowheads to use for the axes: "end", "start", "both", "none"; default = "none"
 *
 * @returns The axis object
 */

const __drawRadialAxes = function(container, aScale, rScale,
                                angularData = d3.range(0,12),
                                numTicks = 6,
                                useGrid = false,
                                backdropOpacity = 1,
                                backdropColor = "white",
                                arrowheads = "none") {

    const axis = d3.axisBottom(rScale)
                    .ticks(numTicks)
                    .tickSize(0)
                    .tickPadding(0)
                    .tickSizeOuter(0);

    // Rotate 90 degrees counterclockwise so that ticks appear vertically
    const g = container.append("g")
                        .attr("class", "chart radial")
                        .attr("transform","rotate(-90)");

    // Draw concentric circles if useGrid is true
    if(useGrid) {
        g.selectAll("circle.grid")
         .data(axis.scale().ticks(numTicks))
            .join("circle")
                .attr("class", d => d === 0 ? "grid zero" : "grid") // different style for zero line
                .attr("r", rScale);
    }

    // This will render an axis every 360/angularData.length degrees
    // Only the first axis will have text labels (the rest will be blank)
    g.selectAll("g.axis")
      .data(angularData)
        .join("g")
            .attr("class", "axis")
            .classed("blank",(d,i) => i !== 0) // blank labels in all except first (via CSS)
            .call(axis)
            .attr("transform", (d,i) => `rotate(${(i * 360/angularData.length)})`);

    // Don't show tick lines for blank axes if useGrid is true
    if(useGrid) {
        g.selectAll(".blank line").style("display","none");
    }

    // Draw backdrop behind text labels
    updateTextLabels(backdropOpacity, backdropColor);

    // Labels for each axis
    g.selectAll("text.angle.label")
     .data(angularData)
        .join("text")
            .attr("class", "angle label")
            .text(d => d)
            .attr("x", (d,i) => p2c(aScale(i), rScale.range()[1] + 15)[0])
            .attr("y", (d,i) => p2c(aScale(i), rScale.range()[1] + 15)[1])
            .attr("transform", "rotate(90)");

    if(arrowheads !== "none") {
        setArrows(container, arrowheads, g);
    }

    // These are XML attributes and can be overriden using CSS styles
    container.selectAll(".blank text, .tick:first-of-type")
        .attr("display", "none");

    container.selectAll(".radial .tick rect")
        .attr("fill", "white")


    container.selectAll(".radial .tick text")
        .attr("font-size", "10px")


    container.selectAll(".radial .grid")
        .attr("fill", "none")
        .attr("stroke", "lightgray")
        .attr("stroke-dasharray", "5 5")


    container.selectAll(".radial .grid.zero")
        .attr("stroke", "black")
        .attr("stroke-dasharray", 0)

    container.selectAll(".radial .angle.label")
        .attr("font-size", "12px")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")

    return axis;
}

/**
 * Places pie labels on pie chart.
 *
 * @param container The container where to place the labels
 * @param arc The arc generator function for the pie slices
 * @param property The property of the data to display
 * @param dir The direction of the labels (direction.RADIAL, direction.TANGENTIAL, or direction.NONE)
 * @param radius The radius of the labels (default = 1)
 * @param format The format function for the labels (default = null)
 */
const __placePieLabels = function(container, arc, property,
                              dir = direction.NONE,
                              radius = 1,
                              format = null) {

    const cx = d => arc.centroid(d)[0];
    const cy = d => arc.centroid(d)[1];
    const angle = d => (Math.atan2(cy(d),cx(d)) * 180) / Math.PI;
    const pt = (d,r=1,a=0) => [angle(d)+a, cx(d) * r, cy(d) * r];

    if(container.canvas) {
        console.log("Canvas not supported for pie labels");
    } else {
        // Creates label selection in container
        const label = container.append('text');

        const isOuter = radius > 2 - (arc.innerRadius()()*2)/(arc.innerRadius()()+arc.outerRadius()());

        if (isOuter) {
            label.attr("class", "outer slice label");
        } else {
            label.attr("class", "inner slice label");
        }

        label.attr("x",d => pt(d, radius)[1])
            .attr("y",d => pt(d, radius)[2])
            .style("alignment-baseline", "middle")
            .text(d => format && !isNaN(d.data[property]) ? format(d.data[property]) : d.data[property]);

        if (dir === direction.RADIAL) {
            label.style("text-anchor", d => pt(d)[1] > 0 ? "start" : "end")
                .attr("transform", d => pt(d)[1] > 0 ? `rotate(${pt(d,radius)})` : `rotate(${pt(d,radius,180)})`);
        } else if (dir === direction.TANGENTIAL) { // tangential
            label.style("text-anchor", "middle")
                .attr("transform", d => `rotate(${pt(d,radius,90)})`);
        } else { // none
            label.style("text-anchor", "middle");
        }
    }
}

/**
 * Sets arrows that can be placed at the tips of axes used in charts.
 * You must create a <defs> element in the SVG container, set an ID, width and height.
 * Axis should also have outer ticks set to 0.
 * To use an arrow, add the marker-end attribute to the path with the ID of the arrow. You can also
 * use marker-start to place an arrowhead at the beginning of the path.
 *
 * @param defs
 * @param id
 * @param width
 * @param height
 * @param fill
 */
export function addArrows(defs, id, width, height, fill = "black") {
    if(defs.select(`#${id}`).empty()) {
        defs.append("marker")
            .attr("id", id)
            .attr("viewBox", `${-width/2} ${-height/2} ${width*2} ${height*2}`)
            .attr("refX", width/2)
            .attr("refY", height)
            .attr("markerWidth", width)
            .attr("markerHeight", height*2)
            .attr("orient", "auto-start-reverse")
            .append("path")
               .attr("d", "M0,0 L15,5 L0,10 z")
               .attr("fill", fill);
    }
}



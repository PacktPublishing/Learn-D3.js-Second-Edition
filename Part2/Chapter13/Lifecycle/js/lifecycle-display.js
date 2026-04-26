import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export {app, dim, data, start, registerListeners};

const dim = {width: 1000, height: 700, margin: {top: 10, left: 200, bottom: 10, right: 10}};

const app = {
    speed: 10, // slower transitions and delays = higher number
    spacing: 100, // spacing between transitions
    format: d3.format(".2f"),
    start: d3.now()
};
app.maxTime = 320 * app.speed;  // default max time to display in the axis
app.scale = d3.scaleLinear()
              .range([dim.margin.left, dim.width - dim.margin.right])
app.axis = d3.axisBottom()
             .tickSize(dim.height - 100 + dim.margin.bottom)
             .tickSizeOuter(15)
             .scale(app.scale);
app.container = d3.select("body")
                  .append("svg")
                  .attr("width", dim.width)
                  .attr("height", dim.height)
                  .attr("viewBox", [0, 0, dim.width * 1.2, dim.height * 1.2]);

const data = {
    transitions: [],
    evts: [ // List of events that can be registered for a transition and colors for display
        {name: "on.start", color: "green"},
        {name: "tween", color: "purple"},
        {name: "on.interrupt", color: "darkorange"},
        {name: "on.cancel", color: "red"},
        {name: "on.end", color: "darkslateblue"},
        {name: "end.resolve", color: "teal"},
        {name: "end.reject", color: "maroon"},
        {name: "", color: "none"}
    ],
};

const evtsMap = new Map();
data.evts.forEach(d => evtsMap.set(d.name, d));



function start(showDelay = false) {
    app.spacing = 75 / data.transitions.length;  // spacing between transitions (min 15, to display 5 transitions)

    if(showDelay) {
        const delayEvt = {name: "delay", color: "blue"};
        data.evts.pop();
        data.evts.push(delayEvt);
        evtsMap.set(delayEvt.name, delayEvt);
    }

    data.transitions.forEach((d,i) => d.position = i * app.spacing * 8);
    app.scale.domain([0, app.maxTime]);
    app.start = d3.now();

    renderChart();
    drawScheduledTransitions();

    if(showDelay) {
        const timer = d3.interval(function(elapsed) {
            log("T1", evtsMap.get("delay"), app.spacing * 7)
            if(elapsed >= data.transitions[0].delay) {
                timer.stop();
            }
        }, 15);
    }
}

/**
 * Render chart
 */
function renderChart() {
    app.container.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0, ${0})`)
        .call(app.axis);
    d3.select(".axis .domain")
        .attr("transform", `translate(0,${dim.height - 100})`);
    chartLines();
}

/**
 * Registers listeners for the transition events
 * @param trData
 */
function registerListeners(trData) {

    printLabels(trData);

    trData.transition
        .on("start", () => log(trData.name, evtsMap.get("on.start"), trData.position))
        .tween("", () => t => log(trData.name, evtsMap.get("tween"), trData.position + app.spacing))
        .on("interrupt", () => {
            log(trData.name, evtsMap.get("on.interrupt"), trData.position + app.spacing*2);
            trData.interrupted = true;
        })
        .on("cancel", () => log(trData.name, evtsMap.get("on.cancel"), trData.position + app.spacing*3))
        .on("end", () => log(trData.name, evtsMap.get("on.end"), trData.position + app.spacing*4))
        .end()
            .then(() => { // Transition completed
                log(trData.name, evtsMap.get("end.resolve"), trData.position + app.spacing*5);
                d3.select("#"+trData.name).style("fill", "green").style("stroke", "green");
            })
            .catch(() => { // Transition did not complete
                log(trData.name, evtsMap.get("end.reject"), trData.position + app.spacing*6);
                if(trData.interrupted) {
                    d3.select("#"+trData.name).style("fill", "gold").style("stroke", "darkorange");
                } else {
                    d3.select("#"+trData.name).style("fill", "red").style("stroke", "red");
                }
            });
}

/**
 * Prints labels for the events on the right side of the screen
 * @param trData  The transition data
 */
function printLabels(trData) {

    const labels = data.evts.map(d => d.name);

    // Print the transition name if there are more than one transitions
    if(data.transitions.length > 1) {
        app.container.append("text")
            .text(trData.name.replace("-", "."))
            .attr("class", "label")
            .attr("x", 10)
            .attr("y", trData.position + app.spacing * 3)
            .style("font-size", app.spacing)
            .style("fill", "black");
    }

    // Print the event labels
    app.container.selectAll(".label.event."+trData.name)
        .data(data.evts.map(d => d.color))
        .join("text")
        .attr("class", "label event "+trData.name)
        .attr("x", 60)
        .attr("y", (d,i) => trData.position + app.spacing * i + app.spacing/15)
        .style("fill", d => d)
        .style("font-size", app.spacing * 2/3)
        .text((d,i) => labels[i])
}

/**
 * Log the transition event in the console and show it on the screen as a rectangle
 * @param name
 * @param evt
 * @param pos
 */
function log(name, evt, pos) {

    const time = app.format(d3.now() - app.start);

    // log the event in the console
    console.log(`${time}ms: ${name} ${evt.name}`);

    // show the event on the screen as a rectangle
    app.container.append("rect")
        .attr("class", "bar")
        .attr("x", app.scale(parseInt(time)))
        .attr("y", pos)
        .attr("width", evt.name === "tween" || evt.name === "delay" ? 2 : 10)
        .attr("height", app.spacing * 2 / 3)
        .attr("fill", evt.color);
}

/**
 * Draw lines for reference
 */
function chartLines() {
    const lines = d3.range(0, app.spacing * 8 * data.transitions.length, app.spacing); // lines for reference
    app.container.selectAll("line.line")
        .data(lines)
        .join("line")
        .attr("class", "line")
        .attr("x1", app.scale(0))
        .attr("y1", d => d+(app.spacing/3))
        .attr("x2", app.scale(app.maxTime))
        .attr("y2", d => d+(app.spacing/3))
        .style("stroke", d3.scaleOrdinal(data.evts.map(d => d.color)))
        .style("stroke-width", app.spacing * 2 / 3)
        .style("opacity", 0.2);
}

/** Draw rectangles that represent scheduled transitions.
 * They will change color when they finish or are interrupted/cancelled
 */
function drawScheduledTransitions() {
    app.container.selectAll("rect")
        .data(data.transitions)
        .join("rect")
        .attr("id", d => d.name)
        .attr("y", d => d.position)
        .attr("x", d => d.parent
                      ? app.scale(data.transitions[d.parent].delay + data.transitions[d.parent].duration)
                      : app.scale(d.delay))
        .attr("width", d => app.scale(d.duration) - app.scale(0))
        .attr("height", app.spacing * 20 / 3)
        .style("fill", "gray")
        .style("stroke", "black")
        .style("fill-opacity", .3);
}
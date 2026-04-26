import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

import {renderChart, updateChart} from "./view.js";
import {app, dim, chart, getTransition} from "./common.js";
import * as data from "./data.js";

/**
 * Sets up the scales, data, and the graphical elements.
 * @param data
 * @returns {false|boolean}
 */
export function createChart() {
    // Check data for consistency
    const errors = data.verify();
    errors.forEach(e => {
        d3.select("body")
            .append("h3").style("color", "red")
            .text("Configuration error: " + e);
    })
    if (errors.length > 0) {
        return false;
    }

    let success = true;
    success &&= config();
    success &&= data.prepare();
    return success;
}

/**
 * Pauses and resumes the animation. Current frame number is saved in chart.state (see interrupt handler in animate() function)
 * @param e
 */
export function togglePause(e) {
    if(chart.paused) {  // if chart is paused, then resume
        chart.paused = false;
        animate(chart.state); // continue animation from frame that was interrupted
        console.log("Animation resumed from frame " + chart.state + ".");
    } else {
        d3.select("svg.chart").interrupt(); // interrupt the main transition (chart state is saved in event handler)
    }
}

// ##### B) Initialization and configuration ======

/**
 * Configures  chart parameters and scales (called from createChart)
 */
function config() {
    app.fmt = d3.format(app.formatSpecifier);

    app.scale.y.domain(d3.range(app.numBars+1)) // + 1 line to display entering/leaving bars at bottom
        .range([dim.margin.top, dim.height - dim.margin.bottom + dim.height/app.numBars])
        .padding(0.1);

    app.scale.x.range([dim.margin.left, dim.width - dim.margin.right]);

    app.axis.scale(app.scale.x)
        .tickSizeInner(-dim.height + dim.margin.top + dim.margin.bottom)
        .ticks(dim.width / 100, "s")
        .tickFormat(d => app.replaceBillions ? app.fmt(d).replace("G", 'B') : app.fmt(d));

    return true;
}


/**
 * Starts the animation.
 */
export function start() {
    if(createChart() && renderChart()) {
        animate(0);
    } else {
        console.error("Error creating chart");
    }
}

// ##### E) Internal functions that are called during the animation

/**
 * Main animation function. It will repeat the transition for each data frame.
 * @param i
 */
function animate(i) {

    d3.select("svg").transition(getTransition())
        .on("interrupt", () => { // interrupts the transition (pausing the animation)
            chart.state = i; // saves the current frame number, to be used when resuming the animation
        })
        .end()
        .then(() => {
            updateChart(chart.data[i]); // update function
            if(i < chart.data.length - 1) {
                animate(++i);
            }
        })
        .catch((e) => {
            if (e) { // if other errors occur, log them and quit
                console.log(e);
                throw e;
            }
            else { // if the transition is interrupted, it will pause the animation
                console.log("Animation paused at frame " + i + ".");
                chart.paused = true;
            }
        });
}








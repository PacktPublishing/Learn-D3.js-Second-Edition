import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

import * as view from "./view-1.9.js";
import {chart, getTransition} from "./common-1.6.js";


export function start() {
    animate(1);
}

function animate(index) {
    d3.select("svg.chart")
      .transition(getTransition())
        .end().then(() => {
            view.show(chart.data[index]);
            if(index < chart.data.length-1) {
                animate(++index);
            }
        })
        .catch(e => {   // interrupt handler
            if(e && e instanceof Error) throw e;    // rethrow any real errors
            else {
                chart.state = index;    // saves the current frame number
                chart.paused = true;    // animation is paused
                console.log("Animation paused at frame " + index + ".");
            }
        });
}

export function pause() {
    if(chart.paused) {  // if chart is paused, then resume
        chart.paused = false;
        animate(chart.state); // continue animation from frame that was interrupted
        console.log("Animation resumed from frame " + chart.state + ".");
        d3.select("#pause").text("pause");  // update HTML text
    } else {
        d3.select("svg.chart").interrupt(); // interrupt the main transition (chart state is saved in event handler)
        d3.select("#pause").text("resume"); // update HTML text

    }
}
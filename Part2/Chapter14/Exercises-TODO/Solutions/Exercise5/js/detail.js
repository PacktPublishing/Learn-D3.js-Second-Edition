import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';

import {app} from './common.js';

import {inBrush, isValid} from "../../../../js/brush-utils.js";

// EXERCISE.
// 1) See common-1.0.js; 2) and 3) See view.js
// 4) Declare a variable to store the current brush selection
let selected = [];

// 5) Implement and export the setup() function (used in view.js).
export function setup() {
    //   a) create a brush layer (append it to the SVG) and call the app.brush function
    const brushLayer = d3.select("svg")
        .append("g")
        .attr("class", "brush")
        .call(app.brush);

    //  b) Configure the app.brush function: add event listeners for the brush events
    //     Note: must require the shift key to activate the brush (use filter and keyModifiers)
    app.brush
        .filter(evt => evt.shiftKey)    // require shift key
        .keyModifiers(false)
        .on("brush", function(evt) {
            if (!isValid(evt)) return;  // return if selection is invalid
            selected = app.data.countries
                .filter(d => inBrush(evt.selection,
                               [app.scale.x(d.hdi),
                                      app.scale.y(d.gdp)]));
            d3.selectAll("circle")
                .style("fill", p => selected.includes(p) ? "red" : app.color(p.continent));
        })
        .on("end", function(evt) {
            if (!isValid(evt)) return;
            if(selected.length > 0) {
                rescale(evt.selection);
                updateView();
                evt.target.clear(brushLayer);
            }
        });
}

// 6) Define a function to rescale the chart based on the brush selection
//    Call this function in the "end" event listener
function rescale([start, end]) {
    // get domain values from the selection
    const x0 = app.scale.x.invert(start[0]);
    const y1 = app.scale.y.invert(start[1]);  // inverse direction for y
    const x1 = app.scale.x.invert(end[0]);
    const y0 = app.scale.y.invert(end[1]);    // inverse direction for y

    // update the scale domains (also updates the axes' scales)
    app.scale.x.domain([x0, x1]);
    app.scale.y.domain([y0, y1]);
}

// 7) Define a function to call the axes and update the view (circle positions and fill).
//    Call this function in the "end" event listener after rescaling
function updateView() {
    d3.select(".x-axis").call(app.axis.x);
    d3.select(".y-axis").call(app.axis.y);

    d3.selectAll("circle.dot")
        .attr("cx", d => app.scale.x(d.hdi))
        .attr("cy", d => app.scale.y(d.gdp))
        .style("fill", d => app.color(d.continent));
}
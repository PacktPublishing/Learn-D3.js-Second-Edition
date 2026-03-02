import * as d3 from 'https://cdn.skypack.dev/d3@7.9.0';

import {app} from './common.js';

import {inBrush, isValid} from "../../../../js/brush-utils.js";

// Current brush selection
let selected = [];

// Brush implementation Setup function used in view.js. Brush is activated on Shift-click.
export function setup() {
    const brushLayer = d3.select("svg")
        .append("g")
        .attr("class", "brush")
        .call(app.brush);

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

// Rescales chart and axes
function rescale([start, end]) {
    const x0 = app.scale.x.invert(start[0]);
    const y1 = app.scale.y.invert(start[1]);  // inverse direction for y
    const x1 = app.scale.x.invert(end[0]);
    const y0 = app.scale.y.invert(end[1]);    // inverse direction for y

    app.scale.x.domain([x0, x1]);
    app.scale.y.domain([y0, y1]);
}

// Updates view after rescaling
function updateView() {
    d3.select(".x-axis").call(app.axis.x);
    d3.select(".y-axis").call(app.axis.y);

    d3.selectAll("circle.dot")
        .attr("cx", d => app.scale.x(d.hdi))
        .attr("cy", d => app.scale.y(d.gdp))
        .style("fill", d => app.color(d.continent));
}
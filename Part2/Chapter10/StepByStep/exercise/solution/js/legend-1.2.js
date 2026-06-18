import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';
import {dim, app} from './common-1.6.js';

export function drawLegend() {
    const legend = d3.select("svg")
                     .append("g")
                       .attr("class", "legend")
                       .attr("transform", `translate(${[85, 50]})`);

    legend.selectAll("g.item")
          .data(app.data.continents)
             .join("g").attr("class", "item")
                .on("mouseenter", showContinents)           // event handlers
                .on("mouseleave", clearContinents)
        // EXERCISE: (1) add click handler to toggle fixed selection
        // calling a function which will be implemented below, in (3)
                .on("click", toggleFixContinents)
                .each(function(d, i) {
                    d3.select(this)
                      .append("rect")
                          .attr("y", i * dim.legend.h)
                          .attr("height", dim.legend.h - 2)
                          .attr("width", dim.legend.w)
                          .style("fill", app.color(d));

                    d3.select(this)
                      .append("text")
                          .attr("y", 5 + i * dim.legend.h)
                          .attr("x", dim.legend.w + 5)
                          .text(d);
                });
}

// EXERCISE: (2) add Boolean variable to track fixed selection
let fixContinent = false;

// EXERCISE: (3) add a function to toggle the variable. This function
//           should be called when the user clicks on a legend item.
//           It clears the continent selection and inverts the variable
//           that tracks whether the selection is fixed or not.
function toggleFixContinents(event) {
    if(fixContinent) {
        clearContinents(event);
    }
    fixContinent = !fixContinent;
}

// EXERCISE: (4) modify showContinents() to only work if not continents are not fixed
function showContinents(event, d) {
    if(!fixContinent) {
        d3.selectAll(".item")
            .classed("fade", k => k !== d)
        d3.selectAll(".dot")
            .classed("fade", k => k.continent !== d)
            .classed("show", k => k.continent === d);
    }
}

// EXERCISE: (5) modify clearContinents() to only work if continents not fixed,
// OR if fixed but user clicks (the event.type is "click")
function clearContinents(event) {
    if(!fixContinent || event.type === "click") {
        d3.selectAll(".item, .dot")
            .classed("fade", false)
        d3.selectAll(".dot")
            .classed("show", false);
    }

}

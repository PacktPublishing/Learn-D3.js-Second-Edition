import * as d3 from 'https://cdn.skypack.dev/d3@7.9.0';
import {dim, app} from './common.js';

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
                .each(function(d, i) {
                    d3.select(this)
                      .append("path")
                        .attr("d", d => d3.symbol().type(d3[app.symbol(d)]).size(30)(d))
                        .attr("transform", `translate(${[0, i * dim.legend.h + 4]})`)
                        .style("stroke", app.color(d));

                    d3.select(this)
                      .append("text")
                          .attr("y", 5 + i * dim.legend.h)
                          .attr("x", dim.legend.w + 5)
                          .text(d);
                });
}

function showContinents(event, d) {
    d3.selectAll(".item")
        .classed("fade", k => k !== d)
    d3.selectAll(".dot")
        .classed("fade", k => k.continent !== d)
        .classed("show", k => k.continent === d);
}

function clearContinents() {
    d3.selectAll(".item, .dot")
        .classed("fade", false)
    d3.selectAll(".dot")
        .classed("show", false);
}

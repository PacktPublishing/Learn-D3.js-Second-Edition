import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import {app} from "./common.js";

const fmt = d3.format(",");

export function showTooltip(event, d) {
    // if moon, d.cx is defined, otherwise is planet
    const position = d.cx ? `translate(${[d.cx, app.scale(d.diameterKm/4)]})`
                                 : "translate(-75,50)";
    d3.select(".tooltip").raise() // place over other elements
        .attr("transform", position)
        .transition()
           .style("opacity", 1)
           .select("text")
           .text("Diameter: " + fmt(d.diameterKm) + " km");
}

export function hideTooltip() {
    d3.select(".tooltip").transition().style("opacity", 0);
}
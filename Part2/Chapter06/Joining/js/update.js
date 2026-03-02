/**
 * Update the position and radius of circles after changing their data.
 */

import * as d3 from "https://cdn.skypack.dev/d3@7.9.0";
export function update() {
    d3.select("svg")
        .selectAll("circle")
            .attr("cy", 50)
            .transition()
                .attr("cx", (d,i) => i * 100 + 50)
                .attr("r", d => d);
}
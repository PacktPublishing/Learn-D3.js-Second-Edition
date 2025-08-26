// Using gradient ribbons - see a tutorial:
// https://www.visualcinnamon.com/2016/06/orientation-gradient-d3-chord-diagram.html

import * as d3 from "https://cdn.skypack.dev/d3@7";

const gradientId = d => "grad-" + d.source.index + "-" + d.target.index;

// URL to use in the SVG for the gradient fill or stroke
export const url = d => "url(#" + gradientId(d) + ")";

// Call this function to set up the gradients for the chords
export function setup(defs, radius, color, chords) {

    const angle = x => (x.endAngle - x.startAngle) / 2 + x.startAngle - Math.PI/2;

    const grads = defs.selectAll("linearGradient")
                      .data(chords)
                         .join("linearGradient")
                            .attr("id", d => gradientId(d))
                            .attr("gradientUnits", "userSpaceOnUse")
                            .attr("x1", d => radius * Math.cos(angle(d.source)))
                            .attr("y1", d => radius * Math.sin(angle(d.source)))
                            .attr("x2", d => radius * Math.cos(angle(d.target)))
                            .attr("y2", d => radius * Math.sin(angle(d.target)));

    // set the starting color (at 0%)
    grads.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", d => color(d.target.index))
        .attr("stop-opacity", 1);

    grads.append("stop")
        .attr("offset", "50%")
        .attr("stop-color", d => {
            const tc = d3.hsl(color(d.target.index));
            const sc = d3.hsl(color(d.source.index));
            return d3.hsl((tc.h+sc.h)/2, (tc.s+sc.s)/2, (tc.l+sc.l)/2);
        })
        .attr("stop-opacity", 1);

    //set the ending color (at 100%)
    grads.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", d => color(d.source.index))
        .attr("stop-opacity", 1);

    return grads;
}
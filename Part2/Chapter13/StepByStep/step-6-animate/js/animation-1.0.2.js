import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

import * as view from "./view-1.3.js";
import {chart} from "./common-1.2.js";

/* Example using a new transition - see also animation-1.0.1.js and animation-1.1.js */

export function start() {
    animate(1);
}

/* Example using a new transition applied to the SVG */
function animate(index) {
    d3.select("svg.chart")
      .transition().duration(1000).ease(d3.easeLinear) // this transition may interfere with transitions in exit and update selections
        .end().then(() => {
            view.show(chart.data[index]);
            if(index < chart.data.length-1) {
                animate(++index);
            }
        });
}


import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

import * as view from "./view-1.7.js";
import {chart, getTransition} from "./common-1.5.js";

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
        });
}

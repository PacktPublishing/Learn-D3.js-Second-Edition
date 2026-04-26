import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

import * as view from "./view-1.3.js";
import {chart} from "./common-1.2.js";

/* Example using d3.interval() - see also animation-1.0.2.js and animation-1.1.js */

export function start() {
    animate(1);
}

function animate(index) {
    const timer = d3.interval(() => {
        if(index < chart.data.length-1) {
            view.show(chart.data[++index]);
        } else {
            timer.stop();
        }
    }, 1000);
}


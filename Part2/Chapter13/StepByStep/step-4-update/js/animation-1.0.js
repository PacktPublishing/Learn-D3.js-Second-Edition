import * as d3 from "https://cdn.skypack.dev/d3@7.9.0";

import * as view from "./view-1.2.js";
import {chart} from "./common-1.1.js";

let index = 0;

export function start() {
    d3.select("body")
        .on("click", () => (index < chart.data.length)
                           ? view.show(chart.data[index++])
                           : view.show(chart.data[0]));
}
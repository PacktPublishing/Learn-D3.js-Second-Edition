import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

import * as view from "./view-1.3.js";
import {chart} from "./common-1.1.js";

let index = 0;

export function start() {
    d3.select("body")
        .on("click", () => (index < chart.data.length)
                            ? view.show(chart.data[index++])
                            : view.show(chart.data[0]));
}
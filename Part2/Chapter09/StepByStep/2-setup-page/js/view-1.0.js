import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';
import {dim} from './common-1.0.js';

export function draw() {
    d3.select("#chart")
        .append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", `0 0 ${dim.w} ${dim.h}`);
}
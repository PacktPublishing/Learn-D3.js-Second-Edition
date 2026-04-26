import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import {dim} from "./common-1.0.js";

const svg = d3.select("body")
              .append("svg")
                .attr("width", "100%")
                .attr("height", "100%")
                .attr("viewBox", `0 0 ${dim.width} ${dim.height}`);

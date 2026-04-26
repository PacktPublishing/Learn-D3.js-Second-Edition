import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import {app, dim} from "./common-1.0.js";

d3.select("#limit").text(app.limit); // update the title of the page

// The SVG container
const svg = d3.select("body").append("svg")
              .attr("width", dim.width)
              .attr("height",dim.height);
// The chart container, placed in the center
const chart = svg.append("g")
                 .attr("class", "pie")
                 .attr("transform", `translate(${[dim.width/2, dim.height/2]})`);
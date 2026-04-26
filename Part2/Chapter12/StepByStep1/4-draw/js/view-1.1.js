import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as utils from "../../../js/chart-utils.js";
import {app, dim, data} from "./common-1.1.js";

d3.select("#limit").text(app.limit); // update the title of the page

// The SVG container
const svg = d3.select("body").append("svg")
                             .attr("width", dim.width)
                             .attr("height",dim.height);
// The chart container, placed in the center
const chart = svg.append("g")
                 .attr("class", "pie")
                 .attr("transform", `translate(${[dim.width/2, dim.height/2]})`);

export function draw() {
    // Bind the data the set of slices
    const slices = chart.selectAll("g.slice")
                        .data( app.pie(data.countries) )
                           .join("g")
                              .attr("class", "slice");
    // Append a path with the rendered slice
    slices.append("path")
          .attr("d", app.arc)
          .attr("fill", app.color);

    // Append inner labels for the values, on some slices
    utils.pieLabels()
         .container(slices.filter(d => d.endAngle - d.startAngle > 0.05)) // Don't display in small slices
         .arc(app.arc)
         .property('gdp')
         .radius(1.7)
         .direction(utils.direction.RADIAL)
         .format(d => d3.format(",.3s")(d).replace('G','B'))();

    // Append outer labels for the countries, on some slices
    utils.pieLabels()
         .container(slices.filter(d => d.endAngle - d.startAngle > 0.03)) // Don't display in small slices
         .arc(app.arc)
         .property('country')
         .radius(2)
         .direction(utils.direction.RADIAL)();
}
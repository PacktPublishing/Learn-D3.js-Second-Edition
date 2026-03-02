import * as d3 from 'https://cdn.skypack.dev/d3@7.9.0';
import * as utils from "../../../../js/chart-utils.js";
import {app, dim, data} from "./common.js";

d3.select("#limit").text(app.limit); // update the title of the page

// The SVG container
const svg = d3.select("body").append("svg")
                             .attr("width", dim.width)
                             .attr("height",dim.height);
// The chart container, placed in the center
const chart = svg.append("g")
                 .attr("class", "pie")
                 .attr("transform", `translate(${[dim.width/2, dim.height/2+35]})`);

export function draw() {
    // Bind the data the set of slices
    const slices = chart.selectAll("g.slice")
                        .data( app.pie(data.flags) )
                           .join("g")
                              .attr("class", "slice");
    // Append a path with the rendered slice
    slices.append("path")
          .attr("d", app.arc)
          .attr("fill", app.color);


    // Either put the labels near the slices... (using a utility function from chart-utils.js)
    // Place inner labels for the values
    utils.pieLabels()
        .container(slices)
        .arc(app.arc)
        .property('value')
        .radius(1.8)
        .format(d3.format(",.3s"))();

    // Place outer labels for the flags
    utils.pieLabels()
        .container(slices)
        .arc(app.arc)
        .property('flag')
        .radius(2)
        .direction(utils.direction.RADIAL)();

    // Or use legends (remove if using labels on slices):
    const legend = svg.append("g")
        .attr("transform", `translate(${[20,40]})`)
        .attr("class", "legend");

    utils.legend()
        .container(legend)
        .color(app.color)
        .data(data.flags.map(d => d.flag))();
}
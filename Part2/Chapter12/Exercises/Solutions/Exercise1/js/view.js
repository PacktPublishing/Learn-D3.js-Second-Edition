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
                 .attr("transform", `translate(${[dim.width/2, dim.height]})`);

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

    // Alternative - Use labels on slices (remove if using legends):
    utils.pieLabels()
         .container(slices.filter(d => d.endAngle - d.startAngle > 0.08)) // Don't display in small slices
         .arc(app.arc)
         .property('gdp')
         .radius(1.47)
         .direction(utils.direction.RADIAL)
         .format(d => d3.format(",.3s")(d).replace('G','B'))();

    utils.pieLabels()
         .container(slices.filter(d => d.endAngle - d.startAngle > 0.03)) // Don't display in small slices
         .arc(app.arc)
         .property('country')
         .radius(1.75)
         .direction(utils.direction.RADIAL)();

    // Alternative - Use legends (remove if using labels on slices):
    const legend = svg.append("g")
        .attr("transform", `translate(${[dim.width-120,30]})`);

    utils.legend()
        .container(legend)
        .color(app.color)
        .data(data.countries.map(d => d.country))();
}
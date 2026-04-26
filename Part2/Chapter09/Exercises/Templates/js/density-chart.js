import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as utils from "../../../js/chart-utils.js";

export {plot, dim, planetColors, scale, getData};

const dim = {height: 800, width: 1000, margin: 75};
const scale = {};

const planetColors = ["#ff9900", "coral", "aqua", "cornflowerblue",
                      "#0099c6", "gold", "orange", "coral", "green", "#dc3912"];
const colors = (i) => planetColors[i % planetColors.length];

d3.select("body")
    .append("div").attr("width", "100%").attr("height", "100%")
    .append("svg").attr("viewBox", `0 0 ${dim.width} ${dim.height}`);

/**
 * Filters the data and returns a reference to the data to be used in the chart.
 * @param rawData
 * @returns {*}
 */
function getData(rawData) {
    // Get bodies that orbit the Sun ("planets") from all subgroups
    const planets = d3.merge([rawData.planets, rawData.tnos, rawData.asteroids, rawData.centaurs]);

    // Get satellites from all bodies
    const satellites = planets.flatMap(d =>
        d.satellites ? d.satellites.map(e => ({ ...e, planet: d.name })) : []
    );

    // Creates a dataset containing "planets" and satellites that have
    // density and volume defined in the database (about 30 objects), sorted by diameter
    return d3.merge([planets, satellites])
             .filter(d => d.density && d.volume)
             .sort((a, b) => d3.descending(a.diameterKm, b.diameterKm));
}

/**
 * Plots the chart
 * @param data
 */
function plot(data) {
    const svg = d3.select("svg");

    // Creates radial gradients to color the planets
    setGradient(svg, data);

   const [xAxis, yAxis] = utils.cartesianAxes()
                               .container(svg)
                               .xScale(scale.x)
                               .yScale(scale.y)
                               .xLabel("Volume in km3")
                               .yLabel("Density in g/cm3")
                               .showHorizontalGrid(true)
                               .showVerticalGrid(true)
                               ();

    d3.select(".x-axis").call(xAxis.ticks(10, d3.format("s")));

    // Renders the data points
    svg.selectAll(".entry")
       .data(data)
         .join("g").attr("class", "entry")
           .on("mouseover", showTooltip) // Shows the label on mouseover
           .on("mouseout", hideTooltip)
           .append("circle")
                .attr("r", d => scale.d(d.diameterKm))
                .attr("cx", d => scale.x(d.volume))
                .attr("cy", d => scale.y(d.density))
                .attr("fill", d => "url(#gradient-" + d.id.replace(/\./g, "_") + ")");
}

/**
 * Shows tooltips on mouseover
 * @param e
 */
function showTooltip(e,d) {
    d3.select("svg")
      .append("text").attr("class", "tooltip")
        .attr("id", "label-"+d.id.replace(/\./g, "_"))
        .attr("x", scale.x(d.volume))
        .attr("y", scale.y(d.density))
        .text(d.name + ((d.planet) ? ` (${d.planet})` : ""))
        .append("tspan")
           .attr("dy", 20)
           .attr("x", scale.x(d.volume))
           .text(d.density + " g/cm3");
}

function hideTooltip(e,d) {
    d3.select("#label-"+d.id.replace(/\./g, "_")).remove();
}

/**
 * Defines a gradient to color the planets
 * @param svg
 * @param data
 */
function setGradient(svg, data) {
    svg.append("defs")
       .selectAll("radialGradient")
          .data(data)
             .join("radialGradient")
                .attr("cx", .7)
                .attr("cy", .6)
                .attr("r", .9)
                .attr("id", d => "gradient-" + d.id.replace(/\./g, "_"))
                .each(function (d, i) {
                    const gr = d3.select(this);
                    gr.append("stop")
                        .attr("stop-color", () => d3.hsl(colors(i)).brighter())
                        .attr("offset", "0%")
                    gr.append("stop")
                        .attr("stop-color", () => colors(i))
                        .attr("offset", "33%")
                        .attr("stop-opacity", 1)
                    gr.append("stop")
                        .attr("stop-color", () => d3.hsl(colors(i)).darker())
                        .attr("offset", "66%")
                        .attr("stop-opacity", .6)
                    gr.append("stop")
                        .attr("stop-color", () => d3.hsl(colors(i)).darker().darker())
                        .attr("offset", "100%")
                        .attr("stop-opacity", .2)
                });
}
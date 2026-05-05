import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import {showMeasure, hide, setupTooltip} from "./geometry.js";



let map = {}; // store view and geoPath

// Utility GEoJSON objects for the routes and airports, to be used with geoPath generator
// Lines for the routes
const lineString = route => ({
    id: route.id,
    properties: { airline_count: route.airlines },
    type: "LineString",
    coordinates: [route.source.coordinates, route.target.coordinates]
});

// Points for the airports
const point = airport => ({
    id: airport.id,
    type: "Point",
    coordinates: airport.coordinates
});

export function drawAirportRoutes(mapData, airports, routes, tooltip = false) {

    map = mapData;

    const color = d3.scaleLog()
        .range(['yellow', 'red'])
        .domain(d3.extent(routes, d => +d.airlines));
    const width = d3.scaleLinear().range([2, 8]).domain(color.domain());

    map.view.selectAll(".route")
       .data(routes)
        .join("path").attr("class","route")
          .datum(lineString)
            .attr("d", map.geoPath)
            .style("stroke", d => color(d.properties.airline_count))
            .style('stroke-width', d => width(d.properties.airline_count))
            .on('mouseenter', showMeasure)
            .on('mouseleave', hide);

    // Only show airports that are part of the routes
    const selectedAirports =
        airports.filter(d => routes.filter(k => k.id.split('-')[0] === d.id ||
                                           k.id.split('-')[1] === d.id).length > 0);
    map.view.selectAll("g.airport")
       .data(selectedAirports)
        .join("g").attr("class","airport")
          .datum(point)
            .each(function(d) {
                d3.select(this).append("path").attr('d', map.geoPath)
                    .style("fill", 'yellow').style("stroke", "black");
                d3.select(this).append("text").text(d.id).attr("x", 7)
                    .attr("transform", `translate(${map.geoPath.centroid(d)})`)
            });

    if(tooltip) {
        setupTooltip(map);
    }
}
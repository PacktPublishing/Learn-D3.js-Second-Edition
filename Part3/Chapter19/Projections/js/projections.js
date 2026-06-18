/* Base code for projection examples */

import * as d3_all from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as d3_geo_projection from "https://cdn.skypack.dev/d3-geo-projection@4";
import * as d3_geo_polygon from "https://cdn.skypack.dev/d3-geo-polygon@1";
import * as topojson from 'https://cdn.skypack.dev/topojson-client@3';
import * as tissot from '../../js/tissot.js';
const d3 = Object.assign({}, d3_all, d3_geo_projection, d3_geo_polygon);

const map = {};

export function draw(svg, geoPath) {
    svg.selectAll("path.country")
       .data(map.features)
         .join("path").attr("class","country")
           .attr("d", geoPath);
}

function drawTissot(svg, geoPath, {radius, stepLon, stepLat, maxLon, maxLat}) {
    svg.selectAll("path.indicatrix")
       .data(tissot.makeIndicatrix(radius, stepLon, stepLat, maxLon, maxLat))
         .join("path").attr("class","indicatrix")
            .attr("d", geoPath);
}

/**
 * Draw secant parallels for projections with a single standard parallel (parallel) or two standard parallels (parallels).
 * For projections without standard parallels, removes the secant parallels.
 * @param geoPath
 */
function drawParallels(svg, geoPath) {
    const projection = geoPath.projection();
    if(projection.parallel) {
        svg.append("path").attr("class","parallel-2")
            .datum(d3.geoCircle().center([0,90]).radius(- projection.parallel()- 90))
            .attr("d", geoPath);

        svg.append("path").attr("class","parallel-1")
            .datum(d3.geoCircle().center([0,90]).radius(projection.parallel() - 90 + 1))
            .attr("d", geoPath);

    } else if (projection.parallels) {
        svg.append("path").attr("class","parallel-2")
            .datum(d3.geoCircle().center([0,90]).radius(projection.parallels()[0] - 90))
            .attr("d", geoPath);

        svg.append("path").attr("class","parallel-1")
            .datum(d3.geoCircle().center([0,90]).radius(projection.parallels()[1] - 90 + 1))
            .attr("d", geoPath);
    } else {
        svg.append("path").attr("class","parallel-2")
        svg.append("path").attr("class","parallel-1")
    }
}

/**
 * Update secant parallels for new map.
 */
function updateParallels(geoPath) {
    const projection = geoPath.projection();
    if(projection.parallel) {
        d3.select(".parallel-2")
            .datum(d3.geoCircle().center([0,90]).radius(- projection.parallel() - 90))
            .attr("d", geoPath)

        d3.select(".parallel-1")
            .datum(d3.geoCircle().center([0,90]).radius(projection.parallel() - 90 + 1))
            .attr("d", geoPath)

    } else if (projection.parallels) {
        d3.select(".parallel-2")
            .datum(d3.geoCircle().center([0,90]).radius(projection.parallels()[0] - 90))
            .attr("d", geoPath)

        d3.select(".parallel-1")
            .datum(d3.geoCircle().center([0,90]).radius(projection.parallels()[1] - 90 + 1))
            .attr("d", geoPath)
    } else {
        d3.selectAll(".parallel-2, .parallel-1").datum(null)
    }
}

function drawGraticules(svg, geoPath) {

    svg.append("path").attr("class","equator")
        .datum(d3.geoGraticule().stepMinor([0,0]).stepMajor([180,90]))
        .attr("d", geoPath);

    svg.append("path").attr("class","graticule")
        .datum(d3.geoGraticule10())
        .attr("d", geoPath);
}

function drawBackground(svg, geoPath) {
    svg.append("path").attr("class","background")
       .datum({type:"Sphere"})
         .attr("d", geoPath);
}

function drawOutline(svg, geoPath) {
    svg.append("path").attr("class","outline")
        .datum({type:"Sphere"})
        .attr("d", geoPath);
}

function clipOutline(svg) {
    svg.selectAll(".outline, .background, .equator, .graticule, .parallel-1, .parallel-2, .indicatrix, .country")
        .attr("clip-path", "url(#clip)");
}

export function updateMap(data, index) {
    d3.selectAll("li").style("font-weight", "normal");
    d3.select("#p" + index).style("font-weight", "bold");

    const geoPath = d3.geoPath().projection(data.projection);
    updateParallels(geoPath);
    d3.selectAll("path, clipPath").attr("d", geoPath);
}

export function showMap(data, index, clip = false) {

    d3.selectAll("li").style("font-weight", "normal");
    d3.select("#p" + index).style("font-weight", "bold");

    d3.json('../data/' + data.file).then(function(topology) {
        data.topology   = topology.objects[data.key];
        data.features   = topojson.feature(topology, data.topology).features;

        if(data.filter) {
            map.features = data.features.filter(data.filter);
        } else {
            map.features = data.features;
        }

        const svg = d3.select("#map");
        const geoPath = d3.geoPath().projection(data.projection);
        d3.selectAll("path, clipPath").remove(); // remove previous map and clipPath

        // Set up a clipPath to prevent drawing outside the visible area of the map
        // in interrupted projections from d3-geo-projection. Use the updated interrupted
        // projections from d3-geo-polygon, which don't require clipping.
        svg.select("defs").append("clipPath").attr("id", "clip")
            .append("path")
            .datum({type: "Sphere"})
            .attr("d", geoPath);

        drawBackground(svg, geoPath);
        drawParallels(svg, geoPath);
        drawGraticules(svg, geoPath);
        draw(svg, geoPath);
        drawOutline(svg, geoPath);
        drawTissot(svg, geoPath, data.tissot);

        // Necessary for interrupted projections from d3-geo-projection,
        // but not for the updated interrupted projections from d3-geo-polygon.
        if (clip) {
            clipOutline(svg, geoPath);
        }
    });
}
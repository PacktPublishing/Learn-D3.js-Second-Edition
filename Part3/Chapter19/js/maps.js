/**
 * This file contains functions that render a basic map with graticule and outline
 * and imports a projection switcher from projection-switcher.js.
 * Affected selectors after geoPath updates are:
 *     .feature path, .graticule, .outline, .background, .merged and .mesh
 * Adjust or override styles in maps.css.
 * Version 1.2
 */

import * as d3_all from "https://cdn.skypack.dev/d3@7";
import * as d3_geo_projection from "https://cdn.skypack.dev/d3-geo-projection@4";
const d3 = Object.assign({}, d3_all, d3_geo_projection);
import * as topojson from 'https://cdn.skypack.dev/topojson-client@3';
import {createProjectionSwitcher} from "./projection-switcher.js";

export {d3, topojson, createProjectionSwitcher};

// A container object for map-related data in TopoJSON format
// You can override the default values if necessary.
export const map = {
    dim: {width: 960, height: 500},     // default dimensions
    view: null,                         // the <g> or <svg> where the map and graticules are rendered - override in renderMap if necessary
    data: {},                           // {topology, geometries, features} object - populated by loadTopoJSON
    projection: d3.geoMercator(),       // the current projection
    geoPath: d3.geoPath(d3.geoMercator()), // the current geoPath (override in renderMap if necessary)
    optimize: false,                    // whether to use topojson.merge and topojson.mesh for rendering (faster but less flexible)
    onAfterDraw: null                   // optional callback(ctx, map) for app-specific overlays
};

// Loads a topoJSON file and stores in map.data
export async function loadTopoJSON(file, key) {
    const data = await d3.json(file);
    map.data.topology   = data.objects[key];
    map.data.geometries = map.data.topology.geometries;
    map.data.features   = topojson.feature(data, map.data.topology).features; // GeoJSON features
    if(map.optimize) {
        map.data.merged     = topojson.merge(data, map.data.geometries);
        map.data.mesh       = topojson.mesh(data, map.data.topology);
    }
}

// Renders the map.
export function renderMap(view = null, geoPath = null, dim = null) {
    dim = dim ? dim : map.dim;
    view = view ? view : map.view = d3.select("body").append("svg")
                                      .attr("width", dim.width).attr("height", dim.height);
    geoPath = geoPath ? geoPath : map.geoPath;

    drawBackground(view, geoPath);
    if(map.optimize) {
        drawMesh(view, geoPath);
    } else {
        drawFeatures(view, geoPath);
    }
    drawGraticule(view, geoPath);
}

// Update map after changes in geoPath or projection. Automatically updates the default selectors:
// .features, .graticule, .outline, .background, .merged and .mesh.
// Provide additional selectors if necessary as an array or space-separated string (e.g. ".feature path, .graticule")
// Provide duration for animated transitions (default: 0, no transition)
export function updateMap(selectors = null, duration = 0) {
    const apply = selection => duration > 0
        ? selection.transition().duration(duration)
        : selection;

    apply(map.view.selectAll(".graticule, .outline, .background")).attr("d", map.geoPath);

    if(map.optimize) {
        apply(map.view.selectAll(".merged")).attr("d", map.geoPath);
        apply(map.view.selectAll(".mesh")).attr("d", map.geoPath);
    } else {
        apply(map.view.selectAll("g.feature path")).attr("d", map.geoPath);
    }

    if(selectors) {
        if(typeof selectors === "string") {
            selectors = [selectors];
        }
        selectors.forEach(selector => {
            apply(map.view.selectAll(selector)).attr("d", map.geoPath);
        });
    }

    if(typeof map.onAfterDraw === "function") {
        map.onAfterDraw(map.view, map.geoPath);
    }
}

// Feature shapes are located by `g.feature path`
export function drawFeatures(view, geoPath) {
    const features = view.selectAll("g.feature")
        .data(map.data.features)
        .join("g")
        .attr("class", "feature");

    features.selectAll("path")
        .data(d => [d])
        .join("path")
        .attr("d", geoPath)
        .attr("fill", "gray");  // default (override with style in maps.css)
}

export function drawMesh(view, geoPath) {
    view.append("path").attr("class","merged")
        .datum(map.data.merged)
        .attr('d', geoPath)
        .attr("fill", 'gray');  // default (override with style in maps.css)
    view.append("path").attr("class","mesh")
        .datum(map.data.mesh)
        .attr('d', geoPath)
        .attr("fill", 'none')    // defaults (override with style in maps.css)
        .attr("stroke", 'white')
        .attr("stroke-width", .5);
}

// Graticules and outline
export function drawGraticule(view, geoPath, graticule = d3.geoGraticule()) {
    view.append("path").attr("class","graticule")
        .datum(graticule())
        .attr('d', geoPath)
        .attr("stroke-opacity", .25)
        .attr("fill", "none")  // defaults  (override with style in maps.css)
        .attr("stroke", "white");

    view.append("path").attr("class", "graticule major")
        .datum(d3.geoGraticule().stepMinor([0,0]).stepMajor([180,90]))
        .attr('d', geoPath)
        .attr("fill", 'none')
        .attr("stroke", "white")
        .attr('stroke-width', 2);

    view.append("path").attr("class","outline")
        .datum({type: "Sphere"})
        .attr('d', geoPath)
        .attr("fill", "none")      // defaults  (override with style in maps.css)
        .attr("stroke", "black");
}

// Outline and background
export function drawBackground(view, geoPath) {
    view.append("path").attr("class","background")
        .datum({type: "Sphere"})
        .attr('d', geoPath)
        .attr("fill", "darkgray");  // default (override with style in maps.css)
}

// Draws the viewport axes (the x and y axes of the projection) as red lines.
export function drawViewportAxes(map) {
    const [x,y] = map.geoPath.projection().translate();
    map.view.append("line").attr("class", "axes vertical")
        .attr("x1", x).attr("x2", x)
        .attr("y1", 0).attr("y2", map.dim.height);
    map.view.append("line").attr("class", "axes horizontal")
        .attr("x1", 0).attr("x2", map.dim.width)
        .attr("y1", y).attr("y2", y);
}
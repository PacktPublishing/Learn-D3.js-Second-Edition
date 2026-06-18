/**
 * This file contains functions that render a basic map with graticule and outline
 * using a Canvas 2D context, and imports a projection switcher from projection-switcher.js.
 * This is a Canvas-only version of maps.js.
 * Version 2.0
 */

import * as d3_all from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as d3_geo_projection from "https://cdn.skypack.dev/d3-geo-projection@4";
const d3 = Object.assign({}, d3_all, d3_geo_projection);
import * as topojson from "https://cdn.skypack.dev/topojson-client@3";
import {createProjectionSwitcher} from "./projection-switcher.js";

export {d3, topojson, createProjectionSwitcher};

// Cache static geometries reused across redraws.
const cachedGeometry = {
    sphere: {type: "Sphere"},
    graticuleMinor: d3.geoGraticule()(),
    graticuleMajor: d3.geoGraticule().stepMinor([0, 0]).stepMajor([180, 90])()
};

let pendingFrame = 0;

// A container object for map-related data in TopoJSON format
export const map = {
    dim: {width: 960, height: 480}, // default dimensions
    view: null,                     // the <canvas> selection where the map is rendered
    context: null,                  // CanvasRenderingContext2D
    data: {},                       // {topology, geometries, features} object
    geoPath: null,                  // the current geoPath (bound to canvas context)
    projection: null,               // the current d3 projection instance
    optimize: false,                // whether to use topojson.merge and topojson.mesh for rendering
    onAfterDraw: null               // optional callback(ctx, map) for app-specific overlays
};

// Loads a topoJSON file and stores in map.data
export async function loadTopoJSON(file, key) {
    const data = await d3.json(file);
    map.data.topology = data.objects[key];
    map.data.geometries = map.data.topology.geometries;
    map.data.features = topojson.feature(data, map.data.topology).features; // GeoJSON features
    if (map.optimize) {
        map.data.merged = topojson.merge(data, map.data.geometries);
        map.data.mesh = topojson.mesh(data, map.data.topology);
    }
}

// Resolves the canvas selection from the provided view parameter or creates a new canvas if view is null.
function resolveCanvasSelection(view, dim) {
    if (view) {
        return typeof view.node === "function" ? view : d3.select(view);
    }
    return d3.select("body")
        .append("canvas")
        .attr("width", dim.width)
        .attr("height", dim.height);
}

// Renders the map.
export function renderMap(view = null, geoPath = null, dim = null) {
    map.dim = dim || map.dim;
    map.view = resolveCanvasSelection(view, map.dim)
        .attr("width", map.dim.width)
        .attr("height", map.dim.height);

    map.context = map.view.node().getContext("2d");

    if (geoPath) {
        map.geoPath = geoPath.context(map.context);
    } else if (map.geoPath) {
        map.geoPath.context(map.context);
    } else {
        map.geoPath = d3.geoPath(map.projection, map.context);
    }

    // Keep initial render immediate so callers can safely draw overlays right after renderMap().
    performDraw();
}

// A general function to draw any GeoJSON geometry with a given style on the canvas.
function drawGeometry(geometry, style = {}) {
    const ctx = map.context;
    ctx.save();
    ctx.beginPath();
    map.geoPath(geometry);

    if (style.fill) {
        ctx.fillStyle = style.fill;
        ctx.fill();
    }

    if (style.stroke) {
        ctx.strokeStyle = style.stroke;
        ctx.lineWidth = style.lineWidth ?? 1;
        if (style.strokeOpacity != null) {
            ctx.globalAlpha = style.strokeOpacity;
        }
        ctx.stroke();
    }

    ctx.restore();
}

// Draw many geometries with one canvas state setup.
function drawGeometries(geometries, style = {}) {
    if (!geometries || geometries.length === 0) {
        return;
    }

    const ctx = map.context;
    ctx.save();

    if (style.fill) {
        ctx.fillStyle = style.fill;
    }
    if (style.stroke) {
        ctx.strokeStyle = style.stroke;
        ctx.lineWidth = style.lineWidth ?? 1;
    }

    for (const geometry of geometries) {
        ctx.beginPath();
        map.geoPath(geometry);

        if (style.fill) {
            ctx.fill();
        }

        if (style.stroke) {
            if (style.strokeOpacity != null) {
                ctx.globalAlpha = style.strokeOpacity;
            }
            ctx.stroke();
            if (style.strokeOpacity != null) {
                ctx.globalAlpha = 1;
            }
        }
    }

    ctx.restore();
}

function performDraw() {
    if (!map.context || !map.geoPath) {
        return;
    }

    map.context.clearRect(0, 0, map.dim.width, map.dim.height);

    drawBackground();
    if (map.optimize) {
        drawMesh();
    } else {
        drawFeatures();
    }
    drawGraticule();

    if (typeof map.onAfterDraw === "function") {
        map.onAfterDraw(map.context, map);
    }
}

// Update map after changes in geoPath or projection.
// Coalesced to one draw per animation frame for rapid input/animation updates.
export function updateMap() {
    if (pendingFrame) {
        return;
    }
    pendingFrame = requestAnimationFrame(() => {
        pendingFrame = 0;
        performDraw();
    });
}

// Feature shapes are drawn from map.data.features
export function drawFeatures() {
    drawGeometries(map.data.features || [], {fill: "gray"}); // default (override in app code if needed)
}

export function drawMesh() {
    if (map.data.merged) {
        drawGeometry(map.data.merged, {fill: "gray"});
    }

    if (map.data.mesh) {
        drawGeometry(map.data.mesh, {
            stroke: "white",
            lineWidth: 0.5
        });
    }
}

// Graticules and outline
export function drawGraticule(graticule = null) {
    drawGeometry(graticule ? graticule() : cachedGeometry.graticuleMinor, {
        stroke: "white",
        strokeOpacity: 0.25
    });
    drawGeometry(cachedGeometry.graticuleMajor, {
        stroke: "white",
        lineWidth: 2
    });
    drawGeometry(cachedGeometry.sphere, {stroke: "black"});
}

// Outline and background
export function drawBackground() {
    drawGeometry(cachedGeometry.sphere, {fill: "darkgray"});
}

// Draws the viewport axes (the x and y axes of the projection) as red lines.
export function drawViewportAxes(mapRef) {
    const [x, y] = mapRef.geoPath.projection().translate();
    const ctx = mapRef.context;

    ctx.save();
    ctx.strokeStyle = "red";
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, mapRef.dim.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(mapRef.dim.width, y);
    ctx.stroke();

    ctx.restore();
}
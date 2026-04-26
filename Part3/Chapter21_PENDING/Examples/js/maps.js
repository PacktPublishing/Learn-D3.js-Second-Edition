import * as d3_all from "https://cdn.skypack.dev/d3@7";
import * as d3_geo_projection from "https://cdn.skypack.dev/d3-geo-projection@4";
const d3 = Object.assign({}, d3_all, d3_geo_projection);
import * as topojson from 'https://cdn.skypack.dev/topojson-client@3';

export const map = {};

export async function loadShapeFile(file, key) {
    const topology = await d3.json(file);
    map.topology   = topology.objects[key];
    map.geometries = map.topology.geometries;
    map.features   = topojson.feature(topology, map.topology).features;
}

// Loads and renders the map in one step (use if no async processing is needed after loading the map data)
export function makeMap(file, key, dim, geoPath, svg = null) {
    loadShapeFile(file, key).then(() => {
        renderMap(dim, geoPath, svg);
    });
}

// Renders the map.
export function renderMap(dim, geoPath, svg = null) {
    if(!svg) {
        svg = d3.select("body").append("svg")
            .attr("width", dim.width).attr("height", dim.height);
    }
    drawGraticules(svg, geoPath);
    drawShapes(svg, geoPath);
}

export function updateMap(geoPath, svg) {
    svg.selectAll("g.country, .graticule, .outline, .background")
        .selectAll("path")
        .attr('d', geoPath);
    svg.selectAll(".graticule, .outline, .background")
        .attr('d', geoPath);
}

function drawShapes(svg, geoPath) {
    svg.selectAll("g.country")
        .data(map.features)
          .join("g")
            .attr("class","country")
            .append("path")
                .attr('d', geoPath);
}

function drawGraticules(svg, geoPath) {
    const graticule = d3.geoGraticule();
    svg.append("path").attr("class","background")
        .datum({type: "Sphere"})
        .attr('d', geoPath); // clip the path!;

    svg.append("path").attr("class","graticule")
        .datum(graticule())
        .attr('d', geoPath);

    svg.append("path").attr("class","outline")
        .datum({type: "Sphere"})
        .attr('d', geoPath);
}

export function createProjectionSwitcher(projections, containerID, callback) {
    const form = d3.select(`#${containerID}`)
        .append("form").attr("id", "projection");
    projections.forEach((p,i) => {
        const entry = form.append("label")
        entry.append("input")
            .attr("type", "radio")
            .attr("name", "projection")
            .attr("value", i)
            .property("checked", i === 0)
            .on("change", callback);
        entry.append("span")
            .html(p.name + '&nbsp;&nbsp;&nbsp;');
    })
}
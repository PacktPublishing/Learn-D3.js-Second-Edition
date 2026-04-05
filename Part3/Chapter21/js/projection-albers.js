/* Base code for projection examples */
import * as d3_all from "https://cdn.skypack.dev/d3@7";
import * as d3_geo_projection from "https://cdn.skypack.dev/d3-geo-projection@4";
import * as d3_geo_polygon from "https://cdn.skypack.dev/d3-geo-polygon@1";
import * as topojson from 'https://cdn.skypack.dev/topojson-client@3';
import * as tissot from '../js/tissot.js';
const d3 = Object.assign({}, d3_all, d3_geo_projection, d3_geo_polygon);

const map = {};

export function drawTissot(svg, geoPath, {radius, stepLon, stepLat, maxLon, maxLat}) {
    svg.selectAll("path.indicatrix")
        .data(tissot.makeIndicatrix(radius, stepLon, stepLat, maxLon, maxLat)).enter()
        .append("path").attr("class","indicatrix")
        .attr("d", geoPath)
        .attr("clip-path", "url(#clip)");
}

export function draw(svg, geoPath) {
    svg.selectAll("path.country")
        .data(map.features).enter()
        .append("path").attr("class","country")
        .attr("d", geoPath)
        .attr("clip-path", "url(#clip)");
}

export function drawParallels(svg, geoPath) {
    const projection = geoPath.projection();
    if(projection.parallel) {
        svg.append("path").attr("class","parallel-2")
            .datum(d3.geoCircle().center([0,90]).radius(- projection.parallel()- 90))
            .attr("d", geoPath)

        svg.append("path").attr("class","parallel-1")
            .datum(d3.geoCircle().center([0,90]).radius(projection.parallel() - 90 + 1))
            .attr("d", geoPath)

    } else if (projection.parallels) {
        svg.append("path").attr("class","parallel-2")
            .datum(d3.geoCircle().center([0,90]).radius(projection.parallels()[0] - 90))
            .attr("d", geoPath)

        svg.append("path").attr("class","parallel-1")
            .datum(d3.geoCircle().center([0,90]).radius(projection.parallels()[1] - 90 + 1))
            .attr("d", geoPath)

    }
}

export function drawGraticules(svg, geoPath) {
    svg.select("defs").append("clipPath").attr("id", "clip")
        .append("path")
        .datum({type: "Sphere"})
        .attr("d", geoPath);

    svg.append("path").attr("class","equator")
        .datum(d3.geoGraticule().stepMinor([0,0]).stepMajor([180,90]))
        .attr("d", geoPath)
        .attr("clip-path", "url(#clip)");

    svg.append("path").attr("class","graticule")
        .datum(d3.geoGraticule10())
        .attr("d", geoPath)
        .attr("clip-path", "url(#clip)");
}

export function drawOutline(svg, geoPath) {
    svg.append("path").attr("class","outline")
        .datum({type:"Sphere"})
        .attr("d", geoPath)
        .attr("clip-path", "url(#clip)");
}

export function showMap(data, index) {
    
    d3.selectAll("p").style("font-weight", "normal");
    d3.select("#p" + index).style("font-weight", "bold");

    d3.json('../Data/' + data.file).then(function(topology) {
        data.topology   = topology.objects[data.key];
        data.features   = topojson.feature(topology, data.topology).features;

        if(data.filter) {
            map.features = data.features.filter(data.filter);
        } else {
            map.features = data.features;
        }

        const svg = d3.select("#map");
        const geoPath = d3.geoPath().projection(data.projection);
        d3.selectAll("path, clipPath").remove();

        drawParallels(svg, geoPath);
        drawGraticules(svg, geoPath);
        draw(svg, geoPath);
        drawOutline(svg, geoPath);
        drawTissot(svg, geoPath, data.tissot);
    });
}
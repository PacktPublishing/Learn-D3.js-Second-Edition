import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export {addBlurFilter, drawShadow, drawBackgroundCircle, drawForegroundOutline, drawFeatures, drawGraticule, drawCircles};

//  A blur filter implementation in SVG
function addBlurFilter(view, id = 'blur', stdDeviation = 5) {
    const defs = view.append("defs");
    defs.append("filter").attr("id", id)
        .append("feGaussianBlur")
        .attr("in", "SourceGraphic")
        .attr("stdDeviation", stdDeviation);
}

function drawShadow(view, geoPath) {
    view.append("path").attr("class","west shadow")
        .datum(d3.geoCircle().center([-90,-23.5]))  // Southern hemisphere shadow (summer in the northern hemisphere)
        .attr("d", geoPath)
        .attr("filter", "url(#blur)");  // Apply the blur filter to the shadow
}

function drawBackgroundCircle(view, geoPath) {
    view.append("path").attr("class","background")
        .datum({type: "Sphere"})
        .attr('d', geoPath);
}

function drawForegroundOutline(view, geoPath) {
    view.append("path").attr("class","outline")
        .datum({type: "Sphere"})
        .attr('d', geoPath);
}

function drawFeatures(view, geoPath, geojson) {
    view.selectAll("path.country")
        .data(geojson)
        .join("path").attr("class","country")
        .attr("d", geoPath);
}

function drawGraticule(view, geoPath) {
    view.append("path").attr("class","graticule")
        .datum(d3.geoGraticule10())
        .attr("d", geoPath);
}

function drawCircles(view, geoPath) {
    // drawing parallels (hemispheres) using d3.geoCircle()
    view.append("path").attr("class","capricorn tropic circle")
        .datum(d3.geoCircle().center([0,90]).radius(66.5))
        .attr("d", geoPath);

    view.append("path").attr("class","cancer tropic circle")
        .datum(d3.geoCircle().center([0,-90]).radius(66.5))
        .attr("d", geoPath);

    view.append("path").attr("class","antarctic polar circle")
        .datum(d3.geoCircle().center([0,-90]).radius(23.5))
        .attr("d", geoPath);

    view.append("path").attr("class","arctic polar circle")
        .datum(d3.geoCircle().center([0,90]).radius(23.5))
        .attr("d", geoPath);

    view.append("path").attr("class","northern hemisphere")
        .datum(d3.geoCircle().center([0,90]))
        .attr('d', geoPath);

    view.append("path").attr("class","western hemisphere")
        .datum(d3.geoCircle().center([-90,0]))
        .attr('d', geoPath);
}
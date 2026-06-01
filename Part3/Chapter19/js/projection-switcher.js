// A simple projection switcher to compare different projections.
// Callback to update the map is required.

import * as d3_all from "https://cdn.skypack.dev/d3@7";
import * as d3_geo_projection from "https://cdn.skypack.dev/d3-geo-projection@4";
const d3 = Object.assign({}, d3_all, d3_geo_projection);

// A basic list of projections for testing
export const projectionList = [
    {name: "Mercator", config: d3.geoMercator()},
    {name: "Orthographic", config: d3.geoOrthographic().rotate([20, -30, 0])},
    {name: "Stereographic", config: d3.geoStereographic()},
    {name: "Natural Earth", config: d3.geoNaturalEarth1()},
    {name: "Plate Carrée", config: d3.geoEquirectangular()},
    {name: "Equal Area", config: d3.geoCylindricalEqualArea()},
    {name: "Gnomonic", config: d3.geoGnomonic()},
    {name: "Azimuthal Equidistant", config: d3.geoAzimuthalEquidistant().rotate([30, -80, -20]).center([0, 0]).scale(300)}
];

// Creates a radio-button control panel to toggle projections in a #switcher HTML container.
// Overridable defaults use projectionList, Mercator (index = 0)
export function createProjectionSwitcher(callback, projections = projectionList, index = 0) {
    let container = d3.select("#switcher");
    if (container.empty()) {
        container = d3.select("body").append("div").attr("id", "switcher");
    }

    container.html("");
    const form = container.append("form").attr("id", "projection");

    projections.forEach((p, i) => {
        const entry = form.append("label");
        entry.append("input")
            .attr("type", "radio")
            .attr("name", "projection")
            .attr("value", i)
            .property("checked", i === index)
            .on("change", evt => callback(evt, projections));
        entry.append("span")
            .html(p.name + "&nbsp;&nbsp;&nbsp;");
    });
}
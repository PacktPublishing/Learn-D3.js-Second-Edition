// A simple projection switcher to compare different projections.
// Callback to update the map is required.

import * as d3 from "https://cdn.skypack.dev/d3@7";

// A basic list of projections for testing
export const projectionList = [
    {name: "Mercator", config: d3.geoMercator()},
    {name: "Orthographic", config: d3.geoOrthographic().rotate([20, -30, 0])},
    {name: "Stereographic", config: d3.geoStereographic()},
    {name: "Natural Earth", config: d3.geoNaturalEarth1()}
];

// Creates a radio-button control panel to toggle projections in a #switcher HTML container
// Callback is required.
// Overridable defaults use projectionList, Mercator (index = 0) and places before first <svg> element.
export function createProjectionSwitcher(callback, index = 0, projections = projectionList, svgSelector = "svg") {
    const form = d3.select("body")
                   .insert("div", svgSelector).attr("id", "switcher")
                      .append("form").attr("id", "projection");
    projections.forEach((p,i) => {
        const entry = form.append("label")
        entry.append("input")
            .attr("type", "radio")
            .attr("name", "projection")
            .attr("value", i)
            .property("checked", i === index)
            .on("change", (evt => callback(evt, projections)));
        entry.append("span")
            .html(p.name + '&nbsp;&nbsp;&nbsp;');
    })
}
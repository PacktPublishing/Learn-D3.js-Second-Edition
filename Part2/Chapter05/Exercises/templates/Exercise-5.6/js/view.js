import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import {app, dim} from "./common.js";
import {hideTooltip, showTooltip} from "./tooltips.js";

// VIEW RENDERING

/**
 * Draws the current view. Calls drawPlanet() and drawMoons() to draw the planet and moons.
 * Called after a view change, after configure().
 * @param plane
 */
export function draw(plane) {
    // 1) Draw a guideline showing the orbital plane (for reference or debugging)
    /*
    plane.append("line")
         .attr("x1", 0)
         .attr("x2", dim.width)
         .style("stroke", "red");
    */

    // 2) draw the planet
    drawPlanet(plane);

    // 3) draw the moons
    drawMoons(plane);

    d3.selectAll("g.moon, .planet")
        .on("mouseover", showTooltip)
        .on("mouseout", hideTooltip);
}

/**
 * Draw the planet. Scale the diameter, position it's center offscreen to the left and fill with current color
 * @param plane The orbital plane (vertical center of the chart)
 */
function drawPlanet(plane) {
    plane.select(".planet")
         .datum(app.current.planet)
             .attr("r", d => app.scale(d.diameterKm)/2)
             .attr("cx", d => -(dim.margin.left + app.scale(d.diameterKm)/2))
             .style("fill", app.current.color);
}

/**
 * Draw the moons. Create new circles and text for the enter selection, and update existing circles and text when updating.
 * Calls createMoons() for the enter selection and updateMoon() for the update selection.
 * @param plane The orbital plane (vertical center of the chart)
 */
function drawMoons(plane) {
    plane.selectAll("g.moon")
         .data(app.current.moons)
             .join(enter => createMoons(enter))
             .attr("transform", d => `translate(${[d.cx,0]})`)
             .each(function() {
                 updateObjects(d3.select(this));
             });
}

/**
 * Create new circles and text for the enter selection
 * @param enter
 * @returns {*}
 */
function createMoons(enter) {

    return enter.append("g")
                .attr("class", "moon")
                .each(function() {
                    const moon = d3.select(this);
                    moon.append("circle");
                    // EXERCISE 6.6: Append an <image> element for all moons
                    moon.append("text");
                });
}

/**
 * Update existing circles and text for the update selection
 * @param moon Current <g> for the moon, containing a <circle> and <text> elements
 */
function updateObjects(moon) {
    // Update the radius of the circle using the moon's diameter
    moon.select("circle") // EXERCISE 6.6: If there is an image, draw circle with radius zero (modify attr("r")).
        .attr("r", d => app.scale(d.diameterKm) / 2)
        .style("fill", "lightgray")
        .style("stroke", "gray");

    // EXERCISE 6.6: Update the image of the moon, placing it above each circle
    // 1) Select the image element
    // 2) Set the x and y attributes to minus 1/2 the scaled diameter
    // 3) Set the height and width attributes to the scaled diameter
    // 4) Set the href attribute to the image's URL (get it from the data object - it was added in data-1.1.js)

    // Update the label of the moon, placing it above each circle
    moon.select("text")
        .text(d => d.name)
        .attr("transform", d => {
            const x = app.scale(d.diameterKm/2) + dim.margin.moon;
            return `rotate(-90) translate(${[x,0]})`;
        })
        .style("alignment-baseline", "middle");

}
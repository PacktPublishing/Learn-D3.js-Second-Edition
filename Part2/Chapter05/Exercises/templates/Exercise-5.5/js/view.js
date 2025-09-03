import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

import {app, dim} from "./common.js";

// EXERCISE 6.5: Import the showTooltip and hideTooltip functions from tooltips-1.0.js



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

    // EXERCISE 6.5: Add event handlers for mouseover and mouseout to show and hide the tooltip

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
                    moon.append("text");
                });
}

/**
 * Update existing circles and text for the update selection
 * @param moon Current <g> for the moon, containing a <circle> and <text> elements
 */
function updateObjects(moon) {
    // Update the radius of the circle using the moon's diameter
    moon.select("circle")
        .attr("r", d => app.scale(d.diameterKm) / 2);

    // Update the label of the moon, placing it above each circle
    moon.select("text")
        .text(d => d.name)
        .attr("transform", d => {
            const x = app.scale(d.diameterKm/2) + dim.margin.moon;
            return `rotate(-90) translate(${[x,0]})`;
        })
        .style("alignment-baseline", "middle");

}
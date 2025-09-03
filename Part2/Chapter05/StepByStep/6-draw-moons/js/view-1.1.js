import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

import {app, dim} from "./common.js";

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
}

/**
 * Draw the planet. Scale the diameter, position it's center offscreen to the left and fill with current color
 * @param plane The orbital plane (vertical center of the chart)
 */
function drawPlanet(plane) {
    plane.append("circle")
         .attr("class", "planet")
         .datum(app.current.planet)
             .attr("r", d => app.scale(d.diameterKm)/2)
             .attr("cx", d => -(dim.margin.left + app.scale(d.diameterKm)/2))
             .style("fill", app.current.color);
}

/**
 * Draw the moons on the orbital plane using the computed horizontal positions for each moon (see config-1.5.js).
 * @param plane
 */
function drawMoons(plane) {
    plane.selectAll("circle.moon")
         .data(app.current.moons)
            .join("circle")
               .attr("class", "moon")
               .attr("cx", d => d.cx)
               .attr("r", d => app.scale(d.diameterKm)/2);
}
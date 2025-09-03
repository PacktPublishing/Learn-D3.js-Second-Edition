import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

import {dim, app} from "./common.js";
import {configure} from "./config.js";
import {draw} from "./view.js";

// VIEW INITIALIZATION (called once after loading the data)

/**
 * Initializes the view with a control panel (form with buttons) and the planet circle
 * @param plane
 */
export function init(plane) {

    // 1) Configure the form
    d3.select("form")
      .selectAll("button")
        .data(app.planets)
          .join("button")
            .attr("type", "button") // disables default submission event
            .attr("id", d => d.id)
            .text(d => d.name)
            .on("click", function(event, d) { // important change from v5 to v7!!
                app.current.id = d.id;
                configure();
                draw(plane);
            });

    // 2) Add circle for the planet
    plane.append("circle")
         .attr("class", "planet");

    // EXERCISE 6.7 - Configure a single scale for all views

    // 1) Get the diameter of the largest moon to use as a reference
    const maxDiameter = d3.max(d3.merge(app.planets.map(p => p.satellites)), s => s.diameterKm);

    // 2) Configure the scales with a domain that will fit all moons in all views (e.g. [0, maxDiameter*2.5])
    app.scale.range([0, dim.height - dim.margin.top*2])
             .domain([0, maxDiameter*2.2]);

    // 3) Remove the previous code that configured the scale for each view (in config-1.5.js)

}
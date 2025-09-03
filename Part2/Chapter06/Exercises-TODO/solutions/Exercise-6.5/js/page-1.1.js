import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

import {app} from "./common.js";
import {configure} from "./config-1.4.1.js";
import {draw} from "./view-1.5.js";

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

}
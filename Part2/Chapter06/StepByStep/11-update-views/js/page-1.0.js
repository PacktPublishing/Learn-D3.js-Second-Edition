import * as d3 from 'https://cdn.skypack.dev/d3@7.9.0';

import {app} from "./common-1.0.js";
import {configure} from "./config-1.5.js";
import {draw} from "./view-1.4.js";

// VIEW INITIALIZATION (called once after loading the data)
/**
 * Initializes the view with a control panel (form with buttons) and the planet circle
 * @param plane
 */
export function init(plane) {

    // Add the buttons
    const buttons = d3.select("form")
      .selectAll("button")
        .data(app.planets)
          .join("button")
            .attr("type", "button") // disables default submission event
            .attr("id", d => d.id)
            .text(d => d.name);

    // Add event listener to the buttons
    buttons.on("click", function(event, d) { // event listener
        app.current.id = d.id;
        configure();
        draw(plane);
    });

    // Render the initial view
    configure();
    draw(plane);
}
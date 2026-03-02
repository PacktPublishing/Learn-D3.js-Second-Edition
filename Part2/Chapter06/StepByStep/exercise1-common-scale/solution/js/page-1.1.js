import * as d3 from 'https://cdn.skypack.dev/d3@7.9.0';

import {dim, app} from "./common-1.1.js";
import {configure} from "./config-1.6.js";
import {draw} from "./view-1.6.js";

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

    // EXERCISE 1 - ADD A CONTROL TO TOGGLE COMMON SCALE
    // 1) Add a button or checkbox so the viewer can toggle to use or not a common scale.
    const scaleToggle = d3.select("form")
                            .append("button").attr("type", "button")
                              .text("Use common scale")
                              .attr("id", "scale-type")
                              .style("float", "right");

    // 2) Add the event handler to toggle the scale mode, changing the state of the global
    // variable used to keep track of the state (and update the control's status or text, if necessary).
    // Then call configure() and draw() to update the view.
    scaleToggle.on("click", function() {
        app.useCommonScale = !app.useCommonScale;
        d3.select("#scale-type")
            .text(app.useCommonScale ? "Use scale per planet" : "Use common scale");
        configure();
        draw(plane);
    });

    // Render the initial view
    configure();
    draw(plane);
}
import * as d3 from "https://cdn.skypack.dev/d3@7.9.0";

// import the app and dim objects
import {app, dim} from "./common-1.1.js";

// VIEW CONFIGURATION (called after each view change)

/**
 * Configure the current view before rendering it. Uses dimensions (dim object), and configures
 * the global app object, which contains parameters for the current view and current scale.
 */
export function configure() {
    // 1) populate app.current.planet with data from app.planets filtered by app.current.id
    setPlanet();

    // 2) Populate app.current.moons with satellites to display for the current planet
    setMoons();

    // 3) Configure the scales for this view
    configScale();

    // 4) Change page title
    updatePageView();

    // 5) Sort the moons by their diameter (step 6)
    sortMoons();

    // 6) Compute cx center coordinates to position each moon (step 5)
    computeCenterCoordinates();
}

function setPlanet() {
    app.current.planet = app.planets.filter(p => p.id === app.current.id)[0];
}

function setMoons() {
    app.current.moons = app.current.planet.satellites;
}

function configScale() {
    // EXERCISE 1 - CONFIGURE THE SCALE TO BE COMMON OR PLANET-SPECIFIC
    // This function should run different code depending on the value of
    // the global variable that indicates whether we want a common scale or not.
    //
    // 1) If using a common scale, find the largest moon in the entire dataset
    //    and use it to configure the scale's domain. Use a max value that will
    //    fit all moons in all views (e.g. maxDiameter*2.5)
    // 2) Else, if using a planet-specific scale, use the existing code that
    //    configures the scale to fit the moons of the current planet summing the
    //    diameters and calculating the available space
    // ADD YOUR CODE HERE

    // a) add diameters (they will be drawn side by side)
    const sumDiameters = d3.sum(app.current.moons,d => d.diameterKm);

    // b) calculate space occupied by the circles
    const horizSpace = dim.width - (dim.margin.planet + dim.margin.left*2
                                  + app.current.moons.length * dim.margin.moon);
    const vertSpace  = dim.height - dim.margin.top*2;

    // c) configure the scale
    app.scale.range([0, d3.min([vertSpace, horizSpace])])
        .domain([0, sumDiameters]);
}

function updatePageView() {
    // 1) Update page title
    d3.select('#planetName').text( () => app.current.planet.name );

    // 2) Update the current color for the planet
    app.current.color  = app.colors[(+app.current.id.substring(1) - 3)];

    // 3) Disable button for currently displayed planet
    d3.selectAll("button").property("disabled", false);
    d3.select("button#"+app.current.id).property("disabled", true);

    // This improves the title - see <span> tags in <h1>
    if (app.current.moons.length === 1) { // Earth
        d3.select('#titleNumber').text("moon");
    } else if (app.current.moons.length === 2) { // Mars
        d3.select('#titleNumber').text("moons");
    } else { // Others
        d3.select('#titleNumber').text("largest moons");
    }
}

function computeCenterCoordinates() {
    // Compute cx center coordinates to position each moon
    app.current.moons.forEach(function(moon, i) {
        let space = 0;
        if(i > 0) {
            let previous = app.current.moons[i-1]
            space = previous.cx
                + app.scale(previous.diameterKm)/2
                + dim.margin.moon;
        }
        moon.cx = space + app.scale(moon.diameterKm)/2;
    });
}

function sortMoons() {
    // Sort the moons by their diameter
    app.current.moons.sort((a,b) => d3.descending(a.diameterKm, b.diameterKm));
}
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// import the app and dim objects
import {app, dim} from "./common.js";

// VIEW CONFIGURATION (called after each view change)

/**
 * Configure the current view before rendering it. Uses dimensions (dim object), and configures
 * the global app object, which contains parameters for the current view and current scale.
 */
export function configure() {
    // 1) populate app.current.planet with data from app.planets filtered by app.current.id
    setPlanet();

    // 2) Populate app.current.moons with moons of the current planet
    setMoons();

    // 3) Configure the scales for this view
    configScale();

    // 4) Change page title
    updatePageView();

    // 5) Compute cx center coordinates to position each moon
    computeCenterCoordinates();
}

function setPlanet() {
    app.current.planet = app.planets.filter(p => p.id === app.current.id)[0];
}

function setMoons() {
    // a) obtain the diameter of the largest moon
    const maxDiameter = d3.max(app.current.planet.satellites, d => d.diameterKm);

    // b) include only moons with 1/50 of the size of the largest moon or larger
    app.current.moons = app.current.planet.satellites
                                          .filter(s => s.diameterKm > maxDiameter/50);
}

function configScale() {
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
    d3.select('#planetName').text( () => app.current.planet.name )
}

function computeCenterCoordinates() {
    // 5) Compute cx center coordinates to position each moon
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
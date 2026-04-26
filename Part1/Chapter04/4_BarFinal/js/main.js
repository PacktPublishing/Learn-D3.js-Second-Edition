import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

import {app} from "./constants.js";
import {drawChart, renderControls} from "./render.js";

// Load and render
const url = "../data/sol_2019.json";

const data = await d3.json(url);

makeDataset(data, 'planets'); // populates the dataset array with selected data

drawChart();     // draws the initial chart
renderControls();  // draws the chart selector panel

/**
 * This function extracts selected planetary data from a section in the sol_2019.json file
 * @param section May be 'planets', 'asteroids', 'tnos', 'centaurs' or 'comets'
 */
function makeDataset(data, section) {
    data[section].forEach((object, i) => {
        app.data.push({
            name: object.name,
            avg: +object.semiMajorAxisAU,
            min: +object.periheliumAU,
            max: +object.apheliumAU,
            color: app.color(i)
        });
    });
}
import * as d3 from "https://cdn.skypack.dev/d3@7.9.0";

import {app} from "./common.js";

// LOADING AND PARSING DATA

// DATA LOADING
// check if the files are  really accessible from this location
// and adjust it to your local settings if necessary

const dataFolder = "../../../data";
const dataFile = dataFolder + "/sol_2019.json";

/**
 * Load the data from the file and store it in the app object
 * @param {string} file - The file to load
 * @returns {*} - A promise with the loaded data
 */
export async function load() {
    const data = await d3.json(dataFile);
    app.planets = data.planets
        .filter(p => +p.id.substring(1) >= 3 && +p.id.substring(1) <= 8)
        .map(p => ({  id: p.id,
                      name: p.name,
                      diameterKm: p.diameterKm,
// EXERCISE 3 - Filter the satellites to keep only those that have 1/25 of
// the diameter of the largest satellite or larger.
                      satellites: p.satellites
                                   .filter(s => s.diameterKm >= d3.max(p.satellites, s => s.diameterKm) / 25)
                                   .map(s => ({ name: s.name, diameterKm: s.diameterKm }))
                    }));
}
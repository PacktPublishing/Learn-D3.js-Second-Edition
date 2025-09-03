import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

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
                          satellites: p.satellites.map(s => ({ name: s.name, diameterKm: s.diameterKm }))
                      }));

    // EXERCISE 6.6: Load the image files for the moons
    // 1) Create an empty array for the promises (to load image files)
    // 2) Loop through the planets and moons, call d3.image() for each moon image file,
    //    copy its URL (from the image's src property) saving it as an 'image' property in the moon`s data object,
    //    then push the promise to the array (ignoring any errors about missing files)
    // 3) Return Promise.all() with the promises array
    // Hint: use the imageFile(planet, moon) function (in this file) to get the URL for the image

}

/**
 * Returns the local URL for an image file for a moon
 * @param planet
 * @param moon
 * @returns {string}
 */
function imageFile(planet, moon) {
    return `${dataFolder}/images/${moon.name}.png`;
}
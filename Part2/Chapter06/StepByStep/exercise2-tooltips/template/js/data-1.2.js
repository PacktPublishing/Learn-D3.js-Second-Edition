import * as d3 from "https://cdn.skypack.dev/d3@7";

import {app} from "./common-1.1.js";

// LOADING AND PARSING DATA

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
    const data = await d3.json(dataFile)

    app.planets = data.planets
        .filter(p => +p.id.substring(1) >= 3 && +p.id.substring(1) <= 8)
        .map(p => ({  id: p.id,
            name: p.name,
            diameterKm: p.diameterKm,
            satellites: p.satellites
                .filter(s => s.diameterKm >= d3.max(p.satellites, s => s.diameterKm) / 25)
                .map(s => ({ name: s.name, diameterKm: s.diameterKm }))
        }));

    // Pre-load images
    const promises = app.planets.flatMap(planet =>
        planet.satellites.map(moon =>
            d3.image(imageFile(planet, moon))
                .then(img => {
                    moon.image = img.src;
                })
                .catch(() => {
                    // Ignore missing files (errors still show up in the console, in some browsers, but the app is not blocked)
                })
        )
    );
    return Promise.all(promises);
}

/**
 * Returns the local URL for an image file for a moon
 * @param planet
 * @param moon
 * @returns {string}
 */
function imageFile(planet, moon) {
    return `${dataFolder}/images/${planet.name}/${moon.name}.png`;
}
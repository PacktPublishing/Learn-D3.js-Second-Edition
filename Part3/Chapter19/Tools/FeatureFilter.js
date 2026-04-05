// Filters selected properties (id, name, population, continent) to create a smaller JSON file.
// Run this script with Node.js to generate the world_lowres.json file.

import * as fs from "fs";

const SRC_DIR = "../StepByStep/Step02/data";  // uses the file stored in the Step02 folder
const DST_DIR = SRC_DIR;

const dataFile = SRC_DIR + "/ne_110m_admin_0_countries.json";
const outputFile = DST_DIR + "/world-lowres.geojson";

const data = JSON.parse(fs.readFileSync(dataFile, "utf-8"));

// Some converters change the case of property keys, so we normalize them to uppercase for consistency.
function normalizePropertyKeys(props) {
    if (!props || typeof props !== "object") return props;
    const normalized = {};
    for (const [key, value] of Object.entries(props)) {
        normalized[key.toUpperCase()] = value;
    }
    return normalized;
}

data.features.forEach(feature => feature.properties = normalizePropertyKeys(feature.properties));

data.features = data.features.map(feature => {
    feature.id = feature.properties.ADM0_A3;
    feature.properties = {
        continent: feature.properties.CONTINENT,
        name: feature.properties.NAME,
        pop: feature.properties.POP_EST
    };
    return feature;
});

fs.writeFileSync(outputFile, JSON.stringify(data, null, 2), "utf-8");
console.log(`Filtered data saved to ${outputFile}`);
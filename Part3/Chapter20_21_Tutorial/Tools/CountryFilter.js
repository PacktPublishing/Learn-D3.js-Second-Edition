// Contains only African countries

import * as fs from "fs";

const SRC_DIR = "../data";  // uses the file stored in the data folder for this chapter
const DST_DIR = SRC_DIR;

const dataFile = SRC_DIR + "/world-lowres.geojson";
const outputFile = DST_DIR + "/africa.json";

const data = JSON.parse(fs.readFileSync(dataFile, "utf-8"));

data.features = data.features.filter(feature => feature.properties.continent === "Africa")
    .sort((a, b) => a.properties.name.localeCompare(b.properties.name));

fs.writeFileSync(outputFile, JSON.stringify(data, null, 2), "utf-8");
console.log(`Filtered data saved to ${outputFile}`);
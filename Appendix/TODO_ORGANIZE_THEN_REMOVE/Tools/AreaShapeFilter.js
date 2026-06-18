// Contains only countries that have ANY point in the area defined by
// latitude -30 to +40, longitude -20 to +50.

import * as fs from "fs";

const dataFile = "../data/world/world-lowres.geojson";
const outputFile = "../StepByStep/Step11/data/africa-80-80.geojson";

const data = JSON.parse(fs.readFileSync(dataFile, "utf-8"));

data.features = data.features.filter(feature => {
    const coordinates = feature.geometry.coordinates;
    if (feature.geometry.type === "Polygon") {
        return coordinates.some(ring => ring.some(([lon, lat]) => lat >= -30 && lat <= 40 && lon >= -20 && lon <= 50));
    } else if (feature.geometry.type === "MultiPolygon") {
        return coordinates.some(polygon => polygon.some(ring => ring.some(([lon, lat]) => lat >= -30 && lat <= 40 && lon >= -20 && lon <= 50)));
    }
    return false; // ignore other geometry types - there shouldn't be any in this file.
}).sort((a, b) => a.properties.name.localeCompare(b.properties.name));

fs.writeFileSync(outputFile, JSON.stringify(data, null, 2), "utf-8");
console.log(`Filtered data saved to ${outputFile}`);
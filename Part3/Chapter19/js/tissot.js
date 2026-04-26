/* Tissots indicatrix */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function makeIndicatrix(radius = 2, stepLon = 10, stepLat = 10, maxLon = 180, maxLat = 80) {
    const circles = [];
    const circleGen = d3.geoCircle().radius(radius).precision(1);
    for (let lon = -maxLon; lon < maxLon; lon += stepLon) {
        for (let lat = -maxLat; lat <= maxLat; lat += stepLat) {
            circles.push(circleGen.center([lon, lat])());
        }
    }
    return circles;
}


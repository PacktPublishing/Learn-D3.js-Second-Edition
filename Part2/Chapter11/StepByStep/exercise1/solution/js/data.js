import * as d3 from "https://cdn.skypack.dev/d3@7.9.0";
import {data, app} from "./common.js";

// Global temperatures 1880 to 2025 (Source: https://data.giss.nasa.gov/gistemp/)
const file = "../../data/GLB.Ts.1880.2025.csv";

// Load, parse and prepare the data
export async function load() {
    // Helper to create ISO date strings from year and abbreviated month string (e.g. "Jan")
    const isoDateString = (year, month) => `${year}-${d3.timeFormat("%m")(d3.timeParse("%b")(month))}-27`;

    // Load and parse the CSV
    const csv = await d3.csv(file, d3.autoType);

    // Convert to tidy date/temp dataset
    const months = csv.columns.slice(1);
    data.entries = csv.flatMap(d => months.map( month => ({date: isoDateString(d.Year, month), temp: d[month]}) ))
                                          .filter(d => d.temp !== null); // remove null months
}

export function config() {
    app.scale.date.domain(d3.extent(data.entries, d => d3.isoParse(d.date)));
    app.scale.temp.domain(d3.extent(data.entries, d => d.temp));

    app.line = d3.line()
                 .x(d => app.scale.date(d3.isoParse(d.date)))
                 .y(d => app.scale.temp(d.temp))
                 .curve(d3.curveCatmullRom);
}
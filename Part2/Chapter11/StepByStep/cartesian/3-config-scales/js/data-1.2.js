import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import {app, data} from "./common-1.1.js";

// Global temperatures 1880 to 2025 (Source: https://data.giss.nasa.gov/gistemp/)
const file = "../../data/GLB.Ts.1880.2025.csv";

// Load, parse and prepare the data
export async function load() {
    const csv = await d3.csv(file, d3.autoType);
    
    data.months = csv.columns.splice(1);

    // Convert data to a standard format
    // [[year, [['Jan', t1], ['Feb, t2], ..., ['Dec',t12]]], ...]
    data.years = csv.map(obj => [obj.Year, data.months.map(d => [d, obj[d]])]);
}

export function config() {
    // Scale domains
    app.scale.month.domain([data.months]);

    const series = data.years.map( d => d[1].map(v => v[1]) );
    app.scale.temp.domain(d3.extent(series.flat()));

    const mean   = series.map(d => d3.mean(d));
    app.color = d3.scaleSequential(d3.interpolateTurbo)
        .domain(d3.extent(mean));
}
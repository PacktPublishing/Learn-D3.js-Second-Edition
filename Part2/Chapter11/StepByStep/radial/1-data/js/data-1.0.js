import * as d3 from "https://cdn.skypack.dev/d3@7";
import {data} from "./common-1.0.js";

// Global temperatures 1880 to 2025 (Source: https://data.giss.nasa.gov/gistemp/)
const file = "../../data/GLB.Ts.1880.2025.csv";

// Load, parse and prepare the data
export async function load() {
    const csv = await d3.csv(file, d3.autoType);
    
    data.months = csv.columns.splice(1);

    // Convert data to a standard format
    // [[year, [['Jan', t1], ['Feb, t2], ..., ['Dec',t12]]], ...]
    data.years = csv.map(obj => [obj.Year, data.months.map(d => [d, obj[d]])]);

    // Add 13th month for continuity
    data.years.forEach( (d,i) =>
        d[1].push(data.years[i+1]         // if there is a next line
            ? data.years[i+1][1][0]   // push first value of next line
            : d[1][d[1].length-1])    // otherwise repeat last value of current
    );

}
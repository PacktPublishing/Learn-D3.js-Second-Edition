import * as d3 from 'https://cdn.skypack.dev/d3@7.9.0';
import {data} from "./common.js";

export async function load(file) {
    // Parse the file, pre-process each row to include only the data we need (2018)
    const csv = await d3.csv(file, row => {
        delete row.Year;
        Object.entries(row).forEach(d => {
            row[d[0]] = +d[1];
        });
        return row;
    });
    // Prepare data - reduce it to a single object with the totals for each flag
    const all = csv.columns
                    .filter(d => d !== 'Year')
                    .map(k => ({flag: k, value: d3.sum(csv, d => d[k])}));

    // Remove values too small to display (less than 1% of the max value)
    data.flags = all.filter(d => d.value > d3.max(all, d => d.value) * 0.01);
}
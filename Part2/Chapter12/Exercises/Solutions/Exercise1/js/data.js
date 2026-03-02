import * as d3 from 'https://cdn.skypack.dev/d3@7.9.0';
import {app, data} from "./common.js";

export async function load(file) {
    // Parse the file, pre-process each row to include only the data we need (2018)
    const csv = await d3.csv(file, row => ({country: row['Country'], gdp: +row['2018']}));
    data.countries = prepare(csv, app.limit); // save list of limit countries + sum of the rest
}

/**
 * Returns a selection, based on app.limit.
 * @param data
 * @param limit
 * @returns {*}
 */
function prepare(data, limit) {
    // Get first limit countries
    const selection = data.sort((a,b) => d3.descending(a.gdp, b.gdp))
                          .slice(0, limit);
    // Create a new value for the rest of the world
    const rest = data.filter(d => !selection.includes(d));
    selection.push({country: 'Rest of the world', gdp: d3.sum(rest, d => d.gdp)});
    return selection;
}
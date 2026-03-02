import * as d3 from "https://cdn.skypack.dev/d3@7.9.0";
import {app, data} from "./common-1.1.js";

// The data from this CSV was obtained from the World Bank open data website
// (https://data.worldbank.org) - adjust the path as needed to point to the file location in your setup
const file = "../../data/gdp-world-bank-2022.csv";

export async function load() {
    // Parse the file, pre-process each row to include only the data we need (2018)
    const csv = await d3.csv(file, row => ({country: row['Country'], gdp: +row['2018']}));
    data.countries = prepare(csv); // save list of limit countries + sum of the rest
}

/**
 * Returns a selection, based on app.limit.
 * @param data
 * @param limit
 * @returns {*}
 */
function prepare(data) {
    // Get first limit countries
    const selection = data.sort((a,b) => d3.descending(a.gdp, b.gdp))
                          .slice(0, app.limit);
    // Create a new value for the rest of the world
    const rest = data.filter(d => !selection.includes(d));
    selection.push({country: 'Rest of the world', gdp: d3.sum(rest, d => d.gdp)});
    return selection;
}
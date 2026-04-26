import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import {app, data} from "./common-1.0.js";

const file = "../../data/slave-trade-data.csv";

export async function load() {
    const rawData = await d3.csv(file, row => {
        row.Decade = +row.Decade.split("-")[0] - 1;  // Parse decade as a number
        Object.entries(row).forEach(([k,v]) => {
            if (k !== "Decade") row[k] = +v;
        });
        return row;
    });

    makeStack(rawData);
    config(rawData);
}

function makeStack(rawData) {
    // The keys (series) are the flags and the rows are the decades. The data will be stacked by flag.
    data.keys = rawData.columns.filter(d => d !== "Decade");

    // The stack generator
    const stack = d3.stack()
        .keys(data.keys)
        .order(d3.stackOrderAppearance)  // Try also inside-out
        .offset(d3.stackOffsetNone);     // Try also expand, silhouette or wiggle

    // The stack generator returns an array of arrays, each representing a stack of values
    // Each array also has a data property, containing the object
    data.stacked = stack(rawData);
}

function config(rawData) {

    const decades = rawData.map(d => d.Decade);
    const toDate = d3.timeParse('%Y'); // converts a year string to a JavaScript date

    // Since x-axis is time scale, decades need to be converted to dates.
    app.scale.x.domain([toDate(d3.min(decades)), toDate(d3.max(decades))]);
    app.scale.y.domain([0, d3.max(data.stacked.flat(2))]);

    // The area function. The x-value can get the decade via d.data[0] or d.data.Decade
    app.area = d3.area()
        .x(d => app.scale.x(toDate(d.data.Decade)))
        .y0(d => app.scale.y(d[0]))
        .y1(d => app.scale.y(d[1]))
        .defined(d => !isNaN(d[1]))
        .curve(d3.curveBasis);

    // The color scale is mapped to the flags
    app.color = d3.scaleOrdinal(d3.schemeCategory10.reverse())
        .domain(data.keys);
}

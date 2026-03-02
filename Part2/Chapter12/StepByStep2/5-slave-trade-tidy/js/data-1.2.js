import * as d3 from "https://cdn.skypack.dev/d3@7.9.0";
import {app, data} from "./common-1.0.js";

const file = "../../data/slave-trade-data.csv";

const endsIn = 1870; // last year of the dataset

export async function load() {
    const rows = await d3.csv(file, row => {
        const rowArray = [];
        const decade = +row.Decade.split('-')[0] - 1; // get first year of decade
        Object.entries(row).forEach(d => {
            if (d[0] !== 'Decade') {
                rowArray.push({Decade: decade, Flag: d[0], Value: +d[1]});

                // Add one more entry for the last year of the last decade (zero for all)
                if (decade === (endsIn - 10)) {
                    rowArray.push({Decade: endsIn, Flag: d[0], Value: 0});
                }
            }
        });
        return rowArray;
    });

    // This creates a tidy representation of the data
    const tidyData = rows.flat().sort((a,b) => d3.ascending(a.Decade, b.Decade));

    // Inspect the tidy data
    console.log(tidyData);

    makeStack(tidyData);
    config(tidyData);
}

function makeStack(rawData) {
    // Keys are the flags (this is a Set)
    data.keys = d3.union(rawData.map(d => d.Flag));

    // Provide data as a map of maps. Values in each decade will be stacked,
    // and each layer will represent a flag
    const dataMap = d3.index(rawData, d => d.Decade, d => d.Flag);
    console.log("dataMap", dataMap)

    // The stack generator
    // With tidy data, it has a complex value() function
    const stack = d3.stack()
                    .keys(data.keys)
                    .value(([decadeMap,flagMap], key) => flagMap.get(key).Value)
                    .order(d3.stackOrderAppearance)  // Try also inside-out
                    .offset(d3.stackOffsetNone);     // Try also expand, silhouette or wiggle

    // The stack generator returns an array of arrays, each representing a stack of values
    // Each array also has a data property, containing the object
    data.stacked = stack(dataMap);
}

function config(rawData) {
    const decades = d3.union(rawData.map(d => d.Decade));
    const toDate = d3.timeParse('%Y'); // converts a year string to a JavaScript date

    // Since x-axis is time scale, decades need to be converted to dates.
    app.scale.x.domain([toDate(d3.min(decades)), toDate(d3.max(decades))]);
    app.scale.y.domain([0, d3.max(data.stacked.flat(2))]);

    // The area function. Use d.data[0] to get the Decade.
    app.area = d3.area()
        .x(d => app.scale.x(toDate(d.data[0])))
        .y0(d => app.scale.y(d[0]))
        .y1(d => app.scale.y(d[1]))
        .defined(d => !isNaN(d[1]))
        .curve(d3.curveBasis);

    // The color scale is mapped to the flags
    app.color = d3.scaleOrdinal(d3.schemeCategory10.reverse())
        .domain(data.keys);
}

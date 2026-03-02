import * as d3 from "https://cdn.skypack.dev/d3@7.9.0";
import {app, chart} from "./common-1.6.js";

export {load, prepare};

async function load(file) {
    const rawData = await d3.csv(file, d3.autoType);
    prepare(rawData);
}

/**
 * Will places keys in chart.keys, and data in chart.data.
 */
function prepare(rawData) {

    // 1) Get a set of unique names that will be used as keys.
    chart.keys = new Set(rawData.map(d => d.country));

    // 2) Create a nested map of values per date and then name, convert to array and sort by date
    const byYearMap = d3.rollup(rawData, v => v[0].value,
                                         d => d.year,
                                            d => d.country);
    const byYearArray = [...byYearMap].sort((a,b) => d3.ascending(a[0],b[0]));

    // 3) Set the data for the chart.
    chart.data = interpolateDataFrames(byYearArray, app.numFrames);

    // 4) Create maps used by updates to decide how to move bars
    createNavigationMaps();

    // 5) Store a map to retrieve the icon for each country by name
    chart.icons = new Map(rawData.map(d => [d.country, d.code]));

    // 6) Store a map to retrieve the continent for each country
    chart.continents = new Map(rawData.map(d => [d.country, d.continent]));
    app.color.domain(d3.union(chart.continents.values()));
}

function createNavigationMaps() {
    // 1) Array containing objects grouped by country used to configure the chart.nxt and chart.prv maps.
    const allObjects = chart.data.flatMap(([, data]) => data);
    const byCountry = d3.groups(allObjects, d => d.country);

    // 2) Map that gets the next object, given the current one
    const nextMap = new Map(byCountry.flatMap(([_, data]) => d3.pairs(data)));
    chart.nxt = d => nextMap.get(d) || d;

    // 3) Map that gets the previous object, given the current one
    const prevMap = new Map(byCountry.flatMap(([_, data]) => d3.pairs(data).map(([a, b]) => [b, a])));
    chart.prv = d => prevMap.get(d) || d;
}

function interpolateDataFrames(data, numFrames) {
    const dataFrames = [];
    for (let pair of d3.pairs(data)) {

        const [entry1, entry2] = pair;
        const [year1, dataMap1] = entry1;
        const [year2, dataMap2] = entry2;

        for (let i = 0; i < numFrames; ++i) {
            const t = i / numFrames;

            const interpolatedYear = year1 * (1 - t)
                                   + year2 * t;
            const valueInterpolator = country => dataMap1.get(country) * (1 - t)
                                               + dataMap2.get(country) * t;

            const interpolatedData = rank(valueInterpolator);
            dataFrames.push([interpolatedYear, interpolatedData]);
        }
    }
    return dataFrames;
}

/**
 * Called for each year. It sorts the data and sets a rank property to each
 * bar based on its value. First numBars will have a rank from 0 to numBars-1.
 * Other bars will have a rank of numBars.
 */
function rank(valueInterpolator) {
    const data = [...chart.keys].map(k => ({country: k, value: valueInterpolator(k)}))
                                .sort((a, b) => d3.descending(a.value, b.value));
    for (let i = 0; i < data.length; ++i) {
        data[i].rank = Math.min(app.numBars, i);
    }
    return data;
}
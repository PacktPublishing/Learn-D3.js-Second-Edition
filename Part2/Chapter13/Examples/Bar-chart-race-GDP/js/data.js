import * as d3 from "https://cdn.skypack.dev/d3@7.9.0";
import {app, chart} from "./common.js";

export {load, verify, prepare};

// The raw data will be stored here
const data = {};

async function load(file) {
    data.countries = await d3.csv(file, row => {
        return {
            name: row.country,
            date: +row.year,
            value: +row.value,
            category: row.continent, // optional - in this example we use it to color the bars
            icon: row.code // optional - in this example we use it to show flags for each bar
        };
    });
}

/**
 * Checks if the data is in the correct format: {name, date, value}
 * If data contains the icon property, it checks if the icon directory is set.
 * Sets flags for using icons and categories if the data contains the icon and category properties.
 * @param data
 * @returns {*[]}
 */
function verify() {
    const configErrors = [];
    if(data.countries[0].category) {
        app.useCategory = true;
    }
    if(data.countries[0].icon) {
        app.useIcon = true;
        if (app.img.directory === null) {
            configErrors.push("Data contains icons but the icon directory is not set.");
        }
    }
    if (!(data.countries[0].name && data.countries[0].date && data.countries[0].value)) {
        configErrors.push("Invalid data structure: missing name, date or value properties.");
    }
    return configErrors;
}

/**
 * Prepares the data for the chart which can be accessed from the chartData object.
 * @param data
 * @returns {boolean}
 */
function prepare() {

    // 1) Get a set of unique names that will be used as keys.
    chart.keys = new Set(data.countries.map(d => d.name));

    // 2) If there are categories, create a map to get them (we will use them for the colors)
    if (app.useCategory) {
        chart.cats = new Map(data.countries.map(d => [d.name, d.category]));
        app.colorScale.domain(Array.from(chart.cats.values()));
    }

    // 3) If there are icons, create a map to get them (we will use them to add an image for each bar)
    if (app.useIcon) {
        chart.icons = new Map(data.countries.map(d => [d.name, d.icon]));
    }

    // 4) Create a nested map of values per date and then name, convert to array and sort by date
    const byDate = d3.rollup(data.countries, v => v[0].value,
                                             d => d.date,
                                                d => d.name);

    const byDateArray = Array.from(byDate)
                             .sort((a, b) => d3.ascending(a[0], b[0]));

    // 5) Set the data for the chart. This will interpolate the data between years for a smoother transition.
    chart.data = interpolateDataFrames(byDateArray, app.transition.numFrames); // data now contains numFrames more frames per year

    createNavigationMaps();

    return true;
}

/**
 * Creates the navigation maps that will be used to navigate between data frames.
 */
function createNavigationMaps() {
    // 1) Map with all the keys and their intermediate values and ranks. This is used to
    //    configure the chart.nxt and chart.prv maps.
    const dataMap = d3.groups(chart.data.flatMap(([, data]) => data), d => d.name);

    // 2) Map that gets the next object, given the current one
    const nextMap = new Map(dataMap.flatMap(([_, data]) => d3.pairs(data)));
    chart.nxt = d => nextMap.get(d) || d; // function that gets next data frame

    // 3) Map that gets the previous object, given the current one
    const prevMap = new Map(dataMap.flatMap(([_, data]) => d3.pairs(data).map(([a, b]) => [b, a])));
    chart.prv = d => prevMap.get(d) || d;
}

/**
 * Used in prepare. Interpolates the data between years adding extra frames
 * to create a smoother transition.
 * @param data
 * @param numFrames
 * @returns {*[]}
 */
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
            const valueInterpolator = name => dataMap1.get(name) * (1 - t)
                                            + dataMap2.get(name) * t;

            const interpolatedData = rank(valueInterpolator);
            dataFrames.push([interpolatedYear, interpolatedData]);
        }
    }
    return dataFrames;
}

/**
 * Used in prepare().
 * Utility function that adds a rank property to each object with its position in the year.
 * Bars that are not in the top numBars are given a rank of numBars. Used in prepareData()
 * This version is slightly different because it is using the interpolated data frame
 */

function rank(valueInterpolator) {
    const data =
        [...chart.keys].map(k => ({name: k, value: valueInterpolator(k)}))
                       .sort((a, b) => d3.descending(a.value, b.value));
    for (let i = 0; i < data.length; ++i) {
        data[i].rank = Math.min(app.numBars, i);
    }
    return data;
}
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import {app, chart} from "./common.js";

export {load, verify, prepare};

app.replaceBillions = false;
app.formatSpecifier = ".2f";
app.img.directory = '../../data/icons/';

// ====== A) Get the data ======
// The data should be in a tidy format and have an identifier (name), a step (date), and a value.
// Steps are usually dates or years, but could be events, samples, etc. They should be numbers.
// Names could be IDs, countries, cities, candidates, etc.

// Your data might also have
// - Type, which could be categories, parties, continents, etc.
// - Other data, such as an icon or file path, link, other info, etc.

// Data might be in other formats, but it should be converted to a tidy format.
// Typical open data CSVs usually are provided in tabular format.
// Let's assume we have a CSV like this:
const csv = [
    ["Name", "Type", "Other", 2001, 2002, 2003, 2004, 2005, 2006],
    // ------------------------------------------
    ["Bat", "mammal", "bat", 100, 122, 144, 147, 158, 166],
    ["Alligator", "reptile", "alligator", 82, 94, 111, 134, 153, 170],
    ["Pelican", "bird", "pelican", 71, 97, 125, 144, 168, 155],
    ["Mammoth", "mammal", "mammoth", 61, 80, 99, 131, 123, 119],
    ["Chicken", "bird", "chicken", 59, 96, 133, 136, 139, 145],
    ["Butterfly", "insect", "butterfly", 35, 60, 96, 118, 133, 152],
    ["Cat", "mammal", "cat", 35, 61, 99, 122, 140, 160],
    ["Beetle", "insect", "beetle", 48, 89, 130, 156, 172, 187],
    ["Cockroach", "insect", "cockroach", 55, 65, 97, 110, 120, 125],
    ["Vulture", "bird", "vulture", 49, 83, 90, 99, 122, 146],
    ["Piranha", "fish", "piranha", 63, 61, 110, 135, 156, 168],
    ["Shark", "fish", "shark", 41, 55, 78, 100, 123, 149],
    ["Turtle", "reptile", "turtle", 80, 92, 111, 127, 136, 147],
];

// The important properties are Name, the steps (which here are years) and the values for each step.
// The other properties (Type and Other) are optional, but we will use all of them in this example.

// Convert it to a tidy format and rename the columns
const header = csv[0];
const csvData = csv.slice(1);
const tidyData = csvData.flatMap(([n,ct,ic, ...values]) =>
    values.map((v, i) =>
        ({
            name: n,
            date: header[i+3],
            category: ct,
            icon: ic,
            value: v
        })
    )
);
console.log(tidyData); // tidy data (check!)



const data = tidyData;

async function load() {
    return data;
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
    if(data[0].category) {
        app.useCategory = true;
    }
    if(data[0].icon) {
        app.useIcon = true;
        if (app.img.directory === null) {
            configErrors.push("Data contains icons but the icon directory is not set.");
        }
    }
    if (!(data[0].name && data[0].date && data[0].value)) {
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
    chart.keys = new Set(data.map(d => d.name));

    // 2) If there are categories, create a map to get them (we will use them for the colors)
    if (app.useCategory) {
        chart.cats = new Map(data.map(d => [d.name, d.category]));
        app.colorScale.domain(Array.from(chart.cats.values()));
    }

    // 3) If there are icons, create a map to get them (we will use them to add an image for each bar)
    if (app.useIcon) {
        chart.icons = new Map(data.map(d => [d.name, d.icon]));
    }

    // 4) Create a nested map of values per date and then name, convert to array and sort by date
    const byDate = d3.rollup(data, v => v[0].value,
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
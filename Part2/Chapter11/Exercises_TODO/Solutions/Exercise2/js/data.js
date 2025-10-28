import * as d3 from "https://cdn.skypack.dev/d3@7";
import {app, data} from "./common.js";

export async function load(file) {
    // Parsing this data with d3.csv will generate an array of objects. E.g.: [{...}, {...}, ...]
    // Each object *will* have a 'Country' property and a series of properties for each year
    // Each object *may* also have a 'Code' property with the flag's ISO code
    // E.g.: {Country: "Argentina", Code: "ARG", 1989: 1234, 1990: 2345, ...}
    const csv = await d3.csv(file, d3.autoType);

    // This is the default format for the CSV parser:
    // [{Country: "Argentina", 1989: 1234, 1990: 2345, ...}, ...]
    // There is also a columns property with the headers
    console.log("CSV data", csv);  // Check the data in the console

    // Prepare the data
    // This will generate an array of objects, where the data property contains the chart data
    // in default format, e.g.: [{Country: "Argentina", data: [[1989, 1234], [1990, 2345], ...]}, ...]
    data.countries = csv.map(obj =>
        ({country: obj['Country'], data: Object.entries(obj)
                .filter(d => d[0] !== 'Country' && d[0] !== 'Code')})
    );
    console.log("Prepared data", data.countries);  // Check the data in the console

    // This will return an array will all the years in the dataset
    // e.g. [1989, 1990, 1991, ...]
    data.years = csv.columns.filter(d => (d !== 'Country' && d !== 'Code'))
        .map(d => +d);
    console.log("Years", data.years);  // Check the data in the console

    config();
}

function config() {

    // Scales and colors
    app.scale.x.domain([d3.isoParse(`${d3.min(data.years)}-1-1`), d3.isoParse(`${d3.max(data.years)}-1-1`)]);
    app.scale.y.domain([0, d3.max(data.countries, d => d3.max(d.data, v => v[1]))]);
    app.color.domain(data.countries.map(d => d.country));

    // 1) Create the line function.
    // Create the variable for the x(d => value) component using a scaled d3.isoParse(`${d[0]}-1-1`) value.
    // Create the variable for the y(d => value) component using a scaled d[1] value.
    // Use a curve and ignore values that are not numbers
    app.line = d3.line()
                 .x(d => app.scale.x(d3.isoParse(`${d[0]}-1-1`)))  // isoParse creates a date from ISO date string (YYYY-MM-DD)
                 .y(d => app.scale.y(d[1]))
                 .curve(d3.curveCardinal.tension(.7))
                 .defined(d => !isNaN(d[1]));                 // Skip (interpolate) NaN values

}
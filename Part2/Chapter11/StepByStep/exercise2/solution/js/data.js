import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import {data, app} from "./common.js";

// Global temperatures 1880 to 2025 (Source: https://data.giss.nasa.gov/gistemp/)
const file = "../../data/GLB.Ts.1880.2025.csv";

// Load, parse and prepare the data
export async function load() {
    const csv = await d3.csv(file, d3.autoType);

    const months = csv.columns.splice(1);
    const years = csv.map(obj => [obj.Year, months.map(d => [d, obj[d]])]);

    data.medians = years.map(d => [d[0], d3.median(d[1], v => v[1])]);
    data.max = years.map(d => [d[0], d3.max(d[1], v => v[1])]);
    data.min = years.map(d => [d[0], d3.min(d[1], v => v[1])]);

    data.extents = years.map((d,i) => [d[0], data.min[i][1], data.max[i][1]]);
}

// Configure scales and line/area generators
export function config() {
    app.scale.year.domain([d3.isoParse(`${data.medians[0][0]}-01-01`),
                           d3.isoParse(`${data.medians[data.medians.length-1][0]}-12-31`)]);

    app.scale.temp.domain([d3.min(data.extents, d => d[1]), d3.max(data.extents, d => d[2])]);

    app.medianLine = d3.line()
                       .x(d => app.scale.year(d3.isoParse(`${d[0]}-06-27`))) // uses middle of year
                       .y(d => app.scale.temp(d[1]))
                       .defined(d => d && !isNaN(d[1]))
                       .curve(d3.curveBasis);

    app.area = d3.area()
                 .x(d => app.scale.year(d3.isoParse(`${d[0]}-06-27`)))
                 .y0(d => app.scale.temp(d[1]))
                 .y1(d => app.scale.temp(d[2]))
                 .curve(d3.curveBasis);

    app.baseline = app.area.lineY0();
    app.topline  = app.area.lineY1();
}
// Common data for tree examples from sample CSV data

import * as d3 from "https://cdn.skypack.dev/d3@7";

// CSV file
const file = "../data/venue.csv";

// Dimensions
export const dim = {width: 800, height: 600, margin: 60};
export const cht = {w: dim.width - 2 * dim.margin, h: dim.height - 2 * dim.margin};

// SVG container
export const chart = d3.select("body").append("svg").attr("height", dim.height).attr("width", dim.width)
                       .append("g").attr("transform", `translate(${[dim.margin,dim.margin]})`);

// Data
const tabular = await d3.csv(file, d3.autoType);
export const root = d3.stratify().id(d => d.name).parentId(d => d.location)(tabular);
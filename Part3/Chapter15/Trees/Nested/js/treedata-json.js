// Common data for tree examples from sample JSON data

import * as d3 from "https://cdn.skypack.dev/d3@7";

// JSON file
const file = "../data/sample-hierarchy.json";

// Dimensions
export const dim = {width: 1000, height: 600, margin: 60};
export const cht = {w: dim.width - 2 * dim.margin, h: dim.height - 2 * dim.margin};

// SVG container
export const chart = d3.select("body").append("svg").attr("height", dim.height).attr("width", dim.width)
                       .append("g").attr("transform", `translate(${[dim.margin,dim.margin]})`);

// Data
const hierarchy = await d3.json(file);
export const root = d3.hierarchy(hierarchy);
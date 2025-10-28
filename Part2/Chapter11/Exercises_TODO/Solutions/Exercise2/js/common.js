import * as d3 from "https://cdn.skypack.dev/d3@7";

export {dim, app, data};

const data = {};

const dim = {
    width: 800, height: 500,
    margin: {left: 75, right: 100, top: 20, bottom: 60}
};

const app = {
    scale: {
        x: d3.scaleTime().range([dim.margin.left, dim.width - dim.margin.right]),
        y: d3.scaleLinear().range([dim.height - dim.margin.bottom, dim.margin.top])
    },
    color: d3.scaleOrdinal(['#444', 'gold'].concat(d3.schemeCategory10)), // add +2 colors to the scheme
    line: null // Line function to be defined in data-1.4.js
}
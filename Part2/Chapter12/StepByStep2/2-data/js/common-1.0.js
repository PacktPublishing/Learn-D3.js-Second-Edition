import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export {dim, app, data};

const dim = {
    height: 400, width: 800,
    margin: {top: 10, left: 75, bottom: 60, right: 150}
};

const data = {};

const app = {
    scale: {
        x: d3.scaleTime().range([dim.margin.left, dim.width - dim.margin.right]),
        y: d3.scaleLinear().range([dim.height - dim.margin.bottom, dim.margin.top])
    }
};
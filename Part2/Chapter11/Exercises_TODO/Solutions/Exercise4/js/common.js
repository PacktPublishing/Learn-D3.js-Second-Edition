import * as d3 from "https://cdn.skypack.dev/d3@7";

export {dim, app, data};

const dim = {
    width: 800, height: 400,
    margin: {top: 0, left: 50, bottom: 50, right: 150}
};
const app = {
    area: null,
    line: {top: null, base: null, avg: null},
    color: null,
    scale: {
        x: d3.scalePoint().range([dim.margin.left, dim.width - dim.margin.right]),
        y: d3.scaleLinear().range([dim.height - dim.margin.bottom, dim.margin.top])
    }
}
const data = {};
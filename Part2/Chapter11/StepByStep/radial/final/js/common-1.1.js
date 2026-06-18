import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export {data, dim, app};

const data = {};
const dim = {
    width: 600, height: 600, margin: 30
};
const app = {
    scale: {
        angle: d3.scaleLinear().range([0, 2*Math.PI]),
        radius: d3.scaleLinear().range([0, dim.width/2 - dim.margin])
    }
};

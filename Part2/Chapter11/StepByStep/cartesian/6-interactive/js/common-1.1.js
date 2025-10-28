import * as d3 from "https://cdn.skypack.dev/d3@7";

export {data, dim, app};

const data = {};
const dim = {
    width: 800, height: 500,
    margin: {left: 75, right: 50, top: 50}
};
const app = {
    scale: {
        month: d3.scalePoint().range([dim.margin.left, dim.width - dim.margin.right]),
        temp: d3.scaleLinear().range([dim.height - dim.margin.top, dim.margin.top])
    }
};


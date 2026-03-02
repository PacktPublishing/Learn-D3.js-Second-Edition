import * as d3 from "https://cdn.skypack.dev/d3@7.9.0";

export {data, app, dim};

const data = {};

const dim = {
    width: 800, height: 500,
    margin: {x: 75, y: 50}
};
const app = {
    scale: {
        year: d3.scaleTime().range([dim.margin.x, dim.width - dim.margin.x]),
        temp: d3.scaleLinear().range([dim.height - dim.margin.y, dim.margin.y])
    }
}
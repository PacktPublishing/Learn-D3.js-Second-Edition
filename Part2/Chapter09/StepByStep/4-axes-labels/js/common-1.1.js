import * as d3 from 'https://cdn.skypack.dev/d3@7';

export {dim, app};

const dim = {
    w: 500, h: 300,
    margin: {h: 40, w: 50}
};

const app = {
    data: {},
    scale: {
        x: d3.scaleLinear()
            .range([dim.margin.w, dim.w - dim.margin.w]),
        y: d3.scaleLinear()
            .range([dim.h - dim.margin.h, dim.margin.h]),
    }
}

app.axis = {
    x: d3.axisBottom(app.scale.x),
    y: d3.axisLeft(app.scale.y)
}
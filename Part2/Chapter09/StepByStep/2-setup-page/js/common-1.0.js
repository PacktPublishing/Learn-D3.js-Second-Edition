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

// Test cases (you can use your browser console)
// dim.w                // should return 500
// dim.margin.h         // should return 40
// app.data.countries   // should contain all the data
// app.scale.x(0)       // should return 50
// app.scale.y(0)       // should return 260
// app.scale.x(1)       // should return 450
// app.scale.y(1)       // should return 40
import * as d3 from 'https://cdn.skypack.dev/d3@7';

export {dim, app};

const dim = {
    w: 500, h: 300,
    margin: {h: 40, w: 50},
    legend: {w: 20, h: 10}
};

const app = {
    data: {},
    color: d3.scaleOrdinal(d3.schemeDark2),
    scale: {
        x: d3.scaleLinear()
            .range([dim.margin.w, dim.w - dim.margin.w]),
        y: d3.scaleLog()
            .range([dim.h - dim.margin.h, dim.margin.h]),
        r: d3.scaleSqrt()
            .range([1,15])
    },
    format: {
        gdp: d3.format("$,.0f"),
        pop: d3.format(",.3s")
    }
}

app.axis = {
    x: d3.axisBottom(app.scale.x)
        .tickSize(dim.h - dim.margin.h * 2 + 10)
        .tickPadding(2),
    y: d3.axisLeft(app.scale.y)
        .tickSize(dim.w - dim.margin.h * 2 + 10)
        .tickPadding(2)
        .ticks(8, ',')
}
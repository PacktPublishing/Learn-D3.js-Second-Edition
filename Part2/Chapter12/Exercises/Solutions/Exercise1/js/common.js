import * as d3 from 'https://cdn.skypack.dev/d3@7.9.0';

export {dim, app, data};

const dim = {width: 800, height: 500, margin: 100};
const data = {};
const app = {
    limit: 10,
    pie: d3.pie()
        .value(d => d.gdp)
        .sort((a,b) => d3.ascending(a.country, b.country))
        .sortValues(d3.descending) // this has precedence over sort
        .startAngle(-Math.PI/2)
        .endAngle(Math.PI/2),
    arc: d3.arc()               // Configuration for all slices
        .innerRadius(50)
        .outerRadius(dim.width/2 - dim.margin)
        .padAngle(.5)
        .padRadius(10)
}

// A simple color scale, for 10 or 20 different coutries + 1 - last color is gray (rest of the world)
app.color= d3.scaleOrdinal(d3.schemeTableau10.concat("#777"));
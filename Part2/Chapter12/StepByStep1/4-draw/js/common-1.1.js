import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export {dim, app, data};

const dim = {width: 750, height: 750, margin: 100};
const data = {};
const app = {
    limit: 20,                  // If there are more than 20 countries, colors will repeat
    pie: d3.pie()               // Configuration for the pie chart, starting and ending at +90 degrees
        .value(d => d.gdp)
        .startAngle(Math.PI / 2)
        .endAngle(Math.PI * 2.5),
    arc: d3.arc()               // Configuration for all slices
        .innerRadius(5)
        .outerRadius(dim.width/2 - dim.margin)
        .padAngle(.2)
        .padRadius(10)
}

// A simple color scale, for 10 or 20 different coutries + 1 - last color is gray (rest of the world)
app.color= d3.scaleOrdinal(app.limit <= 10 ?
                           d3.schemeTableau10.concat("#777") :
                           d3.schemeTableau10.concat(d3.schemeObservable10).concat("#777"));
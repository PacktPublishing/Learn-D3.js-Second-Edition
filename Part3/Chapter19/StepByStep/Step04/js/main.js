import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const dataFile = "../../data/world/world-lowres.geojson";   // using file from this chapter's data folder.
const data = await d3.json(dataFile);

const dim = {width: 960, height: 500} ;         // standard width and height for most maps
const svg = d3.select("body").append("svg")
              .attr("width", dim.width).attr("height", dim.height);

// Setting up a geoPath with the Mercator projection (using default configuration)
const geoPath = d3.geoPath();
// const projection = d3.geoOrthographic();
const projection = d3.geoMercator();

// Test the projection
const mexico_city = [-99.1332, 19.4326]; // longitude, latitude
const position = projection(mexico_city);
console.log(position); // [x, y] coordinates of Mexico City in the projected space - returns [  473.644,  229.769]

// Configuring geoPath with the Mercator projection.
geoPath.projection(projection);

// Draw the shapes
svg.selectAll("path.country") // CSS styles defined above
   .data(data.features)
      .join("path").attr("class","country")
        .attr("d", geoPath);

// Drawing a dot with the location of Mexico City, using the projected coordinates.
// This must come after the shapes, otherwise the circle will be hidden behind them
svg.append("circle")
    .attr("cx", position[0])
    .attr("cy", position[1])
    .attr("r", 5)
    .attr("fill", "red");
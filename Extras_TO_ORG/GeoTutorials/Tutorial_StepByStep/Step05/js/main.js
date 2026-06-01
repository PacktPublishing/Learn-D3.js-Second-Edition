import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const dataFile = "../../data/world/world-lowres.geojson";   // using file from this chapter's data folder.
const data = await d3.json(dataFile);

const dim = {width: 960, height: 500} ;         // standard width and height for most maps
const svg = d3.select("body").append("svg")
              .attr("width", dim.width).attr("height", dim.height);

// This is another way to set up a geoPath: same as d3.geoPath().projection(d3.geoMercator())
const geoPath = d3.geoPath(d3.geoMercator());

// Determine the extent of the population values in the data, to set up the color scale domain.
const extent = d3.extent(data.features, d => d.properties.pop);

// Using an exponential scale since population differences span several orders of magnitude.
// This allows for a better visual differentiation between populations, although it does distort the data.
const color = d3.scaleSequentialPow(d3.interpolateRdYlBu).exponent(.2)
                .domain(extent.reverse());

svg.selectAll("path.country") // CSS styles defined above
   .data(data.features)
      .join("path").attr("class","country")
        .attr("d", geoPath)
        .style("fill", d => color(d.properties.pop));
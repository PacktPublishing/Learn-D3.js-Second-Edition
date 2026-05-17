import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const dataFile = "data/world-lowres.geojson";   // Using file from a local data folder
const data = await d3.json(dataFile);

const dim = {width: 960, height: 500} ;         // standard width and height for most maps
const svg = d3.select("body").append("svg")
              .attr("width", dim.width).attr("height", dim.height);

// Creating a default geoPath (will use d3.geoIdentity() projection by default - one pixel = one degree)
const geoPath = d3.geoPath();

svg.selectAll("path.country") // CSS styles defined above
   .data(data.features)
      .join("path").attr("class","country")
        .attr("d", geoPath);


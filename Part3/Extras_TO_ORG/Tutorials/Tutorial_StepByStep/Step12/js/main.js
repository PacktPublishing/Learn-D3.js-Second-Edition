import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as topojson from 'https://cdn.skypack.dev/topojson-client@3';  // import topojson-client

const dim = {width: 960, height: 500};                 // standard width and height for most maps
const shapesFile = "data/world-lowres.topojson";       // using file from the local data folder.
const TOPOJSON_KEY  = "world";                         // inspect the file to view the objects key

const svg = d3.select("body").append("svg")
              .attr("width", dim.width).attr("height", dim.height);

const data = await d3.json(shapesFile);

const geoPath = d3.geoPath();
const projection = d3.geoMercator();
geoPath.projection(projection);

// TopoJSON
const map = {};
map.topology   = data.objects[TOPOJSON_KEY];                     // the topology is stored in data.objects.KEY
map.features   = topojson.feature(data, map.topology).features;  // extract the GeoJSON features array

svg.selectAll("path.country") // CSS styles defined above
   .data(map.features)
      .join("path").attr("class","country")
        .attr("d", geoPath);

svg.append("path").attr("class","graticule")
    .datum(d3.geoGraticule10())
    .attr("d", geoPath);

const equator = d3.geoGraticule().step([0,90]);
svg.append("path").attr("class","equator")
    .datum(equator)
    .attr("d", geoPath);
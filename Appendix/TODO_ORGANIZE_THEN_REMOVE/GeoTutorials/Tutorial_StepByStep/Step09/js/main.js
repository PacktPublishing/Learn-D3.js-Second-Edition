import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const dim = {width: 960, height: 500};                        // standard width and height for most maps
const shapesFile = "../../data/world/world-lowres.geojson";   // using file from this chapter's data folder.
const citiesFile = "../../data/world/cities1000.csv";         // using file from this chapter's data folder.

const svg = d3.select("body").append("svg")
              .attr("width", dim.width).attr("height", dim.height);

const [data, cities] = await Promise.all([
    d3.json(shapesFile),
    d3.csv(citiesFile, function(row) {
        return {
            name: row.asciiname,
            position: [+row.longitude, +row.latitude],
            pop: +row.population
        }
    })
]);

const geoPath = d3.geoPath();
const projection = d3.geoMercator();
geoPath.projection(projection);

const extent = d3.extent(cities, d => d.pop);
const areaScale = d3.scaleSqrt().domain(extent).range([0,5])

svg.selectAll("path.country") // CSS styles defined above
   .data(data.features)
      .join("path").attr("class","country")
        .attr("d", geoPath);

svg.selectAll("circle.city")
    .data(cities)
        .join("circle").attr("class","city")
        .attr("cx", d => projection(d.position)[0])
        .attr("cy", d => projection(d.position)[1])
        .attr("r", d => areaScale(d.pop));

svg.append("path").attr("class","graticule")
    .datum(d3.geoGraticule10())
    .attr("d", geoPath);

const equator = d3.geoGraticule().step([0,90]);
svg.append("path").attr("class","equator")
    .datum(equator)
    .attr("d", geoPath);
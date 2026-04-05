import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const shapesFile = "../../data/world/world-lowres.geojson";   // using file from this chapter's data folder.
const themesFile = "../../data/world/un_regions.csv";         // using file from this chapter's data folder.

const [data, themes] = await Promise.all([
    d3.json(shapesFile),
    d3.csv(themesFile, function(row) {
        return {
            area: +row.Area_km2,
            hdi: +row.HDI_2017,
            code: row.Code
        }
    })
]);

// Inspect the loaded data
console.log(data);   // Shape data
console.log(themes); // Thematic data

// Add HDI, area and density to the properties array, matching by the country code
data.features.forEach(function(d) {
    const entry = themes.filter(t => t.code === d.id)[0];
    if(entry) {
        d.properties.hdi = entry.hdi > 0 ? entry.hdi : undefined;   // "no data" is marked as -99 in the source file
        d.properties.area = entry.area;
        d.properties.density = d.properties.pop / entry.area;
    }
});


// Rendering the SVG - this is unchanged
const dim = {width: 960, height: 500} ;         // standard width and height for most maps
const svg = d3.select("body").append("svg")
              .attr("width", dim.width).attr("height", dim.height);

const geoPath = d3.geoPath();
const projection = d3.geoMercator();
geoPath.projection(projection);

svg.selectAll("path.country") // CSS styles defined above
   .data(data.features)
      .join("path").attr("class","country")
        .attr("d", geoPath);


// An interactive interface to change the theme.
// Add HTML buttons to select the theme, and add event listeners to them
const themesList = [
    {label: "Population", key: "pop"},
    {label: "Density", key: "density"},
    {label: "HDI", key: "hdi"}
];
d3.select("body").append("div")
  .selectAll("button")
    .data(themesList)
      .join("button")
        .text(d => d.label)
        .on("click", (evt, d) => applyTheme(d.key));

d3.select("body").append("h3").lower().text("No theme");

// Function to apply a different theme
function applyTheme(t) {
    let colorScale;
    const extent = d3.extent(data.features, d => d.properties[t]);
    if (t === "hdi") { // use a different scale for HDI
        colorScale = d3.scaleSequential(d3.interpolateSpectral).domain(extent);
    } else {
        colorScale = d3.scaleSequentialPow(d3.interpolateRdYlBu).exponent(.2).domain(extent.reverse());
    }
    svg.selectAll("path.country")
       .style("fill", d => colorScale(d.properties[t]));
    d3.select("h3").text(themesList.filter(d => d.key === t)[0].label);
}
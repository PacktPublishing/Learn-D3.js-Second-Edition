import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const dataFile = "data/world-lowres.geojson";
const data = await d3.json(dataFile);

console.log(data.features)

d3.select("body")
  .append("ul")
    .selectAll("li")
      .data(data.features)
        .join("li")
          .text(d => `${d.properties.name} (${d.id}): population: ${d.properties.pop.toLocaleString()}`);


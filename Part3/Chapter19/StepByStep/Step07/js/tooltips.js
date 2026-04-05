import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const hdiLabels = [
    {label: "Very Low", range: [0, 0.349]},   // there are currently no countries below this range
    {label: "Low", range: [.350, .549]},
    {label: "Medium", range: [.55, .699]},
    {label: "High", range: [.7, .799]},
    {label: "Very High", range: [.8, 1]}
];

const hdiThresholds = hdiLabels.slice(1).map(d => d.range[0]);
const hdiLevel = d3.scaleThreshold()
                   .domain(hdiThresholds)
                   .range(hdiLabels.map(d => d.label));

const format = d3.format(",.2f");
const valueStrings = new Map();
valueStrings.set("hdi", d => `HDI: ${d.properties.hdi} (${hdiLevel(d.properties.hdi)})`);
valueStrings.set("pop", d => `Population: ${format(d.properties.pop)}`);
valueStrings.set("density", d => `Density: ${format(d.properties.density)} people/km2`);

function valueString(d) {
    if(!d.properties[currentTheme]) return "No data";
    switch(currentTheme) {
        case "hdi": return `HDI: ${d.properties.hdi} (${hdiLevel(d.properties.hdi)})`;
        case "pop": return `Population: ${format(d.properties.pop)}`;
        case "density": return `Density: ${format(d.properties.density)} people/km2`;
    }
    return "No data";
}

let currentTheme = "pop"; // default theme
export function setTheme(t) {
    currentTheme = t;
}

export function create(svg) {
    const tooltip = svg.append("g")
                       .attr("id", "tooltip")
                       .style("opacity", 0) // hidden
    tooltip.append("rect")
            .attr("width", 150).attr("height", 35)
            .attr("rx", 5).attr("ry", 5)
            .attr("x", -75).attr("y", -20)
    tooltip.append("text").attr("y", -7).attr("class", "title")
    tooltip.append("text").attr("y", 10);
}

export function show(evt, d) {
    const tooltip = d3.select("#tooltip")
                        .attr("transform", `translate(${d3.pointer(evt)})`)
                        .style("opacity", 1);
    tooltip.select("text:first-of-type").text(d.properties.name)
    tooltip.select("text:last-child").text(valueString(d));
}

export function hide() {
    d3.select("#tooltip").style("opacity", 0)
}

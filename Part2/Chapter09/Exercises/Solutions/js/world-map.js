import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';
import * as utils from '../../../js/chart-utils.js';

const width = 900;
const height = 600;
const shapesFile = "../../data/world-lowres.geojson";
const dataFile = "../../data/un_regions_gdp.csv";

const svg = d3.select("body").append("svg")
              .attr("width", width)
              .attr("height", height);

const map = {};

export function getData() {
    return map.features;
}

export async function load() {
    const [shapes, thematic] = await Promise.all([
        d3.json(shapesFile),
        d3.csv(dataFile, row => ({hdi: +row.HDI_2017,code: row.Code}))
    ]);
    map.features = shapes.features
        .map(d => {
            const entry = thematic.find(t => t.code === d.id);
            return entry ? { ...d, properties: { ...d.properties, hdi: entry.hdi } } : d;
        }).filter(d => d.properties.hdi !== 0);
}

export function drawMap() {
    svg.selectAll("path.country")
        .data(getData())
        .join("path")
        .attr("class","country")
        .attr('d', d3.geoPath().projection(d3.geoMercator().fitExtent([[0,0-25],[width,height+250]], {type: 'Sphere'})))
        .style("stroke", "white")
        .style("fill", d => d.properties.color);
}

export function makeLegend(thresholds, colors) {
    const fmt = d3.format(".3f");
    const sizes = getPartitionSizes(colors);
    // Calculate the differences between the thresholds, from 0, to the first, to the last, to 1
    const differences = thresholds.map((d, i) => i === 0 ? fmt(d) : fmt(d - thresholds[i-1])).concat(fmt(1 - thresholds[thresholds.length-1]));

    const legendData = d3.zip([0].concat(thresholds), thresholds.concat([1]))
                         .map(([min, max]) => min === 0 ? `less than ${fmt(max)}`: max === 1 ? `more than ${fmt(min)}` : `${fmt(min)} to ${fmt(max-0.001)}`)
                         .map(d => d + ` (${sizes.shift()})`)
                         .map(d => d + `; diff: ${differences.shift()}`);
    utils.legend()
        .container(d3.select("svg").append("g").attr("transform", "translate(10,500)"))
        .data(legendData)
        .color(d3.scaleOrdinal(colors))();
}

function getPartitionSizes(colors) {
    const groups = d3.groups(getData(), d => d.properties.color)
                     .filter(d => d[0]);
    return colors.map(c => [c, groups.find(g => g[0] === c)?.[1].length])
                 .map(d => d[1] ? d[1]: 0);
}
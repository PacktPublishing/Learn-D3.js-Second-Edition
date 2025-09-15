import * as d3 from 'https://cdn.skypack.dev/d3@7';

const dim = {width: 500, height: 300, margin: {top: 40, left: 50}};

const scaleX = d3.scaleLinear().range([dim.margin.left, dim.width - dim.margin.left]);
const scaleY = d3.scaleLinear().range([dim.height - .5, dim.margin.top]);
const color  = d3.scaleSqrt().range(["blue", "red"]);

const data = {
    values: [],
    bins: undefined,
    thresholds: undefined
};

export function plot() {
    scaleX.domain([0, d3.max(data.thresholds)]);
    scaleY.domain([0, d3.max(data.bins, d => d.length)]);
    color.domain(scaleY.domain());
    draw();
}

export function generateData(random) {
    data.values = [...Array(10000)].map(() => random() * 160);
}

export function makeHistogram(bucket, thresholds) {
    data.thresholds = d3.range(d3.min(data.values), d3.max(data.values), bucket);
    const bin = d3.bin().thresholds(thresholds ? thresholds : data.thresholds);
    data.bins = bin(data.values);
}

function draw() {
    const width = dim.width / data.bins.length
    d3.select("svg")
      .append("g")
        .attr("transform", `translate(${[0,0]})`)
        .selectAll("rect.bar")
           .data(data.bins)
              .join("rect").attr("class", "bar")
                .attr("x", d => scaleX(d.x0))
                .attr("width", width > 2 ? width-1 : width)
                .attr("y", d => scaleY(d.length))
                .attr("height", d => dim.height - scaleY(d.length))
                .style("fill", d => color(d.length))

}
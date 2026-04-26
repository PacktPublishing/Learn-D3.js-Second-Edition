import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const maxValue = 5000;
const scale = d3.scaleLinear().domain([0, maxValue]);
const fmt = d3.format(".0f");

export{scale, maxValue, drawBar, display, fmt};

function drawBar(container, x, w = 2, color1 = 'red', color2 = 'black') {
    container.append("rect")
        .attr("x", scale(x) - w/2)
        .attr("y", 100)
        .attr("height", 50)
        .attr("width", w)
        .style("fill", color1)
        .transition().duration(1500)
           .style("fill", color2);
}

function display(container, dim, initialtext = "") {
    scale.range([dim.margin, dim.width - dim.margin]);

    container.append("text")
             .attr("id", "count")
             .text(initialtext)
             .attr("transform", `translate(${dim.width/2},${dim.height/4})`);

    const axis = d3.axisBottom(scale)
                   .ticks(10, ".0f");
    container.append("g")
        .attr("transform", `translate(0,150)`)
        .call(axis);
}
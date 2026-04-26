import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const format = d3.format(',.2f');

/**
 * Draw chart
 * @param dim
 * @param chart
 * @param nodes
 * @param data
 */
export function draw(dim, chart, nodes, data) {

    // Place all cells
    const cell = chart.selectAll('g.cell')
                      .data(data)
                         .join("g").attr("class", 'cell')
                             .attr("transform", d => `translate(${[d.x, d.y]})`)
                             .on("mouseover", highlight)
                             .on("mouseout", unHighlight);

    // Draw rectangles for each cell
    cell.append("rect")
        .attr("height", d => d.h)
        .attr("width", d => d.w)
        .attr("rx",d => d.w/4).attr("ry", d => d.h/4)
        .style("stroke", 'black')
        .style("fill", d => d.color)

    // Add source country labels at left
    chart.selectAll('text.source')
        .data(data.filter(d => d.y === 0))
            .join("text").attr("class",'source')
                .style("text-anchor", 'start')
                .attr("y", d => d.x + d.w/2)
                .attr("x", 5)
                .attr("transform",`rotate(-90) `)
                .text((d,i) => nodes[i].node)
                .on("mouseover", highlight)
                .on("mouseout", unHighlight);

    // Add title for source countries
    chart.append("text")
        .style("text-anchor", 'middle')
        .style("font-size", 24)
        .attr("transform",`rotate(-90,${[0, dim.height/2 - dim.margin/2]}) translate(${[0, dim.height/2 - dim.margin/2 - 75]})`)
        .text('IMMIGRANTS FROM');

    // Add target country labels at top
    chart.selectAll('text.target')
        .data(data.filter(d => d.x === 0))
            .join("text").attr("class",'target')
                .style("text-anchor", 'end')
                .attr("y", d => d.y + d.h/2)
                .attr("x", -10)
                .text((d,i) => nodes[i].node)
                .on("mouseover", highlight)
                .on("mouseout", unHighlight);

    // Add title for target countries
    chart.append("text")
        .style("text-anchor", 'middle')
        .attr("transform",`translate(${[dim.width/2 - dim.margin/2, -75]})`)
        .style("font-size", 24)
        .text('LIVING IN');

    // Configure tooltips
    const tooltip = chart.append("g")
        .attr("class",'tooltip')
        .style("opacity", 0)
        .style("pointer-events", 'none')

    tooltip.append("rect")
        .style("fill", 'white')
        .style("stroke", 'black');
    tooltip.append("text")
        .style("alignment-baseline", 'middle')
        .style("text-anchor", 'middle');

}

/** Event handlers for highlighting **/
function unHighlight() {
    d3.selectAll(".cell, text.source, text.target")
        .classed('faded highlight', false);
    d3.select('.tooltip').style("opacity", 0);
}

function highlight(evt, d) {
    d3.selectAll(".cell")
        .classed('faded', k => k.x !== d.x && k.y !== d.y)
        .classed('highlight', k => k.x === d.x || k.y === d.y);

    d3.selectAll("text.source")
        .classed('highlight', k => k.x === d.x);

    d3.selectAll("text.target")
        .classed('highlight', k => k.y === d.y);

    const tooltip = d3.select('.tooltip');
    tooltip.select("text")
        .attr("x", d.w * 0.75)
        .attr("y", d.h * 0.75)
        .text(d.value ? format(d.value / 1_000_000) : 0);

    tooltip
        .attr("transform", `translate(${[d.x - d.w / 4, d.y - d.h / 4]})`)
        .style("opacity", 1);

    tooltip.select("rect")
        .style("stroke-width", 3)
        .attr("rx", d.w / 4)
        .attr("ry", d.h / 4)
        .style("fill", d.color)
        .attr("width", d.w * 1.5)
        .attr("height", d.h * 1.5);
}
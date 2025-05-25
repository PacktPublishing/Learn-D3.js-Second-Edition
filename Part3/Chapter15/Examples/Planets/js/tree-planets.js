import * as d3 from "https://cdn.skypack.dev/d3@7";

export function draw(data, container, scale) {
    drawLinks(container.append("g").attr("class", "links"), data.links());
    drawNodes(container.append("g").attr("class", "nodes"), data.descendants(), scale);
}

function drawNodes(g, data, scale) {
    const node = g.selectAll("g")
                  .data(data)
                    .join('g')
                        .attr('transform', function(d) {
                            return 'translate(' + [d.x, d.y] + ')';
                        });

    node.append("circle")
        .attr("r", d => d.data.diameterKm ? scale(d.data.diameterKm) : scale(d.data.star.diameterKm))
        .attr("cy", d => d.data.star ? scale(-d.data.star.diameterKm * .8) : 0)
        .style("fill", d => d.data.star ? "gold" : d.data.color)

    node.append("text")
        .attr('x', d => d.data.diameterKm ? scale(d.data.diameterKm)+5 : -15)
        .attr('y', 5)
        .text(d => d.data.name ? d.data.name : d.data.star.name)
        .attr("class",
            d => d.height > 0 && d.depth !== 0
                 ? "node" : d.depth === 0
                    ? "root" : "leaf");
}

function drawLinks(g, data) {
    g.selectAll("path")
     .data(data)
       .join('path')
        .attr("d", d3.linkVertical().x(d => d.x).y(d => d.y));
}
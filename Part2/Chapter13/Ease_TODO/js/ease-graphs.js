import * as d3 from "https://cdn.skypack.dev/d3@7.9.0";

export function draw(container, dim, grid, scale, easeType, index, animated = false, shortName = false) {

    const i = index % grid.rows;
    const j = Math.floor(index / grid.rows);
    const datum = d3.range(0, 1, 0.002);

    const g = container.append("g")
        .attr("transform",
            "translate("+[j * dim.width/grid.cols,i * dim.height/grid.rows]+")");

    const line = d3.line()
        .x(d => scale.x(d))
        .y(d => scale.y(d3[easeType](d)));

    g.append("path").datum(datum)
        .attr("d", line)
        .attr("stroke", "red")
        .attr("fill", "none");

    const styleName = shortName ? easeType.split("ease")[1] : "d3."+easeType;

    g.append("text")
        .text(styleName)
        .attr("text-anchor", "start")
        .attr("x", dim.width/grid.cols/2 - dim.width/grid.cols/2.6)
        .attr("y", dim.height/grid.rows - dim.margin.top/2 + 10);

    g.append("line")
        .attr("x1", scale.x(0))
        .attr("x2", scale.x(1))
        .attr("y1", scale.y(0))
        .attr("y2", scale.y(0))
        .style("stroke", "#888")
        .attr("stroke-width", .5);

    if(animated) {
        g.append("circle")
            .attr("class", `line-dot ${easeType}`)
            .attr("r", 3)
            .attr("cy", scale.y(0))
            .attr("cx", scale.x(0));

        g.append("circle")
            .attr("class", `free-dot ${easeType}`)
            .attr("r", 3)
            .attr("cy", scale.y(0))
            .attr("cx", scale.x(1)+10);

        g.append("rect")
            .attr("class", "vertical-bar free-dot")
            .attr("width", 6)
            .attr("height", scale.y(0))
            .attr("x", scale.x(1)+7)
            .attr("y", scale.y(1))
            .style("opacity", .1);

        g.append("line")
            .attr("x1", scale.x(1)+7)
            .attr("x2", scale.x(1)+13)
            .attr("y1", scale.y(0))
            .attr("y2", scale.y(0))
            .style("stroke", "black")
            .attr("stroke-width", 1);

        animate(easeType, scale);
    }
}

function animate(easeType, scale) {
    const tr = d3.transition().duration(2500).delay(1000);
    d3.selectAll(`circle.line-dot.${easeType}`)
        .transition(tr)
        .attrTween("cx", () => t => scale.x(t))
        .attrTween("cy", () => t => scale.y(d3[easeType](t)))
        .on("end", () => animate(easeType, scale));

    d3.selectAll(`circle.free-dot.${easeType}`)
        .transition(tr)
        .attr("cx", d => scale.x(1)+10)
        .attrTween("cy", () => t => scale.y(d3[easeType](t)))
        .on("end", () => animate(easeType, scale));
}
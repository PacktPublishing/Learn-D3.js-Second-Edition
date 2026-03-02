import * as d3 from "https://cdn.skypack.dev/d3@7.9.0";

export { randomDataSeries, createView, renderLineChart, fixResolution };

function randomDataSeries(numSeries, numPoints, min = 0, max = 50) {
    const steps = d3.range(0,numPoints); //

    const datasets = [];
    for (let i = 0; i < numSeries; i++) {
        datasets.push(steps.map(d => [d, d3.randomInt(min, max)()]));
    }
    return datasets;
}

function createView(type, dim, selector, id) {
    const view =  d3.select(selector)
                    .append(type)
                    .attr("id", id)
                    .attr("width", dim.width)
                    .attr("height", dim.height)
                    .style("width", `${dim.width}px`)
                    .style("height", `${dim.height}px`);
    if (type === "canvas") {
        return fixResolution(view.node().getContext("2d"));
    }
    return view;
}

function renderLineChart(context, lineFunction, data, colors) {
    if (context.canvas) {
        lineFunction.context(context);
        data.forEach((d, i) => {
            context.strokeStyle = colors[i];
            context.lineWidth = 2;

            context.beginPath();
            lineFunction(d);
            context.stroke();
        });
    } else {
        context.selectAll("path.line")
               .data(data)
                 .join("path")
                   .attr("class", "line")
                   .attr("d", lineFunction)
                   .style("fill", "none")
                   .style("stroke", (d,i) => colors[i]);
    }
}

/**
 * Fixes the resolution of the canvas element in case the devicePixelRatio is greater than 2
 */
function fixResolution(ctx) {
    if(devicePixelRatio >= 2){
        ctx.canvas.width *= 2;
        ctx.canvas.height *= 2;
        ctx.setTransform(2,0,0,2,0,0);
    }
    return ctx;
}
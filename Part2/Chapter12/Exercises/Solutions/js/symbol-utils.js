import * as d3 from "https://cdn.skypack.dev/d3@7.9.0";

export{display, drawSymbol, drawGrid, printPath, render};

function drawGrid(container, side, width, height) {
    const grid = container.append("g").attr("class", "grid");
    for (let i = 0; i < width; i+=side) {
        grid.append("line")
            .attr("x1", i)
            .attr("y1", 0)
            .attr("x2", i)
            .attr("y2", height);
    }
    for (let i = 0; i < height; i+=side) {
        grid.append("line")
            .attr("x1", 0)
            .attr("y1", i)
            .attr("x2", width)
            .attr("y2", i);
    }
}
function drawSymbol(container, index, symbol, side, x, y, style, color) {

    const s = d3.symbol().type(symbol).size(side*side);

    // Reference container: size * size
    container.append("rect")
        .attr("class", "container")
        .attr("width",side)
        .attr("height",side)
        .attr("x",-side/2 + x)
        .attr("y",-side/2 + y);

    // The symbol
    container.append("path")
        .attr("d", s)
        .attr("transform", `translate(${x},${y})`)
        .style(style, color(index));
}


function display(container, symbol, index, position, style, scale, margin, color, showText) {
    const pathData = d3.symbol().type(symbol).size(200);

    const g = container.append("g")
        .attr("transform", `translate(${index * scale + margin},${position})`);

    g.append("path")
        .attr("d", pathData)
        .style(style.toLowerCase(), color(symbol));

    if(showText) {
        g.append("text")
            .text("d3."+symbol)
            .style("text-anchor", "middle")
            .attr("x", 0)
            .attr("y", 30);
    }
}

function printPath(context, symbolName, symbol) {
    symbol.draw(context, 10000);
    console.log(symbolName, context.toString());
}

function render(container, symbol, clazz, size, i) {
    container.append("path").attr("d", d3.symbol(symbol, size))
        .attr("class", clazz)
        .attr("transform", `translate(${100 + 150 * i},100)`);
}
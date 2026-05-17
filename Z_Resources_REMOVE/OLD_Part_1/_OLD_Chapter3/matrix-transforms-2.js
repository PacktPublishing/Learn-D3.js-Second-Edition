const d3 = await Promise.all([
    import("https://cdn.skypack.dev/d3-selection-multi@1"),
    import("https://cdn.skypack.dev/d3-selection@1"),
    import("https://cdn.skypack.dev/d3-scale-chromatic@1"),
    import("https://cdn.skypack.dev/d3-scale@4"),
    import("https://cdn.skypack.dev/d3-format@3"),
]).then(d3 => Object.assign({}, ...d3));

export{matrix, makeViews, sin, cos, tan};

const svg = d3.select(".view")
    .append("svg")
    .attr("width", 1300)
    .attr("height", 800);

const colors  = d3.scaleOrdinal(d3.schemeCategory10.splice(1,10));
const side = 60;
const margin = {left:120, top: 170};
const spacing = {vert: 120, horz: 200};
const fmt = d3.format(".2f");

let useMatrix = true;

// A reference shape to demonstrate the transformations (square divided into 9 tiles + origin)
function makeShape(container) {
    const shape = container.append("g");
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            shape.append("rect")
                .attr("class", "tile")
                .attr("x",1).attr("y",1)
                .attr("width", side/3 - 2)
                .attr("height", side/3 - 2)
                .attr("transform", `translate(${j * side/3},${i * side/3})`)
                .style("opacity", .8)
                .style("fill", colors([j, i]));
        }
    }
    shape.append("rect")
        .attr("width", side)
        .attr("height", side)
        .attr("class", "square")
        .style("fill", "none")
        .style("stroke", "black");
    shape.append("circle") // origin
        .attr("r", 2)
        .style("fill", "red")
        .style("stroke", "black");
    return shape;
}

function addArrows(defs, id, width, height, fill) {
    defs.append("marker")
        .attrs({id: id, viewBox: `0 0 ${width} ${height}`, refX: width/2, refY: height/2,
                markerWidth: width * .6, markerHeight: height * .6, orient: "auto"})
        .append("path").attr("d", "M0,0L10,5L0,10").attr("fill", fill);
}

// A reference plane to demonstrate the transformations (axes + arrows + labels)
function makePlane(container) {
    const plane = container.append("g").attr("class", "plane");

    // define the arrow markers
    const defs = plane.append("defs");
    addArrows(defs, "arrow", 10, 10, "blue");

    // axes
    plane.append("line").attrs({x1: 0, y1: -100, x2: 0, y2: 100})
         .attr("marker-end", "url(#arrow)");
    plane.append("line").attrs({x1: -100, y1: 0, x2: 100, y2: 0})
         .attr("marker-end", "url(#arrow)");

    const text = plane.append("text").attr("class", "label");
    const showMatrix = [[1,0,0],[0,1,0],[0,0,1]];
    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 3; j++) {
            text.append("tspan").attr("class", `pos-${i}-${j}`)
                .attr("x", 20 + 45 * j).attr("y", -100 + 15*i)
                .text(fmt(showMatrix[i][j]));
        }
    }
    return plane;
}

let rows = 3, cols = 4;

// distribute planes with shapes on the view
function makeViews(r = 3, c = 4, useM = true) {
    rows = r;
    cols = c;
    useMatrix = useM;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const x = (spacing.horz + margin.left) * j + margin.left,
                  y = (spacing.vert + margin.top) * i + margin.top;

            const plane = makePlane(svg);
            const shape = makeShape(plane);

            shape.attr("id", `shape_${i}_${j}`);
            plane.attr("id", `plane_${i}_${j}`)
                .attr("transform", `translate(${[x,y]})`);
        }
    }
}

// Show the affine matrix for a transformation
function label(x, y, matrix, delay) {
    const text = d3.select(`#plane_${x}_${y}`)
        .selectAll("text");
    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 3; j++) {
            const newText = fmt(matrix[i][j]);
            const position = text.select(`.pos-${i}-${j}`);
            if(position.text() === newText) continue;
            position.transition().delay(delay - 300)
                .style("font-weight", "bold")
                .style("fill", "red")
                .text(newText);
        }
    }
}

// Create the affine matrix and display the transformation and information about it
function matrix() {
    let a = 1, c = 0, e = 0,
        d = 1, b = 0, f = 0;

    apply.a = arg => (arguments.length) ? a : (a = arg, apply);
    apply.b = arg => (arguments.length) ? b : (b = arg, apply);
    apply.c = arg => (arguments.length) ? c : (c = arg, apply);
    apply.d = arg => (arguments.length) ? d : (d = arg, apply);
    apply.e = arg => (arguments.length) ? e : (e = arg, apply);
    apply.f = arg => (arguments.length) ? f : (f = arg, apply);

    function apply([specificOp, matrixOp], x, y, origin=[0,0]) {
        const matrix = [a, b, c, d, e, f];
        const text = d3.select(`#plane_${x}_${y}`).select("text");
        const shape = d3.select(`#shape_${x}_${y}`);

        const title = (specificOp === matrixOp) ? "No transformation" : specificOp;

        shape.transition().delay( (y + cols * x) * 1000)
            .attr("transform-origin", `${origin[0]} ${origin[1]}`)  // sets the origin
            .attr("transform", useMatrix ? `matrix(${matrix})` : specificOp)  // creates the transformation
            .end()
            .then(() => {
                console.log(d3.select(`#shape_${x}_${y}`).node().getCTM())
            });
        shape.select("circle").attr("transform", `translate(${origin})`);
        if(origin.some(d => d !== 0)) {
            text.append("tspan").text(`transform-origin: ${origin}`).attr("x", 20).attr("dy", 20);
        }
        text.append("tspan")
            .attr("class", "title")
            .text(title).style("text-anchor", "middle")
            .attr("x", 0)
            .attr("y", -150);
        text.append("tspan")
            .attr("class", "subtitle")
            .text(matrixOp).style("text-anchor", "middle")
            .attr("x", 0)
            .attr("y", -130);

        label(x, y, [[a,c,e],[b,d,f],[0,0,1]], (y + cols * x) * 1000);
    }
    return apply;
}

// Utility functions
function cos(angle) {
    return Math.cos(angle * Math.PI / 180);
}
function sin(angle) {
    return Math.sin(angle * Math.PI / 180);
}
function tan(angle) {
    return Math.tan(angle * Math.PI / 180);
}
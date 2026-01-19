import * as d3 from "https://cdn.skypack.dev/d3@7.9.0";

/**
 * Converts a square matrix to a list of links in the form of {source: i, target: j, value: matrix[i,j]}
 * @param nodes - List of objects with node identification information (ex: list of strings)
 * @param matrix - Square matrix with adjacency data
 * @param {boolean} objectID - If true, uses node objects as source and target, otherwise uses their index
 * @returns {{nodes: Array of {node: name}, links: Array of {source: i, target: j, value: matrix[i,j]}}
 */
export function matrixToLinks(nodes, matrix, objectID = false) {

    if (!Array.isArray(matrix)) {
        throw new TypeError('matrix must be an array of rows');
    }

    const links = [];
    const rows = matrix.length;

    for (let s = 0; s < rows; s++) {
        const row = matrix[s];
        if (!Array.isArray(row)) continue; // skip invalid rows

        for (let t = 0; t < row.length; t++) {
            const v = row[t];
            if (typeof v === 'number' && v > 0) {
                const source = objectID ? nodes?.[s] : s;
                const target = objectID ? nodes?.[t] : t;

                if (objectID && (source === undefined || target === undefined)) {
                    throw new RangeError('`nodes` must contain entries for all matrix indices when `objectID` is true');
                }

                links.push({ source, target, value: v });
            }
        }
    }
    return links;
}

/**
 * Converts a list of nodes and links to a square matrix.
 * @param nodes - Must contain a list of objects with node identification information (ex: list of strings)
 * @param links - Must contain a list of objects with `source`, `target`, and `value` properties.
 * @param {boolean} objectIds - If true, uses node objects as source and target, otherwise uses their index
 * @param {boolean} copyOnZero - If true, copies value from forward link if no reverse link exists - used for symmetric datasets.
 * @param {string} source - Property name for source in links - default is "source"
 * @param {string} target - Property name for target in links - default is "target"
 * @param {string} value - Property name for value in links - default is "value"
 * @returns {Array} Square matrix representing adjacency data
 */
export function linksToMatrix (nodes, links, objectIds = false, copyOnZero = false, source = "source", target = "target", value  = "value") {

    const matrix = [];

    if(copyOnZero) {
        links.forEach(link => {
            if(!links.some(l => l[source] === link[target] && l[target] === link[source])) {
                links.push({ [source]: link[target], [target]: link[source], [value]: link[value] });
            }
        });
    }

    for(let s = 0; s < nodes.length; s++) { // For each target node
        const line = [];
        for(let t = 0; t < nodes.length; t++) { // For each target node
            const link = !objectIds ? links.filter(k => k[source] === s && k[target] === t) :
                                      links.filter(k => k[source] === nodes[s] && k[target] === nodes[t]);

            if(link.length !== 0) {
                line.push(link[0][value]);
            } else {
                line.push(0);
            }
        }
        matrix.push(line);
    }
    return matrix;
}

/**
 * Adjacency Matrix layout generator function
 * Default size is 1x1
 *
 * To create a layout function in a 800x600 view space:
 *
 * const matrixLayout = nwu.adjacencyMatrix()
 *                         .size([800,600]);
 *
 * To generate an array of matrix-positioned objects:
 *
 * const data = matrixLayout(names, matrix);
 *
 * Where names is a list of objects and matrix a square matrix of values.
 *
 * Result is array with (nodes x nodes) elements. Each element contains:
 *   x - x position of rectangle
 *   y - x position of rectangle
 *   w - width of rectangle
 *   h - height of rectangle
 *
 * If element is an adjacency (value > 0), it additionally contains:
 *   value - original value
 *   source - source node
 *   target - target node
 *
 * @returns layout function
 */
export function adjacencyMatrix() {
    let width = 1, height = 1;

    function layout(nodes, sourceMatrix) {
        const nodeCount = nodes.length;
        const cellWidth = width / nodeCount;
        const cellHeight = height / nodeCount;

        return sourceMatrix.flatMap((row, rowIndex) =>
            row.map((value, colIndex) => {
                const rect = { x: colIndex * cellWidth, y: rowIndex * cellHeight, w: cellWidth, h: cellHeight };
                return value > 0
                    ? { ...rect, source: nodes[rowIndex], target: nodes[colIndex], value }
                    : rect;
            })
        );
    }

    layout.size = function(dimensions) {
        if (!arguments.length)
            return [width, height];
        [width, height] = dimensions.map(Number);
        return layout;
    };

    return layout;
}

/**
 * Arc diagram layout generator function
 * Default size is 1x1
 *
 * To create a layout function in a 800x600 view space:
 *
 * const arcDiagLayout = ntw.arcDiagram()
 *                          .width(800);
 *
 * To generate an array of arc-positioned objects:
 *
 * const layout = arcDiagLayout(node, edges);
 *
 * Where nodes and edges have the following minimum structure:
 *
 * nodes: [{node: obj1}, {node: obj2}, ...]
 * edges: [{source: obj1, target: obj2}, ...]
 *
 * Results:
 *
 * layout.nodes(): adds x coordinate for each node
 * layout.links(): replaces references for links to source and target for each edge
 *
 * @returns layout function
 */

export function arcDiagram() {
    let w = 1;

    const points = [];
    const curves = [];

    function layout(n, e) {

        const nodes = n.map(a => Object.assign({}, a));
        const edges = e.map(a => Object.assign({}, a));

        const len = nodes.length;

        nodes.forEach(function(node, i) {
            node.x = i * w/len;
            node.i = i;
            points.push(node);
        });

        const groups = d3.rollup(nodes, v => v[0], d => d.node);

        edges.forEach(function(edge, j) {
            if(isNaN(edge.source)) {
                edge.source = groups.get(edge.source);
                edge.target = groups.get(edge.target);
                if(edge.source && edge.target && edge.value > 0) {
                    curves.push(edge);
                }
            } else {
                edge.source = nodes[edge.source];
                edge.target = nodes[edge.target];
                if(edge.source && edge.target && edge.value > 0) {
                    curves.push(edge);
                }
            }
        });

        points.forEach(function(node, i) {
            node.sources = edges.filter(edge => edge.source === node);
            node.targets = edges.filter(edge => edge.target === node);
        });

        return {nodes: () => points, links: () => curves};
    }

    layout.width = function(width) {
        return arguments.length ? (w = +width, layout) : w;
    }

    return layout;
}

/**
 * Curve generator function.
 * This function generates a curved line between two points.
 *
 * @param {d3.curve} [curveType=d3.curveBundle.beta(0.75)] - The type of curve to use.
 *
 */
export function curve(curveType = d3.curveBundle.beta(0.75)) {

    let h = 2;
    let w = 1;

    let source = d => d.source.x;
    let target = d => d.target.x;
    let midY   = d => d.source.x - d.target.x;

    function layout(d) {
        const line = d3.line().curve(curveType);
        const height = d3.scaleLinear().range([0,h/2]).domain([0,w])
        return line([ [source(d),0],[(source(d)+target(d))/2,height(midY(d))],[target(d),0] ]);
    }

    layout.source = (func) => arguments.length ? (source = func, layout) : source;
    layout.target = (func) => arguments.length ? (target = func, layout) : target;
    layout.midY   = (func) => arguments.length ? (midY = func, layout) : midY;

    layout.size = function(array) {
        return arguments.length ? (w = +array[0], h = +array[1] * 2, layout) : [w, h];
    }

    return layout;
}

/**
 * Layout generator function for a circle diagram.
 * Generates a circular layout for nodes and links, with properties: angle, radius, and index for each node.
 *
 *
 * @returns {function(*, *): {nodes: function(): *[], links: function(): *[]}}
 */
export function circleDiagram() {
    let w = 1;
    let h = 1;

    const points = [];
    const curves = [];

    function layout(n, e) {

        const nodes = n.map(a => Object.assign({}, a));
        const edges = e.map(a => Object.assign({}, a));

        const circ = 2 * Math.PI;

        nodes.forEach(function(node, i) {
            node.angle = i * circ/nodes.length;
            node.radius = Math.min(w,h)/2;
            node.index = i;
            points.push(node);
        });

        const groups = d3.rollup(nodes, v => v[0], d => d.node);

        edges.forEach(function(edge, j) {
            if(isNaN(edge.source)) {
                edge.source = groups.get(edge.source);
                edge.target = groups.get(edge.target);
                if(edge.source && edge.target && edge.value > 0) {
                    curves.push(edge);
                }
            } else {
                edge.source = nodes[edge.source];
                edge.target = nodes[edge.target];
                if(edge.source && edge.target && edge.value > 0) {
                    curves.push(edge);
                }
            }
        });

        points.forEach(function(node, i) {
            node.sources = edges.filter(edge => edge.source === node);
            node.targets = edges.filter(edge => edge.target === node);
        });

        return {nodes: () => points, links: () => curves};
    }

    layout.size = function(array) {
        return arguments.length ? (w = +array[0], h = +array[1], layout) : [w, h];
    }

    return layout;
}

/**
 * Square grid layout generator function.
 * @returns {function(*, *): {nodes: function(): *[], edges: function(): *}}
 */
export function squareGrid() {
    let w = 1;
    let h = 1;
    let rows = 1;
    let cols = 1;
    let offset = 0;
    let step = 1;

    const nodes = [];

    function layout(n, e) {

        const points = n.map(a => Object.assign({}, a));
        const edges  = e.map(a => Object.assign({}, a));
        const places = rows * cols;

        const grid = [];
        for(let i = 0; i < cols; i++) {
            for(let j = 0; j < rows; j++) {
                const point = {};
                point.x = i * w/(cols-1);
                point.y = j * h/(rows-1);
                grid.push(point);
            }
        }

        points.forEach((point, i) =>{
            const coords = grid[(offset + step * i) % grid.length];
            point.x = coords.x;
            point.y = coords.y;
            point.index = i % grid.length;
            nodes.push(point);
        });

        const rollup = d3.rollup(nodes, v => v[0], d => d.node);

        edges.forEach(edge => {
            edge.source = rollup.get(edge.source);
            edge.target = rollup.get(edge.target);
        });

        nodes.forEach(node => {
            node.sources = edges.filter(edge => edge.source === node);
            node.targets = edges.filter(edge => edge.target === node);
        });

        edges.sort((a,b) => d3.ascending(a.source.node, b.source.node) || d3.ascending(a.target.node, b.target.node));

        console.log('sorted', edges)

        // See also https://stackoverflow.com/questions/11368339/drawing-multiple-edges-between-two-nodes-with-d3

        for (let i = 0; i < edges.length; i++) {
            if (i !== 0 && edges[i].source === edges[i-1].source
                        && edges[i].target === edges[i-1].target) {
                edges[i].edgeNumber = edges[i-1].edgeNumber + 1;
            } else {
                edges[i].edgeNumber = 1;
            }
        }
        return {nodes: () => nodes, edges: () => edges};
    }

    layout.offset = function(value) {
        return arguments.length ? (offset = +value, layout) : offset;
    }
    layout.step = function(value) {
        return arguments.length ? (step = +value, layout) : step;
    }
    layout.gridSize = function(array) {
        return arguments.length ? (cols = +array[0], rows = +array[1], layout) : [cols, rows];
    }
    layout.size = function(array) {
        return arguments.length ? (w = +array[0], h = +array[1], layout) : [w, h];
    }

    return layout;
}

/**
 * Generates a link path for a graph with curved edges.
 * @returns {function(*): string}
 */
export function graphLink() {

    let [w,h] = [1,1];
    const ref = .00001;
    let allCurves = true;
    let curvature = 1;
    let symmetric = true;

    const dx = d => d.target.x - d.source.x;
    const dy = d => d.target.y - d.source.y;
    const dr = (d,dir) => (dx(d)*dy(d)) * ref/curvature * (w+h) * (d.edgeNumber + dir)/4;

    function layout(d) {
        const direction = symmetric ? d.edgeNumber % 2 : 1;
        const curve = d.edgeNumber % 2 === 0 || allCurves ? `A ${dr(d,direction)},${dr(d,direction)} 0 0,${direction} ` : "L";
        return "M" + d.source.x + "," + d.source.y + curve + d.target.x + "," + d.target.y;
    }

    layout.size = function(array) {
        return arguments.length ? (w = +array[0], h = +array[1], layout) : [w, h];
    }
    layout.curvesOnly = function(bool) {
        return arguments.length ? (allCurves = bool, layout) : allCurves;
    }
    layout.symmetric = function(bool) {
        return arguments.length ? (symmetric = bool, layout) : symmetric;
    }
    layout.curvature = function(value) {
        return arguments.length ? (curvature = (value === 0) ? .0001 : value, layout) : curvature;
    }

    return layout;
}
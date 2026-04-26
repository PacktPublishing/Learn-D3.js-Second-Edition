import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export const dim = {width: 800, height: 600, margin: 100};

const svg = d3.select("body").append("svg").attr("width", dim.width).attr("height", dim.height);
export const chart = svg.append("g");

export const nodes = [
    {node: 'A'},
    {node: 'B'},
    {node: 'C'},
    {node: 'D'},
    {node: 'E'},
    {node: 'F'},
    {node: 'G'},
    {node: 'H'},
    {node: 'I'},
    {node: 'J'},
    {node: 'K'},
    {node: 'L'},
    {node: 'M'},
    {node: 'N'},
    {node: 'O'},
    {node: 'P'},
    {node: 'Q'},
    {node: 'R'},
    {node: 'S'},
    {node: 'T'},
    {node: 'U'},
    {node: 'V'},
    {node: 'W'},
    {node: 'X'},
    {node: 'Y'},
    {node: 'Z'}
];

export const links = [
    {source: 0, target: 4, value: 3},
    {source: 4, target: 8, value: 3},
    {source: 8, target: 14, value: 3},
    {source: 14, target: 20, value: 3},
    {source: 0, target: 1, value: 1},
    {source: 1, target: 2, value: 1},
    {source: 2, target: 3, value: 1},
    {source: 3, target: 4, value: 1},
    {source: 4, target: 5, value: 1},
    {source: 5, target: 6, value: 1},
    {source: 6, target: 7, value: 1},
    {source: 7, target: 8, value: 1},
    {source: 8, target: 9, value: 1},
    {source: 9, target: 10, value: 1},
    {source: 10, target: 11, value: 1},
    {source: 11, target: 12, value: 1},
    {source: 12, target: 13, value: 1},
    {source: 13, target: 14, value: 1},
    {source: 14, target: 15, value: 1},
    {source: 15, target: 16, value: 1},
    {source: 16, target: 17, value: 1},
    {source: 17, target: 18, value: 1},
    {source: 18, target: 19, value: 1},
    {source: 19, target: 20, value: 1},
    {source: 20, target: 21, value: 1},
    {source: 21, target: 22, value: 1},
    {source: 22, target: 23, value: 1},
    {source: 23, target: 24, value: 1},
    {source: 24, target: 25, value: 1},
    {source: 16, target: 15, value: 2},
    {source: 17, target: 16, value: 2},
    {source: 18, target: 17, value: 2},
    {source: 19, target: 18, value: 2}
];

const color = d3.scaleOrdinal(d3.schemeCategory10)
                .domain([0,nodes.length]);

export function draw() {
    chart.selectAll('line')
        .data(links, d => `${d.source.node}-${d.target.node}`)
        .join(
            enter => enter.append('line')
                .lower()
                .attr("stroke-width", d => d.value * d.value),
            update => update.attr("stroke-width", d => d.value * d.value),
            exit => exit.remove()
        );

    // Bind nodes: append only on enter, update positions on update
    chart.selectAll('g.node')
        .data(nodes, d => d.node)
        .join(
            enter => {
                const g = enter.append('g').attr('class', 'node')
                               .attr('id', d => d.node); // Save ID to select the node
                g.append('circle').attr('r', 15)
                    .style('fill', (d,i) => color(i))
                    .style('stroke', 'black');
                g.append('text').text(d => d.node);
                return g;
            },
            update => update,
            exit => exit.remove()
        );
}

export function redraw() {
    chart.selectAll('g.node')
        .attr("transform", d => `translate(${[d.x, d.y]})`);

    chart.selectAll('line')
        .attr("x1", d => d.source.x)
        .attr("x2", d => d.target.x)
        .attr("y1", d => d.source.y)
        .attr("y2", d => d.target.y)
}
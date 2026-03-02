/**
 * Most of this file implements a simple bouncing ball animation.
 */

import * as d3 from 'https://cdn.skypack.dev/d3@7.9.0';

export {svg, width, height, r, start};

const width = 600,
      height = 300;
const r = 25;

const svg = d3.select("body")
              .append("svg")
              .attr("height", height)
              .attr("width", width)

svg.append("rect")
    .attr("width", width/2)
    .attr("height", height)
    .style("fill", "white");

const traps = [makeTrap("blue", 50, 50, 60),
               makeTrap("red", 30, 200, 60),
               makeTrap("green", 175, 125, 60)];

const ball = svg.append("circle").attr("class", "ball")
                .attr("r", r)
                .attr("cx", 150)
                .attr("cy", 150);

function start(strike) {
    let x = 150, y = 150, dx = 1.2, dy = 1.3;
    setInterval(() => {
        x += dx;
        y += dy;
        if(x > width/2 - r || x < r) dx = -dx;
        if(y > height - r || y < r) dy = -dy;
        ball.attr("cx", x).attr("cy", y);
        traps.map(t => check(t, strike));
    }, 5);
}

function check(trap,strikeFunction) {
    const cx = +ball.attr("cx");
    const cy = +ball.attr("cy");
    const x = +trap.attr("x");
    const y = +trap.attr("y");
    const w = +trap.attr("width");
    const h = +trap.attr("height");
    if(cx >= x + r && cy >= y + r && x + w >= cx + r && y + h >= cy + r) {
        strikeFunction(ball,trap)
    }
}

function makeTrap(color, x, y, size) {
    return svg.append("rect").attr("class", color)
                                   .attr("width", size)
                                   .attr("height", size)
                                   .attr("x", x)
                                   .attr("y", y)
                                   .style("stroke", color);
}
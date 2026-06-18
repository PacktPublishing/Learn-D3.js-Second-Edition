import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';

    /**
 * Override the following defaults and call init() to render
 * cs.create    - the D3 color space generator function to use.
 *                Default: d3.rgb;
 * cs.keys      - names for the color channels (same letters as d3 function properties).
 *                Default: ["r", "g", "b"];
 * cs.domains   - Array with domains [max,min] for each color channel.
 *                Default: [[0,255],[0,255],[0,255]];
 * cs.ticks     - Array with array of ticks to display in each channel.
 *                Default: [[0,64,128,192,255],[0,64,128,192,255],[0,64,128,192,255]];
 * cs.functions - Functions to call to generate each axis.
 *                Default: [d => d3.rgb(d,0,0), d => d3.rgb(0,d,0), d => d3.rgb(0,0,d)];
 * cs.data      - Data to use for each channel.
 *                Default: [d3.range(0,256), d3.range(0,256), d3.range(0,256)];
 * cs.init      - Initial values for each channel
 *                Default: [0,0,0];
 * cs.formats   - d3.format() specifier for each channel
 *                Default: ['d','d','d'];    // all integers
 * cs.depends   - keys of channels that depend on this channel (example: [['s','l'], [], []] for HSL
 *                Default: [[],[],[]]; // three independent axes for RGB
 *                Note: this currently doesn't work for channels that depend on multiple channels (e.g. LAB)
 */

const height=180, width=850, margin = 50;
export const cs = {}

// Color space specific data - Defaults are RGB space
cs.create = d3.rgb;
cs.keys = ["r", "g", "b"];
cs.domains = [[0,255],[0,255],[0,255]];
cs.ticks =   [[0,64,128,192,255],[0,64,128,192,255],[0,64,128,192,255]];
cs.data = [d3.range(0,256), d3.range(0,256), d3.range(0,256)];
cs.init = [0,0,0];
cs.formats = ['d','d','d'];
cs.depends = [[],[],[]]; // three independent axes

/**
 * Initialize
 */
export function init() {
    d3.select("body").append("svg").attr("width", width).attr("height", height);

    cs.functions = [d => cs.create(d,cs.init[1],cs.init[2]),
        d => cs.create(cs.init[0],d,cs.init[2]),
        d => cs.create(cs.init[0],cs.init[1],d)];

    cs.scales = [d3.scaleLinear().range([margin,562]).domain(cs.domains[0]),
        d3.scaleLinear().range([margin,562]).domain(cs.domains[1]),
        d3.scaleLinear().range([margin,562]).domain(cs.domains[2])]

    cs.axes = [d3.axisBottom(cs.scales[0]).tickValues(cs.ticks[0]).tickSize(10),
        d3.axisBottom(cs.scales[1]).tickValues(cs.ticks[1]).tickSize(10),
        d3.axisBottom(cs.scales[2]).tickValues(cs.ticks[2]).tickSize(10)];

    cs.channel  = new Map();
    cs.keys.forEach((key,i) => {
        cs.channel.set(key,{
            pos: i*60,
            cursor: cursor(cs.scales[i](cs.init[i])-5,30 + i*60),
            selected: false,
            value: cs.init[i],
            init: cs.init[i],
            scale: cs.scales[i],
            format: cs.formats[i],
            depend: cs.depends[i],
            func: cs.functions[i]
        });
    });

    // Render the color scales
    for(let i = 0; i < cs.keys.length; i++) {
        drawScale(cs.scales[i],
            cs.axes[i],
            cs.data[i],
            cs.functions[i],
            cs.keys[i]);
    }

    drawColorBox();
}

/**
 * Cursor to select a color
 * @param x
 * @param y
 * @returns {*}
 */
function cursor(x,y) {
    return d3.select("svg")
        .append("g")
        .attr("class","selector")
        .attr("transform", `translate(${x},${y})`)
        .append("polygon")
        .attr("points", '0,10 5,0 10,10')
}

/**
 * Creates a color representation
 * @param key
 * @param d
 * @returns {*}
 */
function createColor(key, d) {
    if(key) {
        return cs.create(key === cs.keys[0] ? d : cs.channel.get(cs.keys[0]).value,
            key === cs.keys[1] ? d : cs.channel.get(cs.keys[1]).value,
            key === cs.keys[2] ? d : cs.channel.get(cs.keys[2]).value)
    }
    return cs.create(cs.channel.get(cs.keys[0]).value,
        cs.channel.get(cs.keys[1]).value,
        cs.channel.get(cs.keys[2]).value);
}

/**
 * Draws a composite color
 */
function drawColorBox() {
    const color = createColor();
    const box = d3.select("svg")
        .append("g")
        .attr("class", "color")
        .attr("transform", "translate(660,10)")
    box.append("rect")
        .attr("width", 140)
        .attr("height", 140)
        .style("fill", color)
    box.append("text")
        .attr("y",160)
        .attr("x", 70)
        .text(color.formatHex())
}

/**
 * Draws a picker axis
 * @param scale
 * @param axis
 * @param data
 * @param func
 * @param key
 */
function drawScale(scale, axis, data, func, key) {
    const comp = cs.channel.get(key);
    const g = d3.select("svg")
        .append("g")
        .call(axis)
        .attr("transform",`translate(0,${30 + comp.pos})`);

    g.selectAll("rect").data(data).join("rect")
        .attr("class", key)
        .attr("width",2.6).attr("height",20)
        .attr("x", d => scale(d) - 1.3).attr("y",-20)
        .style("fill", func)
        .on("mouseover", showComponent)
        .on("mouseout", clearComponent)
        .on("mouseup", toggleSelection)
        //.each(d => {d.f = func(d); console.log(d)}); // save color

    g.append("text").attr("class", "label")
        .attr("x", 570).attr("y",-5)
        .text(key.toUpperCase())

    g.append("text").attr("class", key)
        .attr("x", 620).attr("y",-5)
        .text(d3.format(comp.format)(comp.init))
}

/**
 * Called when user enters a user cell
 * @param event
 * @param d
 */
function showComponent(event, d) {
    const rect = d3.select(event.target);
    const key = rect.attr("class");
    const comp = cs.channel.get(key);
    const color = createColor(key, d);
    if(!comp.selected) {
        comp.cursor.attr("transform", `translate(${rect.attr("x") - comp.scale(comp.init)},0)`);
        d3.select(`text.${key}`).text(d3.format(comp.format)(d));

        // color other boxes
        d3.select(".color rect")
            .style("fill", color)
        d3.select(".color text")
            .text(color.formatHex())

        // Works for channels that depend on a single channel (doesn't work for lab)
        comp.depend.forEach(dep => {
            d3.selectAll(`rect.${dep}`)
                .style("fill", k => {
                    const f = cs.channel.get(dep).func(k);
                    f[key] = d;
                    return f;
                })
        });

    } else {
        d3.select(`text.${key}`).text(d3.format(comp.format)(comp.value));
    }
}

/**
 * Called when user leaves a color cell
 * @param event
 */
function clearComponent(event) {
    const rect = d3.select(event.target);
    const key = rect.attr("class");
    const comp = cs.channel.get(key);
    const color = createColor();
    if (comp.selected) {
        d3.select(`text.${key}`).text(d3.format(comp.format)(comp.value));
    } else {
        comp.cursor.attr("transform", `translate(0,0)`)
        d3.select(`text.${key}`).text(d3.format(comp.format)(comp.init));
    }
    d3.select(".color rect")
        .style("fill", color)
    d3.select(".color text")
        .text(color.formatHex())
}

/**
 * Selects and unselects a color. Called when user clicks a color cell.
 * @param event
 * @param d
 */
function toggleSelection(event, d) {
    const rect = d3.select(event.target);
    const key = rect.attr("class");
    const component = cs.channel.get(key);
    if (component.selected) {
        component.selected = false;
        component.value = cs.channel.get(key).init;
    } else {
        component.selected = true;
        component.value = d;
    }
}
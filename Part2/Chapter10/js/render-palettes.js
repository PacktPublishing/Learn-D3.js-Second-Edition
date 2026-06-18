import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';

export { renderSchemeOrdinal, renderSchemeSequential };

function renderSchemeOrdinal(obj, index) {

    const isCategorical = d3[obj.scheme][0] != null; // hue arrays-of-arrays have three initial elements == null
    const arr = isCategorical ? d3[obj.scheme] : d3[obj.scheme][obj.size];
    const name = isCategorical ? `d3.${obj.scheme}` : `d3.${obj.scheme}[${obj.size}]`;

    const scale = d3.scaleOrdinal(arr);
    const data = d3.range(0, obj.size);

    const dimensions = {h: 15, w: 20, marg: 180, xx: 25}; // parameters for display

    generate(index, name, scale, data, dimensions, true);
}

function renderSchemeSequential(obj, index) {

    const func = d3[obj.scheme];
    const name = `d3.${obj.scheme}`;

    const scale = d3.scaleSequential(func).domain([0,obj.size]);
    const data  = d3.range(0,obj.size,obj.step);

    const dimensions = {h: 20, w: 4.5, marg: obj.size, xx: 1}; // parameters for display

    generate(index, name, scale, data, dimensions, false);
}

function generate(index, name, scale, data, dim, textBefore) {

    const g = d3.select("svg")
                .append("g")
                  .attr("transform", `translate(25,${index * 25})`);

    g.selectAll("rect")
      .data(data)
        .join("rect")
          .attr("height", dim.h)
          .attr("width", dim.w)
          .attr("x", d => textBefore ? d * dim.xx + dim.marg : d * dim.xx)
          .style("fill", scale);

    g.append("text")
        .attr("x", textBefore ? 0 : dim.marg + 10)
        .attr("y", 14)
        .text(name);
}

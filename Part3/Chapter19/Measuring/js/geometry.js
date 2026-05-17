import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export {showMeasure, showArea, hide, setupTooltip, measureLog, interpolateLog};

const format = d3.format(',.0f');
let map = {};

// Tooltip for title and two values
function setupTooltip(mapData, width = 60, height = 55, dataFields = 2) {
    map = mapData;
    const tooltip = map.view.append("g").attr("class", "tooltip")
        .attr("transform", `translate(-100,-100)`) // hide by default
    tooltip.append("rect").attr("rx",5).attr("ry",5)
        .attr("x",-width/2).attr("y",-height/2)
        .attr("height",height).attr("width",width)
        .style("fill",'black').style("fill-opacity",.5);

    tooltip.append("text")
        .each(function() {
            d3.select(this).append("tspan").attr("y",-height/4).style("font-size", "120%")   // id
            for(let i = 0; i < dataFields; i++) {
                d3.select(this).append("tspan").attr("x", 0).attr("dy", 15);
            }
        })
        .style("fill", "white")
        .attr("text-anchor", "middle");
}


// Tooltip event handlers
function showArea(evt, d) { console.log(this)
    areaLog(d);

    // Compute values
    const steradians = 4 * Math.PI; // steradians in a perfect sphere
    const earth = 510072000; // area of the earth
    const sqkm = d3.geoArea(d) / steradians * earth;
    const sqmiles = sqkm * 0.386102;

    // Highlight the feature and print pixel area, and geo area in km^2 and miles^2
    map.view.select(".tooltip").raise()
        .style("opacity", 1)
        .attr("transform", `translate(${d3.pointer(evt)})`);
    map.view.select(".tooltip text").selectAll("tspan")
        .text((_, i) => i === 0 ? d.id :
                        i === 1 ? format(sqkm) + " km²" :
                        i === 2 ? format(sqmiles) + " miles²" :
                        format(map.geoPath.area(d)) + " pixels²");

    d3.select(this).classed("selected", true);
}

function showMeasure(evt, d) {
    measureLog(d);
    interpolateLog(d);

    // Compute values
    const radians = 2 * Math.PI; // radians in 180 deg
    const earth = 40075; // circumference of the earth
    const km = d3.geoLength(d) / radians * earth;
    const miles = km * 0.621371;

    // compute middle of the line
    const interpolator = d3.geoInterpolate(d.coordinates[0], d.coordinates[1]);
    const geoMiddle = interpolator(0.5);
    const middle = map.projection(geoMiddle);

    // Show tooltip at the middle of the line, with route id and length in km and miles
    map.view.select(".tooltip").raise()
        .style("opacity", 1)
        .attr("transform", `translate(${middle})`);
    map.view.select(".tooltip text").selectAll("tspan")
        .text((_, i) => i === 0 ? d.id :
            i === 1 ? format(km) + " km" :
                format(miles) + " miles");

    // if the line was resampled, get the central coordinates
    if (d.coordinates.length > 2) {
        const middle = d.coordinates[Math.floor(d.coordinates.length / 2)];
        map.view.select(".tooltip").attr("transform", `translate(${map.projection(middle)})`);
    }

    d3.select(this).classed("selected", true);
}

function hide() {
    d3.select(this).classed("selected", false);
}

// Console log functions - testing measure(), geoLength(), geoDistance(), geoArea() and geoInterpolate()
function measureLog(d) {
    console.log('---------\nRoute', d.id);
    console.log('coordinates: ', d.coordinates);
    console.log('measure (in projection):', map.geoPath.measure(d) + " pixels"); // length of the line in pixels
    console.log('geoLength (absolute):', d3.geoLength(d) + " radians"); // same as geoLength, with GeoJSON as source
    if(d.coordinates.length === 2) {
        console.log('geoDistance (absolute):', d3.geoDistance(d.coordinates[0], d.coordinates[1]) + " radians"); // same as geoLength (with points as source)
    } else { // if the line was resampled, sum the distances between consecutive points
        let totalDistance = 0;
        for(let i = 0; i < d.coordinates.length - 1; i++) {
            totalDistance += d3.geoDistance(d.coordinates[i], d.coordinates[i + 1]);
        }
        console.log('geoDistance (absolute, resampled):', totalDistance + " radians");
    }
 }

function areaLog(d) {
    console.log('---------\nFeature', d.id);
    console.log('geoArea', map.geoPath.area(d), d3.geoArea(d));
    console.log("area (in projection)", map.geoPath.area(d) + " pixels^2");
}

function interpolateLog(d) {
    console.log('geo coordinates', d.coordinates);
    console.log('pix coordinates', map.projection(d.coordinates[0]), map.projection(d.coordinates[1]));
    // Compute middle of the line
    const interpolator = d3.geoInterpolate(d.coordinates[0], d.coordinates[1]);
    const geoMiddle = interpolator(0.5);
    console.log('middle geo [Lon, Lat] (absolute)', geoMiddle); // geo coords

    const middle = map.projection(geoMiddle);
    console.log('middle pix [x,y] (in projection)', middle); // pixel coords
}
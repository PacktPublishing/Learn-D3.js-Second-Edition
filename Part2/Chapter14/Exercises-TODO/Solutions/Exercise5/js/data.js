import * as d3 from 'https://cdn.skypack.dev/d3@7.9.0';

import {app} from './common.js';

// Base URL is the Chapter directory
const baseURL = "../../..";
const dataFile = baseURL + "/data/un_regions_2017.csv";

export async function load() {
    app.data.countries = await d3.csv(dataFile, function(row) {
        if(+row.HDI_2017 > 0 && +row.GDP_PPP_2017 > 0 && +row.Pop_2016 > 0) {
            return {
                name: row.Country,
                continent: row.Continent,
                hdi: +row.HDI_2017,
                gdp: +row.GDP_PPP_2017,
                pop: +row.Pop_2016
            }
        }
    });
    config();
    return app;
}

function config() {
    const continents = new Set(d3.map(app.data.countries, d => d.continent));
    app.data.continents = d3.sort(continents, d3.ascending);
    app.data.countries.sort((a,b) => d3.descending(a.pop, b.pop));  // sort countries

    app.scale.x.domain(d3.extent(app.data.countries, d => d.hdi));
    app.scale.y.domain(d3.extent(app.data.countries, d => d.gdp));
    app.scale.r.domain(d3.extent(app.data.countries, d => d.pop));
}
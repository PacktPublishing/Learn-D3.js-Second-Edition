import * as d3 from 'https://cdn.skypack.dev/d3@7';

import {app} from './common-1.1.js';

const file = "../../data/un_regions_2017.csv";

export async function load() {
    app.data.countries = await d3.csv(file, function(row) {
        if(+row.HDI_2017 > 0 && +row.GDP_PPP_2017 > 0) {
            return {
                name: row.Country,
                hdi: +row.HDI_2017,
                gdp: +row.GDP_PPP_2017
            }
        }
    });

    config();

    return app;
}

function config() {
    app.scale.x.domain(d3.extent(app.data.countries, d => d.hdi));
    app.scale.y.domain(d3.extent(app.data.countries, d => d.gdp));
}
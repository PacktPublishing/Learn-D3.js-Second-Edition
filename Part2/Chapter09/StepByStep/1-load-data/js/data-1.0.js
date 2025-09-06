import * as d3 from 'https://cdn.skypack.dev/d3@7';

const file = "../../data/un_regions_2017.csv";

export async function load() {
    return d3.csv(file, function(row) {
        if(+row.HDI_2017 > 0 && +row.GDP_PPP_2017 > 0) {  // rows with zero values will not be returned
            return {
                name: row.Country,
                hdi: +row.HDI_2017,
                gdp: +row.GDP_PPP_2017
            }
        }
    });
}
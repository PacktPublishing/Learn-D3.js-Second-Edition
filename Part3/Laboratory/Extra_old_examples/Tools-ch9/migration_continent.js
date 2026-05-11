const fs = require('fs');
const Papa = require('papaparse');

const source = '../Data/annual_gdp_current_usd.csv';
const target = '../Data/annual_gdp_current_usd.json';

fs.readFile(source, 'utf8', (err, data) => {
    if(err) {
        throw err;
    } else {
        Papa.parse(data, {
            complete: process,
            header: true
        });
    }
})

function process(results) {
    const data = results.data.filter(d => +d.Category == 1)
                             .map(function(d) {
        const values = [];
        for(let year = 1990; year <= 2017; year++) {
            values.push({Year: year, GDP: +d[''+year]})
        }
        return {
            Country: d.Country,
            Code: d.Code,
            Values: values
        };
    });
    writeFile(JSON.stringify(data));
}

function writeFile(data) {
    fs.writeFile(target, data, (err) => {
        if(err) throw err;
        console.log('Done')
    });
}
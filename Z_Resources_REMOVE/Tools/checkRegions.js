// load un_gdp_2024.csv and un_regions_gdp.csv

const Papa = require('papaparse');
const fs = require('fs');

const file = 'data/un_gdp_with_regions.csv';

const p = new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, data) => {
        if(err) {
            reject(err)
        }else {
            Papa.parse(data, {
                complete: function(results) {
                    resolve(results.data)
                },
                header: true
            });
        }
    })
})

p.then(data => {

    console.log("File", data)

    const empty = [];

    data.forEach(function(d) {
        if (!d.Continent) {
            empty.push(d.Country);
        }
    });
    console.log("EMPTY", new Set(empty), [...new Set(empty)].length);
});

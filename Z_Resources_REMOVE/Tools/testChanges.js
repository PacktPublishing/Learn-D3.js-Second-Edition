// load un_gdp_2024.csv and un_regions_gdp.csv

const Papa = require('papaparse');
const fs = require('fs');

const source2 = 'data/un_gdp_usdollars.csv';    // test
const source3 = 'data/un_gdp_with_regions.csv'; // test
const source4 = 'data/un_gdp_with_codes.csv';    // test
const source5 = 'data/un_gdp.csv'; // test

console.log("Running")

const files = [source1, source2, source3, source4, source5].map(f => {
    return new Promise((resolve, reject) => {
        fs.readFile(f, 'utf8', (err, data) => {
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
})
Promise.all(files).then(data => {

    // print value for Japan in 1970 in each file
    console.log("Japan 1970")
    console.log("File1", data[0].filter(d => d.Country == 'Japan' && d.Year == '1970'))
    console.log("File2", data[1].filter(d => d.Country == 'Japan' && d.Year == '1970'))
    console.log("File3", data[2].filter(d => d.Country == 'Japan' && d.Year == '1970'))
    console.log("File4", data[3].filter(d => d.Country == 'Japan' && d.Year == '1970'))
    console.log("File5", data[4].filter(d => d.Country == 'Japan' && d.Year == '1970'))

});

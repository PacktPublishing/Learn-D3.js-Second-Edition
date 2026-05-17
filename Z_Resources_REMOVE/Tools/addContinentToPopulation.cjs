// load un_gdp_2024.csv and un_regions_gdp.csv

const Papa = require('papaparse');
const fs = require('fs');

const source1 = 'data/country_a3code_continent.csv'; // copy from
const source2 = 'data/un_population_2025.csv';       // change

const target = 'data/un_population_continents_2025.csv'// save

const files = [source1, source2].map(f => {
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

    console.log("File1", data[0])
    console.log("File2", data[1])

    const newData = [];
    const newDataOrg = [];

   data[0].forEach(function(d) { // Country,Code,Continent -> Code is Alpha3
        data[1].forEach(function(e) { // Index,Country,Code,Alpha3,Population -> Add Continent here
            if (e.Alpha3 === d.Code) { // Found the country in the population data
                e.Continent = d.Continent;
            }
        });
    });
    writeFile(Papa.unparse(data[1]));
});

function writeFile(data) {
    fs.writeFile(target, data, (err) => {
        if(err) throw err;
        console.log('Done')
    });
}
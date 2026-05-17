// load un_gdp_2024.csv and un_regions_gdp.csv

const Papa = require('papaparse');
const fs = require('fs');

const source1 ='data/un_population_continents_2025.csv'; // copy from
const source2 = 'data/migrations_2024_plus.csv';    // change

const target = 'data/migrations_2024_continents.csv' // save

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

    //console.log("File1", data[0])
    //console.log("File2", data[1])

   data[0].forEach(function(d) { // Country,Code,Alpha3,Population,Continent
        data[1].forEach(function(e) { // migrations_2024_new.csv
            if (+d.Code === +e.DestCode) {
                e.DestContinent = d.Continent;
                e.DestPopulation = d.Population;
            }
            if (+d.Code === +e.OrigCode) {
                e.OrigContinent = d.Continent;
                e.OrigPopulation = d.Population;
            }
            if(e.Origin === 'Others') {
                e.OrigContinent = 'World';
                e.OrigPopulation = 0;
            }
            if(e.Destination === 'Others') {
                e.DestContinent = 'World';
                e.DestPopulation = 0;
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
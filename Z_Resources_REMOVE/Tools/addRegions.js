// load un_gdp_2024.csv and un_regions_gdp.csv

const Papa = require('papaparse');
const fs = require('fs');

const source1 ='data/un_regions_gdp.csv'; // copy from
const source2 = 'data/un_gdp_usdollars.csv';    // change

const target = 'data/un_gdp_with_regions.csv'; // save

console.log("Running")

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
    const changes = [];
    const nothing = [];

    const caribbean = ["Anguilla", "Netherlands Antilles", "Sint Maarten (Dutch part)", "Montserrat"];
    const europe = ["Czechoslovakia", "Yugoslavia"];
    const asia = ["USSR", "South Yemen", "North Yemen"];
    const oceania = ["Cook Islands"];
    const africa = ["Zanzibar"];

    data[0].forEach(function(d) {
        data[1].forEach(function(e) {
            if (e.Country == d.Country) {
                found = true;
                if(e.Continent == '') {
                    e.Continent = d.Continent;
                    newData.push(e.Country);
                } else if (e.Continent != d.Continent) {
                    changes.push(e.Country);
                    e.Continent = d.Continent;
                } else {
                    nothing.push(e.Country);
                }
            } else if (caribbean.includes(e.Country)) {
                e.Continent = 'North America';
            } else if (europe.includes(e.Country)) {
                e.Continent = 'Europe';
            } else if (asia.includes(e.Country)) {
                e.Continent = 'Asia';
            } else if (oceania.includes(e.Country)) {
                e.Continent = 'Oceania';
            } else if (africa.includes(e.Country)) {
                e.Continent = 'Africa';
            }
        });
    });

    console.log("CHANGES", new Set(changes));
    console.log("NEWDATA", new Set(newData));
    console.log("NOTHING", new Set(nothing));

    writeFile(Papa.unparse(data[1]));
});

function writeFile(data) {
    fs.writeFile(target, data, (err) => {
        if(err) throw err;
        console.log('Done')
    });
}
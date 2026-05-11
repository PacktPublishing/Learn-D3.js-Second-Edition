
const fs = require('fs');
const Promise = require('promise');
const Papa = require('papaparse');

const source1 = '../Data/airports.csv';
const source2 = '../Data/busiest-airports.csv';
const target = '../Data/airports-busiest.csv';

const files = [source1, source2].map(f => {
    return new Promise((resolve, reject) => {
        fs.readFile(f, 'utf8', (err, data) => {
            if(err) {
                reject(err)
            } else {
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
    const newData = [];
    const matches = [];

    const busiest = data[1];
    const all = data[0];
    const result = [];

    all.forEach(function(a) {
        let match = false;
        busiest.forEach(function(b) {
            if (a.IATA == b.iata) {
                match = true;
                const obj = {
                    iata: a.IATA,
                    latitude: a.Latitude,
                    longitude: a.Longitude,
                    name: a.Name,
                    city: a.City,
                    country: a.Country,
                    region: a.TZ.split('/')[0],
                    rank: b.rank,
                    passengers: b.passengers,
                    year: 2017
                }
                result.push(obj);
                newData.push(a.IATA);
            } 
        });
        if(!match) {
            matches.push(a.IATA);
        }
    });
    
    console.log("NO MATCHES", matches.length);
    console.log("NEWDATA", newData.length);

    writeFile(Papa.unparse(result));
});

function writeFile(data) {
    fs.writeFile(target, data, (err) => {
        if(err) throw err;
        console.log('Done')
    });
}
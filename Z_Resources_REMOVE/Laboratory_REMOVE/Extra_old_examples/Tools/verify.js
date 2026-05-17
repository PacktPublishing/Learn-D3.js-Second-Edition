const fs = require('fs');
const Promise = require('promise');
const Papa = require('papaparse');

const source1 = '../Data/hdi.csv';
const source2 = '../Data/un_regions.csv';
const target = '../Data/un_regions.csv';

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

    const changes = [];
    const newData = [];
    const nothing = [];
    data[0].forEach(function(d) {
        data[1].forEach(function(e) {
            if (e.Country == d.Country) {
                if(e.HDI_2017 == '') {
                    e.HDI_2017 = d.HDI;
                    newData.push(e.Country);
                } else if (e.HDI_2017 != d.HDI) {
                    e.DIFF = +d.HDI - +e.HDI_2017;
                    changes.push(e.Country + ": " + e.DIFF);
                    e.HDI_2017 = d.HDI;
                } else {
                    nothing.push(e.Country);
                }
            }
        });
    });
    
    console.log("CHANGES", changes);
    console.log("NEWDATA", newData);
    console.log("NOTHING length", nothing.length);

});
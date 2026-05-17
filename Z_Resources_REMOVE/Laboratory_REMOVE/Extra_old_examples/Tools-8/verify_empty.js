const fs = require('fs');
const Promise = require('promise');
const Papa = require('papaparse');

const file = '../Data/un_regions.csv';

fs.readFile(file, 'utf8', (err,data) => {
    Papa.parse(data, {
        complete: function(results) {
            results.data.forEach(function(d) {
                if(d.HDI_2017 == '') {
                    console.log(d.Country);
                }
            })
        },
        header: true
    });
});
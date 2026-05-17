// load un_gdp_2024.csv and un_regions_gdp.csv

const Papa = require('papaparse');
const fs = require('fs');

const source1 ='data/codes.csv'; // copy from
const source2 = 'data/un_gdp_with_regions.csv';    // change

const target = 'data/un_gdp.csv'// 'data/un_gdp_with_regions.csv'; // save

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

    data[0].forEach(function(d) {
        data[1].forEach(function(e) {
            if (e.Country == d.name) {
                found = true;
                if(e.Code == '') {
                    e.Code = d.alpha3;
                    newData.push(e.Country);
                } else if (e.Code != d.alpha3) {
                    changes.push(e.Country);
                    e.Code = d.alpha3;
                } else {
                    nothing.push(e.Country);
                }
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
const fs = require('fs');
const Promise = require('promise');
const Papa = require('papaparse');

const source1 = '../Data/area.csv'; // copy from
const source2 = '../Data/un_regions.csv'; // change
const target = '../Data/un_regions.csv'; // save

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
            if (e.Code == d.Code) {
                found = true;
                if(e.Area_km2 == '') {
                    e.Area_km2 = d.Area;
                    newData.push(e.Country);
                } else if (e.Area_km2 != d.Area) {
                    //e.DIFF = (+d.Area - +e.Area_km2) / d.Area * 100;
                    changes.push(e.Country);
                    e.Area_km2 = d.Area;
                } else {
                    nothing.push(e.Country);
                }
            }
        });
    });
    
    console.log("CHANGES", changes);
    console.log("NEWDATA", newData);
    console.log("NOTHING", nothing);

    writeFile(Papa.unparse(data[1]));
});

function writeFile(data) {
    fs.writeFile(target, data, (err) => {
        if(err) throw err;
        console.log('Done')
    });
}
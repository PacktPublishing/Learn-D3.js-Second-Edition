
const fs = require('fs');
const Promise = require('promise');
const Papa = require('papaparse');

const source1 = '../Data/airports-busiest.csv';
const source2 = '../Data/routes.csv';
const target = '../Data/routes-busiest.csv';

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

    const airports = data[0];
    const routes = data[1];
    const result = routes
        .filter(r => airports.map(a => a.iata).indexOf(r.Source) > 0 ||
                     airports.map(a => a.iata).indexOf(r.Destination) > 0)
    const reduced = result.map(function(e) {
        return {
            airline: e.Airline,
            source: e.Source,
            target: e.Destination
        }
    })                 

    const routeMap = new Map();

    reduced.forEach(function(route) {
        const key = route.source + '-' + route.target;
        const airlines = routeMap.get(key);
        if(airlines) {
            airlines.push(route.airline);
        } else {
            routeMap.set(key, [route.airline])
        }
    })

    const routes2 = [];
    for(const [k,v] of routeMap.entries()) {
        routes2.push(
                {
                    id: k,
                    source: k.split('-')[0],
                    target: k.split('-')[1],
                    airlines: v.length
                }
        )
    }
    routes2.sort((a,b) => b.airlines - a.airlines)

    console.log("RESULT", routes2);

    writeFile(Papa.unparse(routes2));
});

function writeFile(data) {
    fs.writeFile(target, data, (err) => {
        if(err) throw err;
        console.log('Done')
    });
}
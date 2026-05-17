// Node.js script to filter migrations based on a specific pattern
// Remove rows where OrigCode is one of [900,1834,1829,901,902,941,934,948,1636,5503,5504,1503,1859,1517,1501,1500,903,910,908,926,922]

const source1 = '../Part3/Chapter16/data/migrations_2024_raw.csv';
const target = '../Part3/Chapter16/data/migrations_2024_new.csv';

// Write a script to load and parse the migrations_2024_plus.csv file, using d3
import fs from 'fs';
import * as d3 from 'd3';

fs.readFile(source1, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    const notCountries = [
        900,  901,  902,  903,  904,  905,  906,
        908,  909,  910,  911,  912,  913,  914, 915, 916,
        920,  922,  923,  924,  925,  926,  927,
        928,  931,  934,  935,  941,  948,  954,
        957, 1500, 1501, 1502, 1503, 1517, 1518,
        1636, 1637, 1829, 1830, 1831, 1832, 1833,
        1834, 1835, 1836, 1859, 5500, 5501, 5503, 5504
    ];

    console.log('Countries to filter out:', notCountries);
    const rows = d3.dsvFormat(";").parse(data, row => {
        // Convert numeric fields to numbers
        row.OrigCode = +row.OrigCode;
        row.DestCode = +row.DestCode;

        return !(notCountries.includes(row.OrigCode) || notCountries.includes(row.DestCode))  ? row : null;
    });

    console.log('Number of rows after filtering:', rows.length);

    // Remove asterisks (*) from the 'Origin' and 'Destination' fields
    // Replace the following Strings with the corresponding short name
    const replacements = {
        'United States of America': 'USA',
        'United Kingdom': 'UK',
        'Russian Federation': 'Russia',
        'Czech Republic': 'Czechia',
        'Republic of Korea': 'South Korea',
        'Dem. People\'s Republic of Korea': 'North Korea',
        'Democratic Republic of the Congo': 'DR Congo',
        'Republic of the Congo': 'Congo',
        'Viet Nam': 'Vietnam',
        'Bolivia (Plurinational State of)': 'Bolivia',
        'Iran (Islamic Republic of)': 'Iran',
        'Lao People\'s Democratic Republic': 'Laos',
        'Syrian Arab Republic': 'Syria',
        'Venezuela (Bolivarian Republic of)': 'Venezuela',
        'Republic of Moldova': 'Moldova',
        'North Macedonia': 'Macedonia',
        'United Republic of Tanzania': 'Tanzania',
        'State of Palestine': 'Palestine',
        'China, Hong Kong SAR': 'Hong Kong',
        'China, Macao SAR': 'Macao',
        'China, Taiwan Province of China': 'Taiwan',
        'United Arab Emirates': 'UAE',
        'Brunei Darussalam': 'Brunei',
    };
    rows.forEach(row => {
        if (row.Origin) {
            row.Origin = row.Origin.replace('*', '').trim();
            if (replacements[row.Origin]) {
                row.Origin = replacements[row.Origin];
            }
        }
        if (row.Destination) {
            row.Destination = row.Destination.replace('*', '').trim();
            if (replacements[row.Destination]) {
                row.Destination = replacements[row.Destination];
            }
        }
    });

    const csvContent = d3.csvFormat(rows);

    fs.writeFile(target, csvContent, (err) => {
        if (err) {
            console.error('Error writing file:', err);
        } else {
            console.log('Filtered data written to', target);
        }
    });
});
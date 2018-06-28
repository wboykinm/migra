// parse pp geojson format to geojson:
// USAGE: node propublica/index.js pp.geojson > propublica.geojson

"use strict"

let fs = require('fs')

let siteList = fs.readFileSync(process.argv[2])
let sites = (JSON.parse(siteList)).features

let outGeojson = {type: 'FeatureCollection', features: []}

for (let i = 0; i < sites.length; i++) {
  outGeojson.features.push({
    type: 'Feature', 
    properties: {
      name: sites[i].properties['FACILITY_NAME'] || '',
      description: '',
      agency: sites[i].properties['OPERATOR'] || '',
      address: sites[i].properties['ADDRESS_1'] || '',
      city: sites[i].properties['CITY'] || '',
      state: sites[i].properties['STATE'] || '',
      zip: sites[i].properties['ZIP'] || '',
      source: 'propublica',
      'marker-color': '#DE5B49', 
      'marker-size': 'medium', 
      'marker-symbol': 'c'
    }, 
    geometry: sites[i].geometry
  })
}

console.log(JSON.stringify(outGeojson))
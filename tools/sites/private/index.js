// USAGE: node private/index.js private.json > private.geojson

"use strict"

let fs = require('fs')

let siteList = fs.readFileSync(process.argv[2])
let sites = JSON.parse(siteList)

let outGeojson = {type: 'FeatureCollection', features: []}

for (let i = 0; i < sites.length; i++) {
  outGeojson.features.push({
    type: 'Feature', 
    properties: {
      name: sites[i]['DisplayName'] || '',
      description: '',
      address: '',
      city: sites[i]['city'] || '',
      state: sites[i]['State'] || '',
      zip: '',
      'marker-color': '#E37B40', 
      'marker-size': 'medium', 
      'marker-symbol': 'p'
    }, 
    geometry: { 
      type: 'Point', 
      coordinates: [ 
        parseFloat(sites[i].longitude), 
        parseFloat(sites[i].latitude)
      ]
    }
  })
}

console.log(JSON.stringify(outGeojson))
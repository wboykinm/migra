// parse ICE format to geojson:
// USAGE: node ice/index.js ice.json > ice.geojson

"use strict"

let fs = require('fs')

let siteList = fs.readFileSync(process.argv[2])
let sites = JSON.parse(siteList)

let outGeojson = {type: 'FeatureCollection', features: []}

for (let i = 0; i < sites.length; i++) {
  outGeojson.features.push({
    type: 'Feature', 
    properties: {
      name: sites[i].properties.name || '',
      description: '',
      agency: 'ICE',
      address: sites[i].properties.address || '',
      city: sites[i].properties.city || '',
      state: sites[i].properties.state || '',
      zip: sites[i].properties.zip || '',
      'marker-color': '#324D5C', 
      'marker-size': 'medium', 
      'marker-symbol': 'i'
    }, 
    geometry: { 
      type: 'Point', 
      coordinates: [ 
        sites[i].lon, 
        sites[i].lat
      ]
    }
  })
}

console.log(JSON.stringify(outGeojson))
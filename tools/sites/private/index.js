// USAGE: node private/index.js private.json > private.geojson
"use strict"

let fs = require('fs')
let request = require('request');

let siteList = fs.readFileSync(process.argv[2])
let sites = JSON.parse(siteList)
let urlBase = 'https://maps.googleapis.com/maps/api/geocode/json?key=';
let googleKey = 'AIzaSyAbR6bLYvyXcFQ2Cb-e3kr93zuUcYDWaZ8'
let outGeojson = {type: 'FeatureCollection', features: []}

for (let i = 0; i < sites.length; i++) {
  request(urlBase + googleKey + '&address=' + sites[i].name + '+,' + sites[i].city + '+,' + sites[i]['State'], function (error, response, body) {
    if (error) {
      console.error('encountered error', error instanceof Error ? error.stack : error);
    } else if (response.statusCode === 429) {
      console.log("It's a 429!")
    } else if (response.statusCode !== 200) {
      console.error('non-200 status code: ' + response.statusCode);
    } else {
      body = JSON.parse(body);
      var featurePoint = body.results[0];
      if (featurePoint) {
        if (featurePoint.geometry.location_type === 'APPROXIMATE') {
          outGeojson.features.push({
            type: 'Feature', 
            properties: {
              name: sites[i]['DisplayName'] || '',
              description: '',
              agency: 'Private',
              address: '',
              city: sites[i]['city'] || '',
              state: sites[i]['State'] || '',
              zip: '',
              source: 'wapo',
              'marker-color': '#46B29D', 
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
        } else {
          outGeojson.features.push({
            type: 'Feature', 
            properties: {
              name: sites[i]['DisplayName'] || '',
              description: '',
              agency: 'Private',
              address: featurePoint.formatted_address.split(',')[0] || '',
              city: sites[i]['city'] || '',
              state: sites[i]['State'] || '',
              zip: (featurePoint.formatted_address.split(',')[2]).split(' ')[1] || '',
              source: 'wapo',
              'marker-color': '#46B29D', 
              'marker-size': 'medium', 
              'marker-symbol': 'p'
            }, 
            geometry: { 
              type: 'Point', 
              coordinates: [ 
                featurePoint.geometry.location.lng || parseFloat(sites[i].longitude), 
                featurePoint.geometry.location.lat || parseFloat(sites[i].latitude)
              ]
            }
          })
        }
      }
    }
  });  
}

console.log(JSON.stringify(outGeojson))
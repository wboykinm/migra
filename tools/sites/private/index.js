// USAGE: node private/index.js private.json > private.geojson
"use strict"

let fs = require('fs')
let request = require('request');

let siteList = fs.readFileSync(process.argv[2])
let sites = JSON.parse(siteList)
let urlBase = 'https://maps.googleapis.com/maps/api/geocode/json?key=';
let googleKey = 'AIzaSyAbR6bLYvyXcFQ2Cb-e3kr93zuUcYDWaZ8'

function runFeature(site) {
  return new Promise(function(resolve, reject) {
    let featureNew = {
      type: 'feature',
      properties: {},
      geometry: {}
    }
    //console.log(urlBase + googleKey + '&address=' + site.name + '+,' + site.city + '+,' + site['State'])
    request(urlBase + googleKey + '&address=' + site.name + '+,' + site.city + '+,' + site['State'], function (error, response, body) {
      if (error) {
        console.error('encountered error', error instanceof Error ? error.stack : error);
        reject(error);
        return;
      } else if (response.statusCode === 429) {
        console.log("It's a 429!")
        reject(error);
        return;
      } else if (response.statusCode !== 200) {
        console.error('non-200 status code: ' + response.statusCode);
        reject(error);
        return;
      } else {
        body = JSON.parse(body);
        let featurePoint = body.results[0];
        if (featurePoint) {
          if (featurePoint.geometry.location_type === 'APPROXIMATE') {
            resolve({
              type: 'Feature', 
              properties: {
                name: site['DisplayName'] || '',
                description: '',
                agency: 'Private',
                address: '',
                city: site['city'] || '',
                state: site['State'] || '',
                zip: '',
                source: 'wapo',
                'marker-color': '#46B29D', 
                'marker-size': 'medium', 
                'marker-symbol': 'p'
              }, 
              geometry: { 
                type: 'Point', 
                coordinates: [ 
                  parseFloat(site.longitude), 
                  parseFloat(site.latitude)
                ]
              }
            })
          } else {
            resolve({
              type: 'Feature', 
              properties: {
                name: site['DisplayName'] || '',
                description: '',
                agency: 'Private',
                address: featurePoint.formatted_address.split(',')[0] || '',
                city: site['city'] || '',
                state: site['State'] || '',
                zip: (featurePoint.formatted_address.split(',')[2]).split(' ')[1] || '',
                source: 'wapo',
                'marker-color': '#46B29D', 
                'marker-size': 'medium', 
                'marker-symbol': 'p'
              }, 
              geometry: { 
                type: 'Point', 
                coordinates: [ 
                  featurePoint.geometry.location.lng || parseFloat(site.longitude), 
                  featurePoint.geometry.location.lat || parseFloat(site.latitude)
                ]
              }
            })
          }
        }
      }
    });
  })
}

Promise.all(sites.map(runFeature)).then(function(features) {
  console.log(JSON.stringify({ type: 'FeatureCollection', features })) 
})
// USAGE: node aois.js migra_sites.geojson <state_name> <buffer_distance_miles> > migra_aois.geojson
"use strict"

let fs = require('fs')
let turf = require('@turf/turf')

let siteList = fs.readFileSync(process.argv[2])
let stateList = fs.readFileSync('states.geojson')
let stateName = process.argv[3] || 'California'
let buffDist = process.argv[4] || 0

let sites = (JSON.parse(siteList)).features
let states = (JSON.parse(stateList)).features
let outPolys = { type: 'FeatureCollection', features: [] }

let statePoly = states.filter(function(state) {
  return state.properties.name === stateName
})

var buffered = turf.buffer(statePoly[0], buffDist, {units: 'miles'});

for (let i = 0; i < sites.length; i++) {
  if (turf.booleanContains(buffered,sites[i])) {
    let radius = turf.buffer(sites[i], 1, {units: 'miles'})
    let bbox = turf.bbox(radius);
    let bboxPoly = turf.bboxPolygon(bbox)
    bboxPoly.properties = sites[i].properties
    outPolys.features.push(bboxPoly)
  }
}

console.log(JSON.stringify(outPolys))
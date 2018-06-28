// USAGE: node aois.js migra_sites.geojson <state_abbreviation> <buffer_distance_meters> > migra_aois.geojson
"use strict"

let fs = require('fs')
let turf = require('@turf/turf')

let siteList = fs.readFileSync(process.argv[2])
let states = fs.readFileSync('states.geojson')
let sites = (JSON.parse(siteList)).features

let outPolys = { type: 'FeatureCollection', features: [] }

console.log(sites.length)
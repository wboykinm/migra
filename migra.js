// Set up the map
mapboxgl.accessToken = 'pk.eyJ1IjoibGFuZHBsYW5uZXIiLCJhIjoiY2pkZjJhb2hyMDJ3ejMxbnFmZmVjcGxuOSJ9._MLpfYFCOH0I-J0xWG7drw';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/landplanner/cjdf3ju46000y2srxyq585lhc',
    center: [-96, 37.8], // starting position
    zoom: 3, // starting zoom
    maxZoom: 9
});

// Add geolocate control to the map.
/*map.addControl(new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true
}));
*/

function jurisCheck() {
  // if no geo in browser, use btv center
  if (!navigator.geolocation){
    // do something with a default position
    console.log('no geo available')
  } else {
    // or use browser location
    navigator.geolocation.getCurrentPosition(function(position) {
      // check user position against CBP boundary
      var lat = position.coords.latitude
      var lon = position.coords.longitude
      var precision_m = position.coords.accuracy
      var point = map.project([lon, lat])
      //console.log(point)
      var feature = map.queryRenderedFeatures(point, { layers: ['operational-buffer-3-4atp68'] });
      //console.log(feature)
      if (feature[0].properties['ABBREV'] === 'U.S.A.') {
        // alter the answer text
        $('.payoff').empty().append('<h1>YES.</h1>')
        // reset map, with user location marker
      //} else if (some stuff about distance) {
        //$('.payoff').empty().append('<h1>MAYBE.</h1>')
      } else {
        $('.payoff').empty().append('<h1>NO.</h1>')
      }
    },function error() {
      // do something with a default position
      console.log('no geo available')
    });
  }
}
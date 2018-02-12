// Set up the map
mapboxgl.accessToken = 'pk.eyJ1IjoibGFuZHBsYW5uZXIiLCJhIjoiY2pkZjJhb2hyMDJ3ejMxbnFmZmVjcGxuOSJ9._MLpfYFCOH0I-J0xWG7drw';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/landplanner/cjdf3ju46000y2srxyq585lhc',
    center: [-96, 37.8], // starting position
    zoom: 3, // starting zoom
    maxZoom: 10
});

function jurisCheck() {
  $('#find').empty().append("Locating <i class='fa fa-circle-o-notch fa-spin'></i>")
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
      console.log(feature)
      
      if (feature.length > 0 && feature[0].properties['ABBREV'] === 'U.S.A.') {
        // alter the answer text
        $('.payoff').empty().append("<h1 class='display-1 text-center text-primary'>YES.</h1><p>You are within 100 miles of the border or coast, and are subject to the authority of the U.S. Agency of Customs and Border Protection (CBP).</p><p class='text-warning'>This is advisory information; it is not legally-binding.</p>")
        // reset map, with user location marker
      //} else if (some stuff about distance) {
        //$('.payoff').empty().append("<h1 class='display-2 text-center'>MAYBE.</h1>")
      } else {
        $('.payoff').empty().append("<h1 class='display-1 text-center text-primary'>NO.</h1><p>You are <i>not</i> within 100 miles of the border or coast, and are <i>not</i> subject to the authority of the U.S. Agency of Customs and Border Protection (CBP). </p><p class='text-warning'>This is advisory information; it is not legally-binding.</p>")
      }
      
      map.loadImage('ux-current-location.png', function(error, image) {
        if (error) throw error;
        map.addImage('user', image);
        map.addLayer({
          "id": "points",
          "type": "symbol",
          "source": {
            "type": "geojson",
            "data": {
              "type": "FeatureCollection",
              "features": [{
                "type": "Feature",
                "geometry": {
                  "type": "Point",
                  "coordinates": [lon, lat]
                }
              }]
            }
          },
          "layout": {
            "icon-image": "user",
            "icon-size": 0.25
          }
        });
      });
      map.flyTo({
        center: [lon, lat],
        zoom: 6.5,
        speed: 0.7
      });
    },function error() {
      // do something with a default position
      console.log('no geo available')
    });
  }
}
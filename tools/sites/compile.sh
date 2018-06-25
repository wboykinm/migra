# Compile a single GeoJSON file of known detention immigrant sites, from multiple sources

#########################################################################
# ICE
# Source: https://www.ice.gov/detention-facilities
rm -rf ice.json ice.geojson
wget https://gist.githubusercontent.com/wboykinm/084db68e180accd9960867a320956bc6/raw/3aa672530a98a5dbf5f7accfcd4e864b38e099ca/ice_sites.json -O ice.json

node ice/index.js ice.json > ice.geojson

#########################################################################
# CBP
# largely TODO
rm -rf cbp.json cbp.geojson

#########################################################################
# Private
# Source: https://www.washingtonpost.com/graphics/2018/national/migrant-child-shelters/
rm -rf private.json private.geojson
wget https://gist.githubusercontent.com/wboykinm/aa5b75963ba0c065a079f81e734ebccd/raw/2407de045603ac7fce0546ac3b02f2497f782d9e/migrant_child_facilities.json -O private.json

# TODO: Geocode sites
node private/index.js private.json > private.geojson

#########################################################################
#########################################################################
# Combine the lot
rm -rf migra_sites.geojson
npm install -g @mapbox/geojson-merge
geojson-merge *.geojson > migra_sites.geojson

rm -rf ice.json ice.geojson cbp.json cbp.geojson private.json private.geojson

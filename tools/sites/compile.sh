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
# node private/index.js private.json > private.geojson

#########################################################################
# Everything from "torn apart":
# rm -rm torn_apart.csv torn_apart.geojson
# wget http://xpmethod.plaintext.in/torn-apart/assets/data/iceFacs.csv

#########################################################################
# ProPublica's set:
rm -rf pp.geojson propublica.geojson
wget -c https://projects.propublica.org/graphics/data/migrant-shelters-near-you/places_geo.geojson -O pp.geojson

node propublica/index.js pp.geojson > propublica.geojson
rm -rf pp.geojson


#########################################################################
#########################################################################
# Combine the lot
rm -rf migra_sites.geojson
npm install -g @mapbox/geojson-merge
geojson-merge *.geojson > migra_sites.geojson

rm -rf ice.json ice.geojson cbp.json cbp.geojson private.json private.geojson pp.geojson propublica.geojson

#########################################################################
#########################################################################
# BUILD AOIS FOR CALIFORNIA

# Get state polygons from geojson.xyz
rm -rf data/states.geojson migra_aois.geojson
wget -c https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_admin_1_states_provinces_shp.geojson -O data/states.geojson

# example: get AOIs for sites around CA:
node aois.js migra_sites.geojson 'California' 2 > migra_aois.geojson


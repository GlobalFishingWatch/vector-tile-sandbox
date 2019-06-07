#!/bin/sh

# transporters
# tippecanoe data/chile/transporters.csv -o data/chile/transporters.mbtiles --force --layer=chile_transporters --no-tile-compression -zg -r1 --gamma=2

# rm -rf data/chile/transporters
# mb-util --image_format=pbf data/chile/transporters.mbtiles data/chile/transporters

# aquaculture
# tippecanoe data/chile/aquaculture.csv -o data/chile/aquaculture.mbtiles --force --layer=chile_aquaculture --no-tile-compression --maximum-zoom=12 --drop-densest-as-needed

# rm -rf data/chile/aquaculture
# mb-util --image_format=pbf data/chile/aquaculture.mbtiles data/chile/aquaculture

# panama_carriers

tippecanoe data/chile/panama_carriers.csv -o data/chile/panama_carriers.mbtiles --force --layer=panama_carriers --no-tile-compression --maximum-zoom=3 --maximum-zoom=6 --read-parallel --no-feature-limit --no-tile-size-limit -r1 cluster-distance=3

# --cluster-densest-as-needed 
# --cluster-distance=2
# --accumulate-attribute=timestamp:mean 
# --extend-zooms-if-still-dropping


echo 'tippecanoe done'

rm -rf data/chile/panama_carriers2
mb-util --image_format=pbf data/chile/panama_carriers.mbtiles data/chile/panama_carriers2 --silent
#!/bin/sh

# transporters
tippecanoe data/chile/transporters.csv -o data/chile/transporters.mbtiles --force --layer=chile_transporters --no-tile-compression --maximum-zoom=12 --drop-densest-as-needed

rm -rf data/chile/transporters
mb-util --image_format=pbf data/chile/transporters.mbtiles data/chile/transporters

# aquaculture
tippecanoe data/chile/aquaculture.csv -o data/chile/aquaculture.mbtiles --force --layer=chile_aquaculture --no-tile-compression --maximum-zoom=12 --drop-densest-as-needed

rm -rf data/chile/aquaculture
mb-util --image_format=pbf data/chile/aquaculture.mbtiles data/chile/aquaculture
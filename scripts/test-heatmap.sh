# start ts transporters:    1548979203
# start ts aquaculture:     1557226850
# start ts panama carriers: 1325376000

# precise ---
tippecanoe data/chile/transporters.csv -o data/heatmap/precise.mbtiles --force --layer=default --minimum-zoom=5 --maximum-zoom=5 --read-parallel --no-feature-limit --no-tile-size-limit -r1 -C 'node --max-old-space-size=8192 scripts/make-grid-tippecanoe.js $1 $2 $3 --startTimestamp=1548979203 --gridResolution=64 --timeResolution=hour  --debug=true'
rm -rf data/heatmap/precise
mb-util --image_format=pbf data/heatmap/precise.mbtiles data/heatmap/precise --silent

# playback ---
tippecanoe data/chile/transporters.csv -o data/heatmap/playback.mbtiles --force --layer=default --minimum-zoom=5 --maximum-zoom=5 --read-parallel --no-feature-limit --no-tile-size-limit -r1 -C 'node --max-old-space-size=8192 scripts/make-grid-tippecanoe.js $1 $2 $3 --startTimestamp=1548979203 --gridResolution=64 --timeResolution=day --aggregateUnits=30'
rm -rf data/heatmap/playback
mb-util --image_format=pbf data/heatmap/playback.mbtiles data/heatmap/playback --silent
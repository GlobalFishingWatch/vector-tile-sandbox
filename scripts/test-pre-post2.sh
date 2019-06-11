# start ts transporters:    1548979203
# start ts aquaculture:     1557226850
# start ts panama carriers: 1325376000 - 1453262400

# transporters 64 day ---
# tippecanoe data/chile/transporters.csv -o data/chile/transporters_day_64.mbtiles --force --layer=test --no-tile-compression --minimum-zoom=5 --maximum-zoom=5 --read-parallel --no-feature-limit --no-tile-size-limit -r1 -C 'node --max-old-space-size=8192 scripts/make-grid-tippecanoe.js $1 $2 $3 64 1548979203 day'

# rm -rf data/chile/transporters_day_64
# mb-util --image_format=pbf data/chile/transporters_day_64.mbtiles data/chile/transporters_day_64 --silent

# panama 64 day (+) ---
# tippecanoe data/chile/panama_carriers.csv -o data/chile/panama_carriers_day_64.mbtiles --force --layer=test --no-tile-compression --minimum-zoom=5 --maximum-zoom=5 --read-parallel --no-feature-limit --no-tile-size-limit -r1 -C 'node --max-old-space-size=8192 scripts/make-grid-tippecanoe.js $1 $2 $3 64 1325376000 day false true'

# rm -rf data/chile/panama_carriers_day_64
# mb-util --image_format=pbf data/chile/panama_carriers_day_64.mbtiles data/chile/panama_carriers_day_64 --silent


# panama 128 hour array ---
# --no-tile-compression
tippecanoe data/chile/panama_carriers.csv -o data/chile/panama_carriers_hour_128_arr.mbtiles --force --layer=test  --minimum-zoom=5 --maximum-zoom=5 --read-parallel --no-feature-limit --no-tile-size-limit -r1 -C 'node --max-old-space-size=8192 scripts/make-grid-tippecanoe.js $1 $2 $3 128 1325376000 day true false true'
echo 'tippecanoe ok'

rm -rf data/chile/panama_carriers_hour_128_arr
mb-util --image_format=pbf data/chile/panama_carriers_hour_128_arr.mbtiles data/chile/panama_carriers_hour_128_arr --silent

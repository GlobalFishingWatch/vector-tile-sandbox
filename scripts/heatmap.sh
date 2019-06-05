tippecanoe data/heatmap/heatmap_gridded_1M_5deg_15kitvs_ints.json -o data/heatmap/heatmap_gridded_1M_5deg_15kitvs_ints.mbtiles --force --layer=heatmap --no-tile-compression --no-tile-size-limit --no-feature-limit --maximum-zoom=3 --minimum-zoom=0 -r1

rm -rf data/heatmap/tiles
mb-util --image_format=pbf data/heatmap/heatmap_gridded_1M_5deg_15kitvs_ints.mbtiles data/heatmap/tiles
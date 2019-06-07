tippecanoe data/test.csv -o data/test.mbtiles --force --layer=test --no-tile-compression --maximum-zoom=3 --maximum-zoom=6 --read-parallel --no-feature-limit --no-tile-size-limit -r1 -C 'scripts/test-pre-post.js $1 $2 $3'

# 'node scripts/test-pre-post.js'

echo 'tippecanoe done'

rm -rf data/test
mb-util --image_format=pbf data/test.mbtiles data/test --silent
## Prerequisites

### For running tippecanoe

1. Install tippecanoe (https://github.com/mapbox/tippecanoe#installation)
2. Install mbutil (https://github.com/mapbox/mbutil#installation)
  - git clone git://github.com/mapbox/mbutil.git
  - cd mbutil
  - sudo python setup.py install
  
### For running Yarn

1. Install Yarn (Require Node)
2. Install ` npm install http-server -g` (https://www.npmjs.com/package/http-server)

## Generate

Use tippecanoe and mbutil. See `scripts/chile.sh` for an example:

```
# tippecanoe data/chile/transporters.csv -o data/chile/transporters.mbtiles --force --layer=chile_transporters --no-tile-compression --maximum-zoom=g --drop-densest-as-needed

# mb-util --image_format=pbf data/chile/transporters.mbtiles data/chile/transporters
```

NOTE: Make sure the data folder is on the root folder.

### generate random points

This is used to prepare dummy data for testing purposes.
It will generate a number of point features (avoiding landmass for a slightly more realistic effect), in a GeoJSON file. Each point has a random `datetime` timestamp property, as well as a random `type` ranging from 0 to 4.

```
node ./scripts/generate-random-points [path] [numFeatures]
node ./scripts/generate-random-points data/test.json 40000
```



## Serve 

```
yarn run server
```

## View
```
yarn run viewer
```

Use url params to load correct tileset:
- `dataset`: path to dataset, appended to local server url and prepended to zxy
- `sourceLayer`: matches tippecanoe param `--layer` 

http://localhost:9091/viewer/?dataset=chile/transporters&sourceLayer=chile_transporters

## Inspect a tile

```
./scripts/inspect-vector-tile.js data/chile/transporters_pbf/0/0/0.pbf
```
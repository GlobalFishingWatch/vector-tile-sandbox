## Prerequisites

1. Install tippecanoe
2. Install mbutil
  - git clone git://github.com/mapbox/mbutil.git
  - cd mbutil
  - sudo python setup.py install


## Generate

Use tippecanoe and mbutil. See `scripts/chile.sh` for an example:

```
# tippecanoe data/chile/transporters.csv -o data/chile/transporters.mbtiles --force --layer=chile_transporters --no-tile-compression --maximum-zoom=g --drop-densest-as-needed

# mb-util --image_format=pbf data/chile/transporters.mbtiles data/chile/transporters
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

http://localhost:9091/?dataset=chile/transporters&sourceLayer=chile_transporters

## Inspect a tile

```
./scripts/inspect-vector-tile.js data/chile/transporters_pbf/0/0/0.pbf
```
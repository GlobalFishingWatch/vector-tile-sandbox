var style = {
  "version": 8,
  "name": "Blank",
  "center": [-80, -10],
  "zoom": 3,
  "bearing": 0,
  "pitch": 0,
  "sources": {
      "countries": {
        "type": "geojson",
        "data": window.countries
      },
      "test": {
        "type": "geojson",
        "data": "https://gist.githubusercontent.com/nerik/96dd9747b5e1464f172cf2addf7f1185/raw/a14b5da8eb60cd5cf2c3c51788633174096ddec4/map.geojson"
      },
      "points": {
        "type": "vector",
        "maxzoom": 6,
        // tiles,
        "tiles": [
          "https://api-dot-world-fishing-827.appspot.com/v2/tilesets/test-chile-seconds-transport-v1/{z}%2F{x}%2F{y}.pbf"
        ]
      }
  },
  "layers": [
      {
          "id": "background",
          "type": "background",
          "paint": {"background-color": "rgba(0,0,0,0)"}
      },
      {
          "id": "countries",
          "type": "line",
          "source": "countries",
          "layout": {},
          "paint": {}
      },
      {
        "id": "test",
        "type": "line",
        "source": "test",
        "layout": {},
        "paint": {
          "line-color": "blue"
        }
      },
      {
        "id": "points",
        "type": "circle",
        "source": "points",
        "source-layer": "chile_transporters",
        // "source-layer": "chile_transport",
        "layout": {},
        "paint": {
          "circle-radius": 3,
          "circle-color": "hsl(0, 100%, 77%)"
        },
      //   "filter": [
      //     "all",
      //     [">", "timestamp", (new Date(2018, 0, 1).getTime()) / 1000],
      //     ["<", "timestamp", (new Date(2019, 0, 1).getTime()) / 1000]
      // ]
      }
  ]
}

var map = new mapboxgl.Map({
  container: 'map',
  style: style,
  hash: true
})
map.showTileBoundaries = true

// map.on('click', 'points', function (e) {
//   const feature = e.features[0]

//   console.log(e.features.map(f => f.properties))
// });


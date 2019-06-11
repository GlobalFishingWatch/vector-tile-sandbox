
var url = new URL(window.location)
var dataset = url.searchParams.get("dataset") || "chile/transporters"
var sourceLayer = url.searchParams.get("sourceLayer") || dataset.replace('/', '_')

const tiles = [`http://localhost:9090/${dataset}/{z}/{x}/{y}.pbf`]
console.log(tiles,sourceLayer)

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
      "points": {
        "type": "vector",
        "maxzoom": 6,
        tiles,
        // "tiles": [
        //   "https://api-dot-world-fishing-827.appspot.com/v2/tilesets/test-chile-seconds-transport-v1/{z}%2F{x}%2F{y}.pbf"
        // ]
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
        "id": "points",
        "type": "circle",
        "source": "points",
        "source-layer": sourceLayer,
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

map.on('click', 'points', function (e) {
  const feature = e.features[0]

  console.log(e.features.map(f => f.properties))
});

let start = new Date(2018, 0, 1).getTime()
let end = new Date(2019, 1, 1).getTime()
const INTERVAL = 89280000

let frame = 0
const applyFilter = () => {

  console.log(frame)
  start += INTERVAL
  end += INTERVAL

  // const filter = [
  //   "all",
  //   [">", "timestamp", start / 1000],
  //   ["<", "timestamp", end / 1000]
  // ]

  // map.setFilter('points', filter)

  const expr = 
    ['case',
      ['all',
        ['>', ["get", "timestamp"], start / 1000],
        ['<', ["get", "timestamp"], end / 1000],
      ],
      3,
      0
    ]

  map.setPaintProperty('points', 'circle-radius', expr, {
    validate: false
  })

  console.log(expr)

  frame++
}

let interval
document.querySelector('button').addEventListener('click', () => {
  if (frame === 0) {
    interval = setInterval(() => {
      applyFilter()
    }, 50)
  } else {
    clearInterval(interval)
  }
})


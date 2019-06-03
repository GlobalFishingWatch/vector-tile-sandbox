
var url = new URL(window.location)
var dataset = url.searchParams.get("dataset") || "chile/transporters"
var sourceLayer = url.searchParams.get("sourceLayer") || dataset

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
        "tiles": tiles
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
        "layout": {},
        "paint": {
          "circle-radius": 3,
          "circle-color": "hsl(0, 100%, 77%)"
        }
      }
  ]
}

var map = new mapboxgl.Map({
  container: 'map',
  style: style,
  hash: true
})


map.on('click', 'points', function (e) {
  const feature = e.features[0]

  document.querySelector('#info').innerText = `
    ${Object.keys(feature.properties).map(k => {
      return `${k}:${feature.properties[k]}`
    }).join(', ')}
  `
});

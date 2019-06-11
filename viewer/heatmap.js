var testData = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "value0": 0,
        "value1": 0,
        "value2": 0,
        "value3": 0,
        "value4": 0,
        "fishing": [0,0,0,0,0,0,0,0,0,0]
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          -40.078125,
          48.04870994288686
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "value0": 1,
        "value1": 0,
        "value2": 0,
        "value3": 0,
        "value4": 0,
        "fishing": [1,0,0,0,0,0,0,0,0,0],
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          -32.34375,
          48.04870994288686
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "value0": 1,
        "value1": 1,
        "value2": 0,
        "value3": 0,
        "value4": 0,
        "fishing": [1,1,0,0,0,0,0,0,0,0]
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          -25.224609375,
          48.28319289548349
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "value0": 1,
        "value1": 1,
        "value2": 1,
        "value3": 0,
        "value4": 0,
        "fishing": [1,1,1,0,0,0,0,0,0,0]
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          -40.42968749999999,
          43.51668853502906
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "value0": 1,
        "value1": 1,
        "value2": 1,
        "value3": 1,
        "value4": 0,
        "fishing": [1,1,1,1,0,0,0,0,0,0]
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          -32.431640625,
          43.77109381775651
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "value0": 1,
        "value1": 1,
        "value2": 1,
        "value3": 1,
        "value4": 1,
        "fishing": [1,1,1,1,1,0,0,0,0,0]
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          -25.224609375,
          43.96119063892024
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "value0": 1,
        "value1": 1,
        "value2": 1,
        "value3": 1,
        "value4": 1,
        "fishing": [1,1,1,1,1,1,0,0,0,0]
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          -40.341796875,
          38.34165619279595
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "value0": 1,
        "value1": 1,
        "value2": 1,
        "value3": 1,
        "value4": 1,
        "fishing": [1,1,1,1,1,1,1,0,0,0]
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          -32.783203125,
          38.75408327579141
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "value0": 1,
        "value1": 1,
        "value2": 1,
        "value3": 1,
        "value4": 1,
        "fishing": [1,1,1,1,1,1,1,1,0,0]
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          -25.400390625,
          39.095962936305476
        ]
      }
    }
  ]
}

var url = new URL(window.location)
var dataset = url.searchParams.get("dataset") || "chile/transporters"
var sourceLayer = url.searchParams.get("sourceLayer") || dataset.replace('/', '_')

const tiles = [`http://localhost:9090/${dataset}/{z}/{x}/{y}.pbf`]
console.log(tiles,sourceLayer)


const baseIntensity = .3;
const baseRadius = 10;

const useTiles = true

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
      "heatmap": {
        "type": "geojson",
        data: testData
      },
      "heatmap-tiles": {
        type: "vector",
        tiles,
        minzoom: 0,
        maxzoom: 6,
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
        "id": "heatmap",
        "type": "heatmap",
        "source": (useTiles) ? "heatmap-tiles" : "heatmap",
        "paint": {
          'heatmap-radius': [
            "interpolate",
            [ "exponential", 2 ],
            [ "zoom" ],
            0,
            baseRadius,
            16,
            baseRadius * 256
          ],
          'heatmap-intensity': [
            "interpolate",
            [ "exponential", 2 ],
            [ "zoom" ],
            0,
            baseIntensity,
            16,
            16 * baseIntensity
          ],
          'heatmap-intensity-transition': {
              "duration": 0,
              "delay": 0
          },
          'heatmap-opacity': [
            "interpolate",
            ["linear"],
            [ "zoom" ],
            0,
            1,
            8,
            1,
            10,
            0
          ],
          // 'heatmap-weight' : 5
          // 'heatmap-weight' : [
          //   "+",
          //   ["to-number", ["get", "value0"]],
          //   ["to-number", ["get", "value1"]],
          //   ["to-number", ["get", "value2"]],
          //   ["to-number", ["get", "value3"]],
          //   ["to-number", ["get", "value4"]],
          //   ["to-number", ["get", "value5"]]
          // ],

          // 'heatmap-weight' : [
          //   '/', [
          //     'let',
          //     'fishing_arr',
          //     ['get', 'fishing'],
          //     [
          //       '+',
          //       ["at", 0, ["var", "fishing_arr"]],
          //       ["at", 1, ["var", "fishing_arr"]],
          //       ["at", 2, ["var", "fishing_arr"]],
          //       ["at", 3, ["var", "fishing_arr"]],
          //       ["at", 4, ["var", "fishing_arr"]],
          //       ["at", 5, ["var", "fishing_arr"]],
          //       ["at", 6, ["var", "fishing_arr"]],
          //       ["at", 7, ["var", "fishing_arr"]],
          //       ["at", 8, ["var", "fishing_arr"]],
          //       ["at", 9, ["var", "fishing_arr"]]
          //     ]
          //   ],
          //   2
          // ]
        
        }
      },
      {
        "id": "points",
        "type": "circle",
        "source": (useTiles) ? "heatmap-tiles" : "heatmap",
        "layout": {
          "visibility": "none"
        },
        "paint": {
          "circle-radius": 1,
          "circle-opacity": 0,
          "circle-stroke-width": .5,
          "circle-stroke-color": "hsl(0, 0%, 0%)"
        }
      }
  ]
}

if (useTiles) {
  style.layers[2]['source-layer'] = sourceLayer
  style.layers[3]['source-layer'] = sourceLayer
}

let frame = 00
let map

const applyFilter = () => {
    // Sum of values with array - very slow
    // const timestamps = (new Array(10)).fill(null).map((v, i) => {
    //   return ["at", frame + i, ["var", "fishing_arr"]]
    // })
    // const timestampsSum = ['+'].concat(timestamps)
    // const heatmapWeightExpr = [
    //   '/', 
    //   [
    //     'let',
    //     'fishing_arr',
    //     ['get', 'fishing']
    //     timestampsSum
    //   ],
    //   2
    // ]

    // Sum of properties (ie "fishing12345") - slow
    // const timestamps = (new Array(100)).fill(null).map((v, i) => {
    //   return ["to-number", ["get", `t_${frame + i}`]]
    // })
    // const timestampsSum = ['+'].concat(timestamps)
    // const heatmapWeightExpr = [
    //   '/',
    //   timestampsSum,
    //   10
    // ]
    

    // Just get - ing value - medium
    const heatmapWeightExpr = ["to-number", ["get", `t_${frame}`]]

    // Just checking value existence - medium
    // const heatmapWeightExpr = ["case", ["has", `fishing${frame}`], 0, 5]

    // Just get - ing bool
    // const heatmapWeightExpr = ["case", ["==", `fishing${frame}`, true], 0, 5]

    map.setPaintProperty('heatmap', 'heatmap-weight', heatmapWeightExpr, {
      validate: false
    })
    console.log(frame)

    frame += 1
}

const loadMap = () => {
  map = new mapboxgl.Map({
    container: 'map',
    style: style,
    hash: true
  })
  map.showTileBoundaries = true

  map.on('click', () => {
    map.setLayoutProperty('heatmap', 'visibility', 'none')
    const f = map.querySourceFeatures('heatmap-tiles', {
      sourceLayer
    })
    const geojson = {
      "type":"FeatureCollection",
      "features": f
    }
    console.log(geojson)
    map.addSource(
      'heatmap-tiles-geojson',
      {
        type: 'geojson',
        data: geojson
      }
    )

    map.addLayer(
      {
        "id": "heatmap2",
        "type": "heatmap",
        "source": "heatmap-tiles-geojson",
        "paint": {
          'heatmap-radius': [
            "interpolate",
            [ "exponential", 2 ],
            [ "zoom" ],
            0,
            baseRadius,
            16,
            baseRadius * 256
          ],
          'heatmap-intensity': [
            "interpolate",
            [ "exponential", 2 ],
            [ "zoom" ],
            0,
            baseIntensity,
            16,
            16 * baseIntensity
          ],
          'heatmap-intensity-transition': {
              "duration": 0,
              "delay": 0
          },
          'heatmap-opacity': [
            "interpolate",
            ["linear"],
            [ "zoom" ],
            0,
            1,
            8,
            1,
            10,
            0
          ]
        }
      }
    )

  })

  // setTimeout(() => {
  //   const interval = setInterval(() => {
  //     applyFilter()
  //     if (frame > 800) {
  //       clearInterval(interval)
  //     }
  //   }, 50)
  //   document.querySelector('#stop').addEventListener('click', () => {
  //     clearInterval(interval)
  //   })
  // }, 2000);

}

if (!useTiles) {
  fetch('../data/heatmap/heatmap_gridded_1M_5deg_15kitvs_ints.json')
    .then(res => res.json())
    .then(heatmapData => {
      console.log('loaded')
      style.sources.heatmap.data = heatmapData
      loadMap()
    })
} else {
  loadMap()
}



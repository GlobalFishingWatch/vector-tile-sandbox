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
var playback = url.searchParams.get("playback") || "heatmap/playback"
var precise = url.searchParams.get("precise") || "heatmap/precise"
var sourceLayer = 'default'

const playbackTiles = [`http://localhost:9090/${playback}/{z}/{x}/{y}.pbf`]
const preciseTiles = [`http://localhost:9090/${precise}/{z}/{x}/{y}.pbf`]
console.log(playbackTiles, preciseTiles ,sourceLayer)


const baseIntensity = .3;
const baseRadius = 15;

const useTiles = true

const heatmapColor = [
  "interpolate",
  ["linear"],
  ["heatmap-density"],
  0,"rgba(0, 0, 255, 0)",
  0.2,"#0C276C",
  0.5,"#3B9088",
  0.8,"#EEFF00",
  1,"#ffffff"
]

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
      "heatmap-playback": {
        type: "vector",
        tiles: playbackTiles,
        minzoom: 0,
        maxzoom: 6,
      },
      "heatmap-precise": {
        type: "vector",
        tiles: preciseTiles,
        minzoom: 0,
        maxzoom: 6,
      }
  },
  "layers": [
      {
          "id": "background",
          "type": "background",
          "paint": {"background-color": "#0A1738"}
      },
      {
          "id": "countries",
          "type": "line",
          "source": "countries",
          "layout": {},
          "paint": {
            "line-color": "white"
          }
      },
      {
        "id": "heatmap-playback",
        "type": "heatmap",
        "source": (useTiles) ? "heatmap-playback" : "heatmap",
        "layout": {
          "visibility": "none"
        },
        "paint": {
          'heatmap-color' : heatmapColor,
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
          /*
          'heatmap-weight' : 5
          'heatmap-weight' : [
            "+",
            ["to-number", ["get", "value0"]],
            ["to-number", ["get", "value1"]],
            ["to-number", ["get", "value2"]],
            ["to-number", ["get", "value3"]],
            ["to-number", ["get", "value4"]],
            ["to-number", ["get", "value5"]]
          ],

          'heatmap-weight' : [
            '/', [
              'let',
              'fishing_arr',
              ['get', 'fishing'],
              [
                '+',
                ["at", 0, ["var", "fishing_arr"]],
                ["at", 1, ["var", "fishing_arr"]],
                ["at", 2, ["var", "fishing_arr"]],
                ["at", 3, ["var", "fishing_arr"]],
                ["at", 4, ["var", "fishing_arr"]],
                ["at", 5, ["var", "fishing_arr"]],
                ["at", 6, ["var", "fishing_arr"]],
                ["at", 7, ["var", "fishing_arr"]],
                ["at", 8, ["var", "fishing_arr"]],
                ["at", 9, ["var", "fishing_arr"]]
              ]
            ],
            2
          ]
          */
        }
      },
      {
        "id": "heatmap-precise",
        "type": "heatmap",
        "source": (useTiles) ? "heatmap-precise" : "heatmap",
        "layout": {
          "visibility": "visible"
        },
        "paint": {
          'heatmap-color' : heatmapColor,
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
          'heatmap-weight' : [
            '/', [
              'let',
              'fishing_arr',
              ['get', 't'],
              [
                '+',
                ["at", 0, ["var", "fishing_arr"]],
                ["at", 1, ["var", "fishing_arr"]],
                ["at", 2, ["var", "fishing_arr"]],
                ["at", 3, ["var", "fishing_arr"]],
                ["at", 4, ["var", "fishing_arr"]],
                ["at", 5, ["var", "fishing_arr"]],
                ["at", 6, ["var", "fishing_arr"]],
                ["at", 7, ["var", "fishing_arr"]],
                ["at", 8, ["var", "fishing_arr"]],
                ["at", 9, ["var", "fishing_arr"]]
              ]
            ],
            2
          ]
        }
      },
      {
        "id": "points",
        "type": "circle",
        "source": (useTiles) ? "heatmap-precise" : "heatmap",
        "layout": {
          "visibility": "none"
        },
        "paint": {
          "circle-radius": 1,
          "circle-opacity": 1,
          "circle-color": "hsl(100, 100%, 50%)",
          "circle-stroke-width": 0,
          "circle-stroke-color": "hsl(0, 0%, 0%)"
        }
      }
  ]
}

if (useTiles) {
  style.layers[2]['source-layer'] = sourceLayer
  style.layers[3]['source-layer'] = sourceLayer
  style.layers[4]['source-layer'] = sourceLayer
}

let frame = 0
let map

const applyFilter = () => {
    // Sum of values with array - very slow
    // It's also about > 2 times smaller than properties method
    const frameIndexInHrs = frame * 24
    const initialPlaybackOffsetDays = 30
    const offsetInHrs = initialPlaybackOffsetDays * 24
    
    // const timestamps = (new Array(offsetInHrs)).fill(null).map((v, i) => {
    //   return ["at", frameIndexInHrs + i, ["var", "fishing_arr"]]
    // })
    // const timestampsSum = ['+'].concat(timestamps)
    // const heatmapPreciseWeightExpr = [
    //   '/', 
    //   [
    //     'let',
    //     'fishing_arr',
    //     ['get', 'arr'],
    //     timestampsSum
    //   ],
    //   2
    // ]

    // Sum of properties (ie "fishing12345") - slow
    const timestamps = (new Array(offsetInHrs)).fill(null).map((v, i) => {
      return ["to-number", ["get", `t_${frameIndexInHrs + i}`]]
    })
    const timestampsSum = ['+'].concat(timestamps)
    const heatmapPreciseWeightExpr = [
      '/',
      timestampsSum,
      100
    ]
    //console.log(heatmapPreciseWeightExpr)
    map.setPaintProperty('heatmap-precise', 'heatmap-weight', heatmapPreciseWeightExpr, {
      validate: false
    })

    

    // Just get - ing value - medium
    const heatmapWeightExpr = [
      '/',
      ["to-number", ["get", `t+${frame}`]],
      100
    ]

    // Just checking value existence - medium
    // const heatmapWeightExpr = ["case", ["has", `fishing${frame}`], 0, 5]

    // Just get - ing bool
    // const heatmapWeightExpr = ["case", ["==", `fishing${frame}`, true], 0, 5]

    map.setPaintProperty('heatmap-playback', 'heatmap-weight', heatmapWeightExpr, {
      validate: false
    })

}

let interval
const play = () => {
  map.setLayoutProperty('heatmap-playback', 'visibility', 'visible')
  map.setLayoutProperty('heatmap-precise', 'visibility', 'none')
  interval = setInterval(() => {
    applyFilter()
    frame += 1
    console.log(frame)
  }, 100)
}

const stop = () => {
  clearInterval(interval)
  map.setLayoutProperty('heatmap-playback', 'visibility', 'none')
  map.setLayoutProperty('heatmap-precise', 'visibility', 'visible')
}

let playing = false
const togglePlay = () => {
  if (playing) {
    playBtn.innerText = 'play'
    stop()
  } else {
    playBtn.innerText = 'playing - click to stop'
    play()
  }
  playing = !playing
}

const next = () => {
  frame += 10
  applyFilter()
}

const playBtn = document.querySelector('#play')
const nextBtn = document.querySelector('#next')
const loadMap = () => {
  map = new mapboxgl.Map({
    container: 'map',
    style: style,
    hash: true
  })
  map.showTileBoundaries = true
  map.on('load', () => {
    //applyFilter()
  })

  map.on('click', (e) => {
    console.log(map.queryRenderedFeatures(
      // [e.lngLat.lng, e.lngLat.lat],
      { layers: ['points'] }
    ))
  })

  playBtn.addEventListener('click', togglePlay)
  nextBtn.addEventListener('click', next)
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



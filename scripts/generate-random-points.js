const fs = require('fs')
const turf = require('@turf/turf')
const landmass = require('./generate-random-points/landmass').features[0]
var JSONStream = require( 'JSONStream')

const path = process.argv[2]

var numFeatures = parseInt(process.argv[3])
if (isNaN(numFeatures)) {
  numFeatures = 40000
}

var DATE_START = new Date(2012,0,1).getTime()
var DATE_END = new Date(2016,11,31).getTime()
var dateInterval = DATE_END - DATE_START

var i = 0

const points = []

while (points.length < numFeatures) {
  var randomLat = (180 * Math.random()) - 90
  var randomLng = (360 * Math.random()) - 180
  var randomDatetime = DATE_START + Math.floor(dateInterval * Math.random())
  var pt = turf.point([randomLng, randomLat])
  if (turf.booleanPointInPolygon(pt, landmass)) continue
  
  points.push({
    'type': 'Feature',
    'properties': {
      datetime: randomDatetime,
      // fishing: Math.random()
      fishing: Math.floor(Math.random() * 10)
      // series: i++,
      // type: Math.floor(Math.random()*5)
    },
    'geometry': {
      'type': 'Point',
      'coordinates': [
        randomLng,
        randomLat
      ]
    }
  })
}

const transformStream = JSONStream.stringify('{"type":"FeatureCollection","features":[', '\n,\n', ']}')
const outputStream = fs.createWriteStream(path)
transformStream.pipe(outputStream)
points.forEach((p, i) => { console.log(i); transformStream.write(p) })
outputStream.on('error', (a) => {
  console.log(a)
})  
transformStream.on('error', (a) => {
  console.log(a)
})  
transformStream.on('end', () => {
  console.log('end JSON stringify')
})  
outputStream.on('finish', () => {
  console.log('JSON done')
})
transformStream.end()





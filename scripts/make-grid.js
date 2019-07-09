const turf = require('@turf/turf')
const fs = require('fs')
const JSONStream = require( 'JSONStream')
const es = require('event-stream')

const inputPath = process.argv[2] 
const outPath = process.argv[3] 
const longitudeDivisions = process.argv[4] || 10

var DATE_START = new Date(2012,0,1).getTime()
var DATE_END = new Date(2016,11,31).getTime()
var dateInterval = DATE_END - DATE_START
const datetimeBaseOffset = DATE_START
const datetimeDivideBy = 10000000
const numIntervals = Math.ceil(dateInterval / datetimeDivideBy)

const longitudeIncrement = 360 / longitudeDivisions
const latitudeIncrement = longitudeIncrement
const latitudeDivisions = 180 / latitudeIncrement
const grid = {"type":"FeatureCollection","features":[] }


const transformStream = JSONStream.stringify('{"type":"FeatureCollection","features":[', '\n,\n', ']}')
const outputStream = fs.createWriteStream(outPath)
transformStream.pipe(outputStream)

const readStream = fs.createReadStream(inputPath)
  .pipe(JSONStream.parse('features.*'))
  .pipe(es.mapSync(function (pt) {
    const [long, lat] = pt.geometry.coordinates
    const longGridded = Math.floor((long + 180) / longitudeDivisions)
    const latGridded = Math.floor((lat + 90) / latitudeDivisions)

    let gridCell = grid.features.find(cell =>
      cell.properties.longGridded === longGridded &&
      cell.properties.latGridded === latGridded
    )

    if (!gridCell) {
      let fishing = new Array(numIntervals).fill(0);
      gridCell = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [
            (longGridded * longitudeDivisions) - 180,
            (latGridded * latitudeDivisions) - 90,
          ],
        },
        properties: {
          longGridded,
          latGridded,
          // fishing
        }
      }
      grid.features.push(gridCell)
    }

    const timeOffset = Math.floor((pt.properties.datetime - datetimeBaseOffset) / datetimeDivideBy)
    // create array of values
    // if (!gridCell.properties.fishing[timeOffset]) {
    //   gridCell.properties.fishing[timeOffset] = 0
    // }
    // gridCell.properties.fishing[timeOffset] += pt.properties.fishing

    // create individual props
    // if (!gridCell.properties[`fishing${timeOffset}`]) {
    //   gridCell.properties[`fishing${timeOffset}`] = 0
    // }
    // gridCell.properties[`fishing${timeOffset}`] += pt.properties.fishing

    // create individual props - bool
    gridCell.properties[`fishing${timeOffset}`] = true
  }))

 readStream.on('end', () => {
   console.log('done')
   console.log('numIntervals', numIntervals)
   console.log('num points', grid.features.length)
   fs.writeFileSync(outPath, JSON.stringify(grid), 'utf-8')
 })


#!/usr/bin/env node

const fs = require('fs')
const tilebelt = require('@mapbox/tilebelt')
const argv = require('yargs').argv
const lodash = require('lodash')

const z = parseInt(process.argv[2])
const x = parseInt(process.argv[3])
const y = parseInt(process.argv[4])

let timeResolution = argv.timeResolution || 'hour'
if (timeResolution === 'hour') {
  timeResolution = 3600
} else if (timeResolution === 'day') {
  timeResolution = 86400
}
timeResolution = parseInt(timeResolution)

const params = {
  gridResolution: parseInt(argv.gridResolution) || 256,
  startTimestamp: parseInt(argv.startTimestamp) || new Date(2012,0,1).getTime(),
  timeResolution,
  useArray: (argv.useArray === 'true') ? true : false,
  aggregateUnits: parseInt(argv.aggregateUnits) || null,
  debug: (argv.debug === 'true') ? true : false,
  geometryType: argv.geometryType || 'point'
}


const cells = []
const [minLng, minLat, maxLng, maxLat] = tilebelt.tileToBBOX([x,y,z])
const cellSizeLng = (maxLng - minLng) / params.gridResolution
const cellSizeLat = (maxLat - minLat) / params.gridResolution
let maxQuantizedTimestamp = 0


var stdin = process.stdin,
    stdout = process.stdout,
    inputChunks = [];

stdin.resume();
stdin.setEncoding('utf8');

stdin.on('data', function (chunk) {
  inputChunks.push(chunk)
});

const makeGridCell = (lngGridded, latGridded, cellSizeLng, cellSizeLat, baseLng, baseLat, tippecanoe) => {
  // let fishing = new Array(numIntervals).fill(0);
  const lng = baseLng + (lngGridded * cellSizeLng) + cellSizeLng / 2
  const lat = baseLat + (latGridded * cellSizeLat) + cellSizeLat / 2

  const gridCell = {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [
        lng,
        lat,
      ],
    },
    properties: {
      lngGridded,
      latGridded,
      numPoints: 0,
      // fishing
    },
    quantizedTimestamps: [],
    tippecanoe
  }
  return gridCell
}


const addFeature = (rawFeature) => {
  const feature = JSON.parse(rawFeature)
  const [lng, lat] = feature.geometry.coordinates

  const lngGridded = Math.floor((lng - minLng) / cellSizeLng)
  const latGridded = Math.floor((lat- minLat) / cellSizeLat)

  let gridCell = cells.find(cell =>
    cell.properties.lngGridded === lngGridded &&
    cell.properties.latGridded === latGridded
  )

  if (!gridCell) {
    gridCell = makeGridCell(lngGridded, latGridded, cellSizeLng, cellSizeLat, minLng, minLat, feature.tippecanoe)
    cells.push(gridCell)
  }

  gridCell.properties.numPoints++

  const timestampSeconds = feature.properties.timestamp
  const offsetedTimestamp = timestampSeconds - params.startTimestamp
  const quantizedTimestamp = Math.floor(offsetedTimestamp / params.timeResolution)

  if (quantizedTimestamp < 0) {
    console.error('ERROR: invalid quantized timestamp', quantizedTimestamp)
    console.error('original timestamp:', feature.properties.timestamp)
    console.error('start (s):', params.startTimestamp)
    console.error('step (s):', params.timeResolution)
  }

  if (quantizedTimestamp > maxQuantizedTimestamp) {
    maxQuantizedTimestamp = quantizedTimestamp
  }
  gridCell.quantizedTimestamps.push(quantizedTimestamp)
  
}

stdin.on('end', function () {
  const inputJSON = inputChunks.join('')
  const geoJSONChunks = inputJSON.split('\n')
  try {
    // read json line by line and aggregate to grid points
    const newChunks = geoJSONChunks.map(rawFeature => {
      if (rawFeature.trim() !== '') {
        addFeature(rawFeature)
      }
    })

    // aggregate timestamps
    cells.forEach(gridCell => {
      gridCell.quantizedTimestamps.forEach(quantizedTimestamp => {
        if (params.useArray) {
          // gets encoded as string...... :(
          if (gridCell.properties.arr === undefined) {
            gridCell.properties.arr = new Array(maxQuantizedTimestamp).fill(0)
          }
          if (gridCell.properties.arr[quantizedTimestamp] === undefined) {
            gridCell.properties.arr[quantizedTimestamp] = 1
          } else {
            gridCell.properties.arr[quantizedTimestamp]++
          }
        } else {
          const timestampKey = 't_' + quantizedTimestamp
          if (gridCell.properties[timestampKey] === undefined) {
            gridCell.properties[timestampKey] = 1
          } else {
            gridCell.properties[timestampKey]++
          }
        }
      })
      // this is not needed in final tiles
      delete gridCell.quantizedTimestamps
    })
    
    // aggregate wy sliding time period (playback mode)
    if (params.aggregateUnits !== null) {
      cells.forEach(cell => {
        let currentValue = 0
        for (let t = 0; t<maxQuantizedTimestamp; t++) {
          if (t <= params.aggregateUnits) {
            currentValue += (cell.properties['t_'+t] === undefined) ? 0 : cell.properties['t_'+t]
          } else {
            const timestampOffset = (t - params.aggregateUnits)
            const offsetedTimestampKey = 't+' + timestampOffset
            if (currentValue > 0) {
              cell.properties[offsetedTimestampKey] = currentValue
            }
            currentValue += (cell.properties['t_'+t] === undefined) ? 0 : cell.properties['t_'+t]
            currentValue -= (cell.properties['t_'+timestampOffset] === undefined) ? 0 : cell.properties['t_'+timestampOffset]
          }
        }
      })
    }
    
    const testJSON = {"type":"FeatureCollection","features": cells }
    // [[x,y,z], [minLng, minLat, maxLng, maxLat], cellSizeLng, cellSizeLat, cells.length, JSON.stringify(testJSON)].join('\n'))
    
    const outJSON = cells.map(f => JSON.stringify(f)).join('\n')
    if (params.debug) {
      fs.writeFileSync(`./data/log/tiles/${z}${x}${y}`, outJSON)
    }
    stdout.write(outJSON)
  } catch (e) {
    console.error('make-grid error at tile:',z,x,y, e, '\n')
    stdout.write(inputJSON)
    fs.writeFileSync(`./data/log/make-grid.log`, `error: ${e}`)
  }
});
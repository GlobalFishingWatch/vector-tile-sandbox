#!/usr/bin/env node

const fs = require('fs')
const tilebelt = require('@mapbox/tilebelt')
const argv = require('yargs').argv

const z = parseInt(process.argv[2])
const x = parseInt(process.argv[3])
const y = parseInt(process.argv[4])
const gridResolution = parseInt(argv.gridResolution) || 256
const startTimestamp = parseInt(argv.startTimestamp) || new Date(2012,0,1).getTime()
let timeResolution = argv.timeResolution || 'hour'
if (timeResolution === 'hour') {
  timeResolution = 3600
} else if (timeResolution === 'day') {
  timeResolution = 86400
}
timeResolution = parseInt(timeResolution)

const useArray = (argv.useArray === 'true') ? true : false
const addPlaybackData = (argv.addPlaybackData === 'true') ? true : false
const debug = (argv.debug === 'true') ? true : false
const geometry = argv.geometry || 'point'

const cells = []
const [minLng, minLat, maxLng, maxLat] = tilebelt.tileToBBOX([x,y,z])
const cellSizeLng = (maxLng - minLng) / gridResolution
const cellSizeLat = (maxLat - minLat) / gridResolution
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
    tippecanoe
  }
  return gridCell
}


const addGridCell = (rawFeature) => {
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
  const offsetedTimestamp = timestampSeconds - startTimestamp
  const quantizedTimestamp = Math.floor(offsetedTimestamp / timeResolution)

  if (quantizedTimestamp < 0) {
    console.error('ERROR: invalid quantized timestamp', quantizedTimestamp)
    console.error('original timestamp:', feature.properties.timestamp)
    console.error('start (s):', startTimestamp)
    console.error('step (s):', timeResolution)
  }

  if (quantizedTimestamp > maxQuantizedTimestamp) {
    maxQuantizedTimestamp = quantizedTimestamp
  }

  if (useArray) {
    if (gridCell.properties.t === undefined) {
      gridCell.properties.t = new Array(quantizedTimestamp).fill(0)
    }
    if (gridCell.properties.t[quantizedTimestamp] === undefined) {
      gridCell.properties.t[quantizedTimestamp] = 1
    } else {
      gridCell.properties.t[quantizedTimestamp]++
    }
  } else {
    const timestampKey = 't_' + quantizedTimestamp
    if (gridCell.properties[timestampKey] === undefined) {
      gridCell.properties[timestampKey] = 1
    } else {
      gridCell.properties[timestampKey]++
    }
  }
}

stdin.on('end', function () {
  const inputJSON = inputChunks.join('')
  const geoJSONChunks = inputJSON.split('\n')
  try {
    const newChunks = geoJSONChunks.map(rawFeature => {
      if (rawFeature.trim() !== '') {
        addGridCell(rawFeature)
      }
    })

    if (addPlaybackData) {
      const OFFSET = 30
      cells.forEach(cell => {
        let currentValue = 0
        for (let t = 0; t<maxQuantizedTimestamp; t++) {
          if (t <= OFFSET) {
            currentValue += (cell.properties['t_'+t] === undefined) ? 0 : cell.properties['t_'+t]
          } else {
            const timestampOffset = (t - OFFSET)
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
    if (debug) {
      fs.writeFileSync(`./data/test-out/${z}${x}${y}`, outJSON)
    }
    stdout.write(outJSON)
  } catch (e) {
    console.error('make-grid error at tile:',z,x,y, e, '\n')
    stdout.write(inputJSON)
    fs.writeFileSync(`./data/test-out/make-grid.log`, `error: ${e}`)
  }
});
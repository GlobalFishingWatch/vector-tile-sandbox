#!/usr/bin/env node

const Pbf = require('pbf')

const VectorTile = require('@mapbox/vector-tile').VectorTile

const request = require("request");
const fs = require('fs')

const tilePath = process.argv[2]

if (tilePath === undefined) {
  console.error('Omitted tile path. Use: ./inspect-vector-tile path/to/tile.pbf')
  process.exit(1)
}

const readTile = (tile) => {
  console.log('Reading tile:', tilePath)

  const pbf = new Pbf(tile)
  const vectorTile = new VectorTile(pbf)
  console.log('pbf length:', pbf.length)
  
  const layers = vectorTile.layers
  const mainLayerName = Object.keys(layers)[0]
  console.log('layer name:', mainLayerName)
  const mainLayer = layers[mainLayerName]
  console.log('layer length', mainLayer.length)
  const aFeature = mainLayer.feature(0)
  console.log('example feature type:', aFeature.type)
  console.log('example feature:', aFeature.properties)
  console.log('example feature:bbox:', aFeature.bbox())
  console.log('example feature to GeoJSON')
  console.log( aFeature.toGeoJSON(5,26,16))
}

if (tilePath.substr(0, 4) === 'http') {
  var requestSettings = {
    method: 'GET',
    url: tilePath,
    encoding: null,
};
  request(requestSettings, (error, response, body) => {
    // let json = JSON.parse(body);
    console.log(body);
    readTile(body)
  });
  return
} else {
  fs.readFileSync(tilePath)
}



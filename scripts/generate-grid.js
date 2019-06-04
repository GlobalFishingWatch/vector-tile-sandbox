const turf = require('@turf/turf')
const fs = require('fs')
const JSONStream = require( 'JSONStream')
const es = require('event-stream')

const inputPath = process.argv[2] 
const outPath = process.argv[3] 
const longitudeDivisions = process.argv[4] || 100

const longitudeIncrement = 360 / longitudeDivisions
const latitudeIncrement = longitudeIncrement
const latitudeDivisions = 180 / latitudeIncrement
const grid = {"type":"FeatureCollection","features":[] }

for (let longitude = -180; longitude < longitudeDivisions; longitude++) {
  for (let latitude = 0; latitude < latitudeDivisions; latitude++) {
    grid.features.push({
      "type": "Feature",
      "properties": {
        children: []
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              7.734374999999999,
              46.558860303117164
            ],
            [
              32.6953125,
              46.558860303117164
            ],
            [
              32.6953125,
              62.75472592723178
            ],
            [
              7.734374999999999,
              62.75472592723178
            ],
            [
              7.734374999999999,
              46.558860303117164
            ]
          ]
        ]
      }
    })
  }
}

// const bbox = [-180,180,-40,40]
// const grid = turf.hexGrid(bbox, cellSide, {units: 'degrees'});

const numCells = grid.features.length
console.log('grid total clusters:', numCells)

fs.writeFileSync(outPath, JSON.stringify(grid), 'utf-8')
return

const transformStream = JSONStream.stringify('{"type":"FeatureCollection","features":[', '\n,\n', ']}')
const outputStream = fs.createWriteStream(outPath)
transformStream.pipe(outputStream)

// request({url: inputPath})
const readStream = fs.createReadStream(inputPath)
  .pipe(JSONStream.parse('features.*'))
  .pipe(es.mapSync(function (pt) {
    console.error(pt)
    for (let i =0; i<numCells; i++) {
      const cell =  grid.features[i]
      if (turf.booleanPointInPolygon(pt, cell)) {
        // if (!cell.properties.children) {
        //   cell.properties.children = []
        // }
        cell.children.push(pt)
        break
      }
    }
    // transformStream.write(data)
    // return data
  }))

 readStream.on('end', () => {
   console.log('done')
   console.log(grid)
   fs.writeFileSync(outPath, JSON.stringify(grid), 'utf-8')
 })

// outputStream.on('error', (a) => {
//   console.log(a)
// })  
// transformStream.on('error', (a) => {
//   console.log(a)
// })  
// transformStream.on('end', () => {
//   console.log('end JSON stringify')
// })  
// outputStream.on('finish', () => {
//   console.log('JSON done')
// })
// transformStream.end()


#!/usr/bin/env node

const z = process.argv[2]
const x = process.argv[3]
const y = process.argv[4]

// console.log(z, x, y)

const fs = require('fs')

var stdin = process.stdin,
    stdout = process.stdout,
    inputChunks = [];

stdin.resume();
stdin.setEncoding('utf8');

stdin.on('data', function (chunk) {
  // console.log('---')
  // console.log(chunk)
    inputChunks.push(chunk);
});

stdin.on('end', function () {
  // console.log('end')
    var inputJSON = inputChunks.join('')
        // parsedData = JSON.parse(inputJSON),
        // outputJSON = JSON.stringify(parsedData, null, '    ');
    fs.writeFileSync(`./data/test-out/${z}${x}${y}`, inputJSON)
    stdout.write(inputJSON)
});
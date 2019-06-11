// var static = require('node-static');
// var server = new static.Server('data', {
//   headers: {
//     'Access-Control-Allow-Origin': '*',
//     'Access-Control-Allow-Methods': 'GET',
//     'Access-Control-Allow-Headers': 'Content-Type'
//   }
// });

// require('http').createServer(function (request, response) {
//   request.addListener('end', function () {
//       //
//       // Serve files!
//       //
//       server.serve(request, response);
//   }).resume();
// }).listen(9090);

// // Access-Control-Allow-Origin: *s

// // npx tessera file://Users/nerik/Work/gfw/vector-tile-sandbox/data -p 9090

var express = require('express')
var app = express()
var cors = require('cors')

app.use(cors())
app.use(express.static('data', {
  setHeaders: (res) => {
    res.set('Content-Encoding', 'gzip')
  }
}))

// app.get('')

app.listen(9090);
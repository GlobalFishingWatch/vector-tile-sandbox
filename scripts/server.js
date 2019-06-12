var path = require('path')
var express = require('express')
var app = express()
var cors = require('cors')

app.use(cors())
app.use(express.static(path.join(__dirname, '../data'), {
  setHeaders: (res) => {
    // console.log(res)
    res.set('Content-Encoding', 'gzip')
  },
  fallthrough: false
}))

app.listen(9090);

var app = require('express')()

app.get('/containers/json', function(req, res, next) {
  res.json([])
})

var port = process.env.PORT || 5123
require('http').Server(app).listen(port)
console.log('fake docker listening on port '+port)
console.log('set DOCKER_HOST="127.0.0.1:'+port+'"')

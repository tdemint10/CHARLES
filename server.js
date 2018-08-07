var express = require('express')
var app     = express()
var http    = require('http').Server(app)
var io      = require('socket.io')(http)

/* STATIC FILES */
app.use(express.static(__dirname + '/public'))

/* SET PORT */
var port = process.env.PORT || 3000

/* LISTEN */
http.listen(port, () => {
  console.log('Listening on port ' + port + '...')
})

const express = require('express');
const http = require('http');
const path = require('path');

var app = express();

app.use(express.static(path.join(__dirname, 'build')));

const PORT = process.env.PORT || '8080';
app.set('port', PORT);

const server = http.createServer(app);
server.listen(PORT, () => console.log(`Running on port ${PORT}`));

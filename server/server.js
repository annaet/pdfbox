var cfenv = require('cfenv');
var express = require('express');
var path = require('path');
var app = express();
var server = require('http').Server(app);

app.use('/', express.static(path.join(__dirname, '../app')));

require('./routes')(app);

app.all('/*', function (req, res) {
  'use strict';

  res.sendFile(path.join(__dirname, '../app', 'index.html'));
});

var appEnv = cfenv.getAppEnv();

server.listen(appEnv.port, function() {
  'use strict';

  console.log('server starting on ' + appEnv.url);
});

var https = require('https');
var fs = require('fs');
var Document = require('node-pdfbox');

var download = function(url, dest, cb) {
  'use strict';

  var file = fs.createWriteStream(dest);

  https.get(url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close(cb);  // close() is async, call cb after close completes.
    });
  }).on('error', function(err) { // Handle errors
    fs.unlink(dest); // Delete the file async. (But we don't check the result)
    if (cb) {
      cb(err.message);
    }
  });
};

var getPage = function (req, res) {
  'use strict';

  console.log(req.body);

  if (req.body.url && Number.isInteger(req.body.page)) {
    var location = 'paper.pdf';

    download(req.body.url, location, function(err) {
      if (err) {
        return console.log(err);
      }

      var document = Document.loadSync(location);
      var page = document.getPageSync(req.body.page);

      var destination = req.body.destination;
      if (!destination) {
        destination = 'page.pdf';
      }
      var newDocument = page.extractSync(destination);

      res.send('done');
    });
  } else {
    console.log('missing body');
  }
};

module.exports = {
  getPage: getPage
};

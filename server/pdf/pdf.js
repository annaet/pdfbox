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

  if (req.body.origin) {
    console.log(req.body);
    var location = 'paper.pdf';

    download(req.body.origin, location, function(err) {
      if (err) {
        return console.log(err);
      }

      var pageNum = req.body.page;
      if (!Number.isInteger(req.body.page)) {
        pageNum = 0;
      }

      var document = Document.loadSync(location);
      var page = document.getPageSync(pageNum);

      var destination = req.body.destination;
      if (!destination) {
        destination = 'page.pdf';
      }
      page.extractSync(destination);

      res.send('done');
    });
  } else {
    console.log('missing body');
  }
};

module.exports = {
  getPage: getPage
};

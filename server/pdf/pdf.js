var https = require('https');
var fs = require('fs');
var Document = require('node-pdfbox');
var PDFImage = require("pdf-image").PDFImage;

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
    var destination = req.body.destination;
    if (!destination) {
      destination = 'page.pdf';
    }

    download(req.body.origin, destination, function(err) {
      if (err) {
        return console.log(err);
      }

      var pageNum = req.body.page;
      pageNum = parseInt(pageNum, 10);

      if (!Number.isInteger(pageNum)) {
        pageNum = 0;
      }

      var pdfImage = new PDFImage(destination);
      pdfImage.convertPage(pageNum).then(function (imagePath) {
        res.download(imagePath, function(err) {
          if (err) {
            console.log(err);
          }

          fs.unlink(destination);
          fs.unlink(imagePath);
        });
      }, function (err) {
        console.log(err);
        res.status(500).send(err);
      });

      // var document = Document.loadSync(destination);
      // var page = document.getPageSync(pageNum);
      // console.log(document.pagesCountSync());
      // page.extractSync(destination);

      // var filePath = '/../../' + destination;
      // res.download(__dirname + filePath);

    });
  } else {
    console.log('missing body');
  }
};

module.exports = {
  getPage: getPage
};

var https = require('https');
var fs = require('fs');
var path = require('path');

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
      destination = 'paper.pdf';
    }

    download(req.body.origin, destination, function(err) {
      if (err) {
        return console.log(err);
      }

      var pageNum = req.body.page;
      pageNum = parseInt(pageNum, 10);

      if (!Number.isInteger(pageNum)) {
        pageNum = 1;
      }

      var paperPath = path.join(__dirname, '../..', destination);
      var imagePath = path.join(__dirname, '../..', 'image');
      var imageName = imagePath + pageNum + '.jpg';

      var spawn = require('child_process').spawn;
      var child = spawn('java', ['-jar', '-Xmx2g', 'pdfbox/pdfbox-app-2.0.4.jar', 'PDFToImage', '-imageType', 'jpg', '-startPage', pageNum, '-endPage', pageNum, '-resolution', '120', paperPath, '-outputPrefix', imagePath]);

      child.stdout.on('data', function(data) {
        console.log('stdout: ' + data);
      });

      child.stderr.on('data', function(data) {
        console.log('stderr: ' + data);
      });

      child.on('close', function(code) {
        if (code !== 0) {
          return console.log('error: child process exited with code ' + code);
        }

        fs.access(imageName, function(err) {
          if (err) {
            console.log('error: image has not been created correctly');
            return res.sendStatus(500);
          }

          res.download(imageName, function(err) {
            if (err) {
              console.log(err);
            }

            fs.unlink(paperPath);
            fs.unlink(imageName);
          });
        });
      });

    });
  } else {
    console.log('error: missing body');
  }
};

module.exports = {
  getPage: getPage
};

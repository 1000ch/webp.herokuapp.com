var fs       = require('fs');
var tempfile = require('tempfile');

var cwebp    = require('cwebp-bin');
var execFile = require('child_process').execFile;

var extensionMap = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif'
};

var post = function (request, response) {

  var buffers = [];
  var contentType = request.headers['content-type'];
  var before = tempfile(extensionMap[contentType]);
  var after = tempfile('.webp');

  request.on('data', function (chunk) {
    buffers.push(chunk);
  });

  request.on('end', function () {

    // concat buffer chunks
    var buffer = Buffer.concat(buffers);

    fs.writeFile(before, buffer, function (error) {

      if (error) {
        console.error(error);
        fs.unlinkSync(before);
        throw error;
      }

      // cwebp arguments
      var args = [before, '-o', after];

      execFile(cwebp.path, args, function (error) {

        if (error) {
          console.error(error);
          fs.unlinkSync(before);
          fs.unlinkSync(after);
          throw error;
        }

        // return buffer
        response.send(fs.readFileSync(after));

        // remove temporary images
        fs.unlinkSync(before);
        fs.unlinkSync(after);
      });
    });
  });
};

module.exports = {
  post: post
};
var fs       = require('fs');
var path     = require('path');

var tempfile = require('tempfile');
var cwebp    = require('cwebp-bin');
var execFile = require('child_process').execFile;

var post = function (request, response) {

  var size = 0;
  var before = tempfile();
  var after = tempfile('.webp');

  request.on('data', function (chunk) {
    fs.writeFileSync(before, chunk);
    size += chunk.length;
  });

  request.on('end', function () {
    console.log(cwebp.path, before, after);
    execFile(cwebp.path, [before, '-o', after], function (error) {
      var buffer = fs.readFileSync(after);
      console.log(buffer);
      response.json({});
    });
  });

};

module.exports = {
  post: post
};
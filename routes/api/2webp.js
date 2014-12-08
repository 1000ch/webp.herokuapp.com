var fs       = require('fs');
var path     = require('path');

var cwebp    = require('cwebp-bin');
var execFile = require('child_process').execFile;

var post = function (request, response) {

  var size = 0;
  var before = 'before';
  var after = 'after.webp';

  request.on('data', function (chunk) {

    fs.writeFileSync(before, chunk);
    size += chunk.length;
  });

  request.on('end', function () {

    var args = [before, '-o', after];
    execFile(cwebp.path, args, function (error) {
      var buffer = fs.readFileSync(after);
      response.send(buffer);
    });
  });

};

module.exports = {
  post: post
};
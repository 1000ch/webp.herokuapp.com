const pify = require('pify');
const fsP = pify(require('fs'));
const tempfile = require('tempfile');
const cwebp = require('cwebp-bin');
const execFileP = pify(require('child_process').execFile);

const extensionMap = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif'
};

module.exports.post = (request, response) => {
  const buffers = [];
  const contentType = request.headers['content-type'];
  const before = tempfile(extensionMap[contentType]);
  const after = tempfile('.webp');

  request.on('data', chunk => {
    buffers.push(chunk);
  });

  request.on('end', () => {
    fsP.writeFile(before, Buffer.concat(buffers))
      .then(() => execFileP(cwebp, [before, '-o', after]))
      .then(() => fsP.readFile(after))
      .then(buffer => {
        response.send(buffer);
        fsP.unlink(before);
        fsP.unlink(after);
      })
      .catch(error => {
        console.error(error);
        fsP.unlink(before);
        fsP.unlink(after);
      });
  });
};

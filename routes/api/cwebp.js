const fs = require('fs');
const tempfile = require('tempfile');
const cwebp = require('cwebp-bin');
const execFile = require('child_process').execFile;

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
    const buffer = Buffer.concat(buffers);

    fs.writeFile(before, buffer, error => {
      if (error) {
        console.error(error);
        fs.unlinkSync(before);
        throw error;
      }

      execFile(cwebp, [before, '-o', after], error => {
        if (error) {
          console.error(error);
          fs.unlinkSync(before);
          fs.unlinkSync(after);
          throw error;
        }

        fs.readFile(after, (error, buffer) => {
          if (error) {
            console.error(error);
            fs.unlinkSync(before);
            fs.unlinkSync(after);
            throw error;
          }

          response.send(buffer);
          fs.unlinkSync(before);
          fs.unlinkSync(after);
        });
      });
    });
  });
};

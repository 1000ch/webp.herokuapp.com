document.addEventListener('DOMContentLoaded', () => {
  const imageBefore = document.querySelector('#js-image-before');
  const imageAfter = document.querySelector('#js-image-after');
  const downloadBefore = document.querySelector('#js-download-before');
  const downloadAfter = document.querySelector('#js-download-after');

  const input = document.querySelector('#js-input');
  const drop = document.querySelector('#js-drop');

  drop.addEventListener('dragenter', onDragEnter);
  drop.addEventListener('dragstart', onDragStart);
  drop.addEventListener('dragover', onDragOver);
  drop.addEventListener('dragleave', onDragLeave);
  drop.addEventListener('dragend', onDragEnd);
  drop.addEventListener('drop', onDrop);

  let blobBefore = null;
  let blobAfter = null;

  function onDragEnter (e) {
    this.classList.add('is-dragover');
  }

  function onDragStart (e) {
    this.style.opacity = 0.5;
  }

  function onDragOver (e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    return false;
  }

  function onDragLeave (e) {
    this.classList.remove('is-dragover');
  }

  function onDragEnd (e) {

  }

  function onDrop (e) {
    e.stopPropagation();
    e.preventDefault();

    if (e.dataTransfer.files.length === 0) {
      return false;
    }

    blobBefore && URL.revokeObjectURL(blobBefore);
    blobAfter && URL.revokeObjectURL(blobAfter);

    let file = e.dataTransfer.files[0];
    blobBefore = file.slice(0, file.size);

    downloadBefore.download = file.name;
    downloadAfter.download = file.name.replace(/(jpeg|jpg|png)/, 'webp');

    sendBlob(blobBefore, xhr => {
      blobAfter = xhr.response;
      downloadAfter.href = imageAfter.src = URL.createObjectURL(blobAfter);
    });

    downloadBefore.href = imageBefore.src = URL.createObjectURL(blobBefore);
  }

  input.addEventListener('change', e => {
    blobBefore && URL.revokeObjectURL(blobBefore);
    blobAfter && URL.revokeObjectURL(blobAfter);

    let file = input.files[0];
    blobBefore = file.slice(0, file.size);

    downloadBefore.download = file.name;
    downloadAfter.download = file.name.replace(/(jpeg|jpg|png)/, 'webp');

    sendBlob(blobBefore, xhr => {
      blobAfter = xhr.response;
      downloadAfter.href = imageAfter.src = URL.createObjectURL(blobAfter);
    });

    downloadBefore.href = imageBefore.src = URL.createObjectURL(blobBefore);
  });

  function sendBlob (blob, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/cwebp', true);
    xhr.responseType = 'blob';
    //xhr.responseType = 'arraybuffer';
    xhr.onload = e => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        //var arrayBuffer = new Uint8Array(xhr.response);
        callback(xhr);
      }
    };
    xhr.send(blob);
  }
});

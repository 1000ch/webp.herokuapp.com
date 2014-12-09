document.addEventListener('DOMContentLoaded', function () {

  var imageBefore    = document.querySelector('#js-image-before');
  var imageAfter     = document.querySelector('#js-image-after');
  var downloadBefore = document.querySelector('#js-download-before');
  var downloadAfter  = document.querySelector('#js-download-after');

  var input = document.querySelector('#js-input');
  var drop  = document.querySelector('#js-drop');
  
  drop.addEventListener('dragenter', onDragEnter);
  drop.addEventListener('dragstart', onDragStart);
  drop.addEventListener('dragover', onDragOver);
  drop.addEventListener('dragleave', onDragLeave);
  drop.addEventListener('dragend', onDragEnd);
  drop.addEventListener('drop', onDrop);
  
  var blobBefore = null;
  var blobAfter = null;

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
    
    if (e.dataTransfer.files.length === 0) {
      return false;
    }

    blobBefore && URL.revokeObjectURL(blobBefore);
    blobAfter && URL.revokeObjectURL(blobAfter);
    
    var file = e.dataTransfer.files[0];
    blobBefore = file.slice(0, file.size);

    downloadBefore.download = file.name;
    downloadAfter.download = file.name.replace(/(jpeg|jpg|png)/, 'webp');

    sendBlob(blobBefore, function (xhr) {
      blobAfter = xhr.response;
      downloadAfter.href = imageAfter.src = URL.createObjectURL(blobAfter);
    });

    downloadBefore.href = imageBefore.src = URL.createObjectURL(blobBefore);

    return false;
  }

  input.addEventListener('change', function (e) {

    blobBefore && URL.revokeObjectURL(blobBefore);
    blobAfter && URL.revokeObjectURL(blobAfter);

    var file = input.files[0];
    blobBefore = file.slice(0, file.size);

    downloadBefore.download = file.name;
    downloadAfter.download = file.name.replace(/(jpeg|jpg|png)/, 'webp');

    sendBlob(blobBefore, function (xhr) {
      blobAfter = xhr.response;
      downloadAfter.href = imageAfter.src = URL.createObjectURL(blobAfter);
    });

    downloadBefore.href = imageBefore.src = URL.createObjectURL(blobBefore);
  });
  
  function sendBlob (blob, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/2webp', true);
    xhr.responseType = 'blob';
    //xhr.responseType = 'arraybuffer';
    xhr.onload = function (e) {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        //var arrayBuffer = new Uint8Array(xhr.response);
        callback(xhr);
      }
    };
    xhr.send(blob);
  }
});
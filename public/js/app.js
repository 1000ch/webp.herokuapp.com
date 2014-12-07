document.addEventListener('DOMContentLoaded', function () {

  var before = document.querySelector('#js-image-before');
  var after  = document.querySelector('#js-image-after');
  var input  = document.querySelector('#js-input');

  input.addEventListener('change', function (e) {

    var file = input.files[0];
    var fr = new FileReader();
    fr.onload = function (e) {
      console.log(e.target);
      var datauri = e.target.result;
      before.setAttribute('src', datauri);

      var mimeString = datauri.split(',')[0].split(':')[1].split(';')[0];
      var byteString = atob(datauri.split(',')[1]);
      var array = new Uint8Array(byteString.length);
      for (var i = 0, l = array.length; i < l; i++) {
        array[i] = byteString.charCodeAt(i);
      }
      var blob = new Blob([array], {
        type: mimeString
      });

      var xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/2webp', false);
      xhr.onload = function (e) {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          console.log(e);
        }
      };
      xhr.send(blob);
    };
    fr.readAsDataURL(file);
  });
});
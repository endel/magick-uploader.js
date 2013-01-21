(function($) {
  var canvases = [];

  var MagickUploader = function(field) {
    field.onChange = onFileSelected;
  };

  function createCanvas(canvas) {
    if (typeof FlashCanvas !== "undefined") {
      FlashCanvas.initElement(canvas);
    }
    return canvas;
  }

  function onFileSelected(e) {
    console.log(e);
  }

  $.MagickUploader = MagickUploader;
})(window);

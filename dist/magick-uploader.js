/* 
 * joy.js v0.0.1pre 
 * http://ocapi.github.com/magick-uploader.js
 * 
 * @copyright 2013 Endel Dreyer 
 * @license MIT
 * @build 1/21/2013
 */

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

/* 
 * magick-uploader.js v0.0.1pre 
 * http://ocapi.github.com/magick-uploader.js
 * 
 * @copyright 2013 Endel Dreyer 
 * @license MIT
 * @build 1/22/2013
 */

(function(window, $, undefined) {
  /**
   * MagickUploader
   */
  $.fn.MagickUploader = function(options) {
    if (!options) { options = {}; }

    options.smooth = options.smooth || true;
    options.accept = options.accept || null;
    options.label = options.label || null;
    options.extensions = options.extensions || null;

    if (!options.filereader) {
      options.filereader = "deps/filereader.swf";
    }

    if (!options.expressInstall) {
      options.expressInstall = "deps/expressInstall.swf";
    }

    var fileReaderOptions = {};
    $(['multiple', 'accept', 'label', 'extensions', 'filereader', 'debugMode', 'callback']).each(function(i, option) {
      if (options[option]) {
        fileReaderOptions[option] = options[option];
      }
    });

    var processorOptions = {};
    $(['resize', 'smooth']).each(function(i, option) {
      if (options[option]) {
        processorOptions[option] = options[option];
      }
    });

    return this.each(function(idx, elem) {
      var elemName = $(elem).attr('name'),
          resultElem = $('<input name="' + elemName + '" type="hidden" />');
      $(elem).attr('name', elemName + "_file").
        prepend(resultElem).
        on('change', function(evt) {
        for (var i=0, length = evt.target.files.length; i<length; ++i) {
          var processor = new MagickProcessor($.extend(processorOptions, {
            result: resultElem
          }));

          var reader = new FileReader();
          reader.onload = function(re) {
            processor.loadImage(re.target.result).result();
          };

          reader.readAsDataURL(evt.target.files[i]);
        }
      }).fileReader(fileReaderOptions);
    });
  };

  /**
   *
   */
  var MagickProcessor = function(options) {
    this.options = options;
    this.canvas = this.createCanvas();
    this.ctx = this.canvas.getContext('2d');
    if (options.smooth) {
      this.ctx.webkitImageSmoothingEnabled = options.smooth;
      this.ctx.imageSmoothingEnabled = options.smooth;
      this.ctx.mozImageSmoothingEnabled = options.smooth;
      this.ctx.oImageSmoothingEnabled = options.smooth;
      delete options.smooth;
    }
    this.image = new Image();
    this.result = options.result;

    delete options.result;
  };

  MagickProcessor.prototype.createCanvas = function () {
    var canvas = window.document.createElement('canvas');
    canvas.style.border = "1px solid #fff";
    document.body.appendChild(canvas);
    if (typeof FlashCanvas !== "undefined") {
      FlashCanvas.initElement(canvas);
    }
    return canvas;
  };

  MagickProcessor.prototype.loadImage = function (dataUrl) {
    console.log("Loading image... ", dataUrl);
    var self = this;
    this.image.onload = function() {
      self.canvas.width = this.width;
      self.canvas.height = this.height;
      self.process();
    };
    this.image.src = dataUrl;
  };

  MagickProcessor.prototype.process = function () {
    var self = this;
    $.each(this.options, function (method, args) {
      if (!(args instanceof Array)) {
        args = [args];
      }
      self[method].apply(self, args)
    });
    $(this.result).val(this.canvas.toDataURL());
  };

  //
  // TODO: Basic ImageMagick resizing options
  //
  MagickProcessor.prototype.resize = function(param) {
    var width = this.image.width,
        height = this.image.height,
        dimensions = param.match(/(\d+)x(\d+)/),
        destWidth = dimensions[1],
        destHeight = dimensions[2],
        operation = param.match(/[!\<>\^\%]?/)[0],
        scaleX = 1, scaleY = 1;

    this.canvas.width = destWidth;
    this.canvas.height = destHeight;

    console.log(operation == "^");

    if (operation == "!") {
      // Ignore Aspect Ratio ('!')
      this.image.width = destWidth;
      this.image.height = destHeight;

    } else if (operation == "^") {
      // Fill Given Area ('^')
      scaleX = destWidth / this.image.width ;
      scaleY = destHeight / this.image.height ;
      console.log("Scale!", scaleX, scaleY);

    } else if (operation == "<") {
      // Only Enlarge Smaller ('<')

    } else if (operation == ">") {
      // Only Shrink Larger ('>')

    } else if (operation == "%") {
      // Percentage Resize ('%')

    } else {
    }

    if (scaleX !== 1 && scaleY !== 1) {
      this.ctx.scale(scaleX, scaleY);
    }

    this.ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height);
  };

})(window, jQuery);

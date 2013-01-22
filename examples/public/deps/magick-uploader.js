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
   * --------------
   *
   * Avaible options
   * - resize (String)
   * - smooth (Boolean)
   *
   * (fileReader polyfill)
   * - multiple (Boolean)
   * - accept (String)
   * - label (String)
   * - extensions (String)
   * - debugMode (Boolean)
   * - callback (Function)
   * - filereader (String)
   * - expressInstall (Function)
   *
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
    $(['resize', 'smooth', 'preview']).each(function(i, option) {
      if (options[option]) {
        processorOptions[option] = options[option];
      }
    });

    return this.each(function(idx, elem) {
      var elemName = $(elem).attr('name'),
          resultElem = $('<input name="' + elemName + '" type="hidden" />');

      $(elem).after(resultElem);
      $(elem).on('change', function(evt){
        for (var i=0, length = evt.target.files.length; i<length; ++i) {
          var processor = new MagickProcessor($.extend(processorOptions, {
            result: resultElem
          }));

          var reader = new FileReader();
          reader.onload = function(re) {
            processor.loadImage(re.target.result);
          };
          reader.readAsDataURL(evt.target.files[i]);
        }
      });

      // Activate FileReader polyfill if it is defined.
      if (typeof(window.FileAPIProxy) !== "undefined") {
        $(elem).fileReader(fileReaderOptions);
      }

      $(elem).attr('name', elemName + "_file");
    });
  };

  /**
   *
   */
  var MagickProcessor = function(options) {
    this.options = options;
    this.canvas = this.createCanvas(options.preview);
    delete options.preview;

    this.ctx = this.canvas.getContext('2d');
    this.image = new Image();

    if (options.smooth) {
      this.ctx.webkitImageSmoothingEnabled = options.smooth;
      this.ctx.imageSmoothingEnabled = options.smooth;
      this.ctx.mozImageSmoothingEnabled = options.smooth;
      this.ctx.oImageSmoothingEnabled = options.smooth;
      delete options.smooth;
    }

    this.result = options.result;

    delete options.result;
  };

  MagickProcessor.prototype.createCanvas = function (container) {
    var canvas = window.document.createElement('canvas');

    console.log("Container!", container);
    if (container) {
      $(container).append(canvas);
    }

    // Activate FlashCanvas polyfill if it is defined
    if (typeof FlashCanvas !== "undefined") {
      FlashCanvas.initElement(canvas);
    }

    return canvas;
  };

  MagickProcessor.prototype.loadImage = function (dataUrl) {
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
      self[method].apply(self, args);
    });
    $(this.result).val(this.canvas.toDataURL());
  };

  MagickProcessor.prototype.resizeCanvas = function(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
  };

  MagickProcessor.prototype.resize = function(param) {
    var width = this.image.width,
        height = this.image.height,
        dimensions = param.match(/([0-9]+)/g),
        destWidth = parseInt(dimensions[0], 10),
        destHeight = parseInt(dimensions[0] || dimensions[1], 10), // use same dimension from width if height is not set
        operation = param.match(/[!\<>\^\%]?$/),
        x = 0, y = 0,
        scaleX = 1, scaleY = 1;

    this.resizeCanvas(destWidth, destHeight);

    if (operation == "!") {
      // Ignore Aspect Ratio ('!')
      this.image.width = destWidth;
      this.image.height = destHeight;

    } else if (operation == "^") {
      // Fill Given Area ('^')
      scaleX = destWidth / this.image.width;
      scaleY = destHeight / this.image.height;

      this.ctx.scale(scaleX, scaleY);

      destWidth = this.image.width;
      destHeight = this.image.height;

      this.canvas.width = destWidth * scaleX;
      this.canvas.height = destHeight * scaleY;

      x = (this.canvas.width - destWidth) / 2;
      y = (this.canvas.height - destHeight) / 2;

    } else if (operation == "%") {
      // Percentage Resize ('%')
      scaleX = destWidth / 100;
      scaleY = destHeight / 100;

      this.ctx.scale(scaleX, scaleY);

      destWidth = this.image.width * scaleX;
      destHeight = this.image.height * scaleY;

      this.canvas.width = destWidth;
      this.canvas.height = destHeight;

    } else if (operation == "<") {
      // Only Enlarge Smaller ('<')
      destWidth = Math.max(this.image.width, destWidth);
      destHeight = Math.max(this.image.height, destHeight);

      if (this.image.width < destWidth) {
        destHeight = this.image.height * (destWidth / this.image.width);
      }
      if (this.image.height < destHeight) {
        destWidth = this.image.width * (destHeight / this.image.height);
      }

      this.resizeCanvas(destWidth, destHeight);


    } else if (operation == ">") {
      // Only Shrink Larger ('>')

      destWidth = Math.min(this.image.width, destWidth);
      destHeight = Math.min(this.image.height, destHeight);

      if (this.image.width != destWidth) {
        destHeight = this.image.height * (destWidth / this.image.width);
      }
      if (this.image.height != destHeight) {
        destWidth = this.image.width * (destHeight / this.image.height);
      }

      this.resizeCanvas(destWidth, destHeight);

    } else {
      // No special operation, just resize the image.
      if (this.image.width != destWidth) {
        destHeight = this.image.height * (destWidth / this.image.width);
      }
      if (this.image.height != destHeight) {
        destWidth = this.image.width * (destHeight / this.image.height);
      }

      this.resizeCanvas(destWidth, destHeight);
    }

    this.ctx.drawImage(this.image, x, y, destWidth, destHeight);
  };

})(window, jQuery);

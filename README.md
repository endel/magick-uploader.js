magick-uploader.js
===

Resize images on client-side before sending it to your server. It requires
FileAPI and Canvas features from your client browser, which may be polyfilled
using Flash bridges, such as [flashcanvas](http://code.google.com/p/flashcanvas)
and [FileReader](https://github.com/Jahdrien/FileReader).

How to use
---

    $(function() {
      $('input[type=file]').MagickUploader({ resize: "200x200^" });
    });

Browser compatibility (Native)
---

Supported natively:

 - Chrome 13+
 - Opera 11.1+
 - Opera Mobile 11.1+
 - Android 3.0+

Via polyfill:

 - Internet Explorer 7+
 - Safari 4+

License
---

This library is released under MIT License. Please see LICENSE file.

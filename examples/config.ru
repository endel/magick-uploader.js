require 'bundler/setup'
require 'sinatra'
require 'base64'

set :public_folder, 'public'

get '/' do
  content_type 'text/html'
  <<-HTML
<html>
  <head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
    <title>Magick Uploader</title>
    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>

    <!--[if IE]>
      <script type="text/javascript" src="deps/jquery.FileReader.js"></script>
      <script type="text/javascript" src="deps/flashcanvas.js"></script>
      <script type="text/javascript" src="deps/swfobject.js"></script>
    <![endif]-->

    <script type="text/javascript" src="deps/magick-uploader.js"></script>
    <script type="text/javascript" charset="utf-8">
      $(function() {
        var uploader = $('input[type=file]').MagickUploader({
          preview: $('.preview'),
          resize: "300x300",
          debugMode: true
        });
      });
    </script>

  </head>
  <body style="background: #000;">
    <form action="/" method="POST" enctype="multipart/form-data" >
      <input type="file" name="upload1" id="upload" /> <br />
      <!--
      <input type="file" name="upload2" id="upload" /> <br />
      <input type="file" name="upload3" id="upload" /> <br />
      <input type="file" name="upload4" id="upload" /> <br />
      -->
      <input type="submit" />

      <span class="preview" style="border: 1px solid #fff;"></span>
    </form>
  </body>
</html>
HTML
end

post '/' do
  puts params.inspect
  mime = params['upload1'].match(/data:([^;]*);/)[1]
  image_data = Base64.decode64(params['upload1'].split(',')[1])

  File.open("upload.#{mime.split('/')[1]}", "w+") do |f|
    f.write(image_data)
  end

  content_type mime
  image_data
end

run Sinatra::Application

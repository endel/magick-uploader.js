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
    <script type="text/javascript" src="deps/jquery.FileReader.js"></script>
    <script type="text/javascript" src="deps/flashcanvas.js"></script>
    <script type="text/javascript" src="deps/swfobject.js"></script>
    <script type="text/javascript" src="deps/magick-uploader.js"></script>
    <script type="text/javascript" charset="utf-8">
      $(function() {
        var uploader = $('input[type=file]').MagickUploader({
          resize: "200x200",
          debugMode: true
        });
      });
    </script>
  </head>
  <body style="background: #000;">
    <form action="/" method="POST" enctype="multipart/form-data" >
      <input type="file" name="upload" id="upload" />
      <input type="submit" />
    </form>
  </body>
</html>
HTML
end

post '/' do
  mime = params['upload'].match(/data:([^;]*);/)[1]
  File.open("upload.#{mime.split('/')[1]}", "w+") do |f|
    f.write( Base64.decode64(params['upload'].split(',')[1]) )
  end
end

run Sinatra::Application

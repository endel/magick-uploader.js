require 'bundler/setup'
require 'sinatra'

set :public_folder, 'public'

get '/' do
  content_type 'text/html'
  <<-HTML
    <html>
      <head>
        <meta http-equiv="content-type" content="text/html; charset=utf-8" />
        <title>Magick Uploader</title>
        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
        <script type="text/javascript" src="public/FileReader/jquery.FileReader.js"></script>
        <script type="text/javascript" src="public/FlashCanvas/flashcanvas.js"></script>
        <script type="text/javascript" src="public/swfobject/swfobject/swfobject.js"></script>
        <script type="text/javascript" src="public/magick-uploader.js"></script>
        <script type="text/javascript" charset="utf-8">
          $(function() {
            var uploader = new MagickUploader(document.getElementById('upload'));
          });
        </script>
      </head>
      <body>
        <form action="/" method="POST" enctype="multipart/form-data" >
          <input type="file" name="upload" id="upload" />
        </form>
      </body>
    </html>
  HTML
end

post '/' do
  puts params.inspect
end

run Sinatra::Application

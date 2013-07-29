var http = require('http')
  , fs = require('fs')
  , path = require('path')
  , url = require('url')
  , content_type = require('./mimemap').content_type
  , createStream
  , args
  , port;

args = process.argv.slice(2);
port = !isNaN(parseInt(args[0], 10)) ?  parseInt(args[0], 10) : 8000;


createStream = function (res, file) {
  var stream, pattern = /\.\w+$/, ct, match, ext;

  match = file.match(pattern);
  ext = match ? match.join('').replace(/\./g, '') : undefined;
  ct = (!match) ? 'binary' : (content_type(ext) || 'application/octet-stream');

  stream = fs.createReadStream(file);

  stream.on('error', function (err) {
    res.statusCode = 500;
    res.end(String(err));
  });

  if (ct) {
    res.writeHead(200, {'Content-type': ct});
  }
  stream.pipe(res);

  return stream;
};

http.createServer(function (req, res) {
  var uri, file, stream;

  uri = url.parse(req.url).pathname;
  file = path.join(process.cwd(), uri);

  if (uri === '/') {
    file = 'index.html';
  }

  fs.exists(file, function (exists) {
    if (exists) {
      stream = createStream(res, file);
    } else {
      res.writeHead(404);
      res.end('Error: file not found.');
      return;
    }
  });
}).listen(port);

console.log('Starting Http Server...on port %d', port);
console.log('  [ctrl-c] -> exit.');

process.on('uncaughtException', function (err) {
  console.log('ERROR: %s', err);
});
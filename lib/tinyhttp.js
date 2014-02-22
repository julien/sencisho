'use strict';

var http = require('http')
  , fs = require('fs')
  , path = require('path')
  , url = require('url')
  , mimemap = require('./mimemap')
  , cwd = process.cwd()
  , current_url;

function createStream(res, file) {
  var stream
    , pattern = /\.\w+$/
    , type
    , match
    , ext;

  if (typeof file === 'string') {
    match = file.match(pattern);
    ext = match ? match.join('').replace(/\./g, '') : undefined;
    type = (!match) ? 'binary' : (mimemap(ext) || 'application/octet-stream');


    stream = fs.createReadStream(file);
    stream.on('error', function (err) {
      res.statusCode = 500;
      res.end(String(err));
    });

    stream.pipe(res);
    res.writeHead(200, {'Content-type': type});
    return stream;

  } else {
    // it's a buffer
    res.writeHead(200, {'Content-type': 'text/html'});
    res.end(file.toString());
  }
}

function listDirectory(res, file) {
  var output = []
    , buffer;

  fs.readdir(file, function (err, files) {
    var i, l, f;
    if (err) {
      throw err;
    }

    output.push('<ul>');

    l = files.length;
    for (i = 0; i < l; i += 1) {
      f = files[i];
      if (!(/^\./.exec(f))) {
        output.push('<li><a href="' + path.join(current_url, f) + '">' + f + '</a></li>');
      }
    }
    output.push('</ul>');
    buffer = new Buffer(output.join('\n'));
    createStream(res, buffer);
  });
}

function checkFile(res, file) {
  var indexFile = path.resolve(file, 'index.html');

  fs.stat(file, function (err, stats) {
    if (err) {
      throw err;
    }
    if (stats.isDirectory()) {
      if (fs.existsSync(indexFile)) {
        createStream(res, indexFile);
      } else {
        listDirectory(res, file);
      }
    } else {
      createStream(res, file);
    }
  });
}


function requestListener(req, res) {
  var uri, file, stream;

  current_url = req.url;

  uri = decodeURIComponent(url.parse(req.url).pathname);
  file = path.join(process.cwd(), uri);

  fs.exists(file, function (exists) {
    if (exists) {
      checkFile(res, file);
    } else {
      res.writeHead(404);
      res.end('... Error: file not found.');
      return;
    }
  });
}

module.exports = function tinyhttp() {
  var server = http.createServer(requestListener);
  server.stop = function () {
    server.close();
  };
  return server;
};


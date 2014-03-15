'use strict';

var http = require('http')
  , fs = require('fs')
  , path = require('path')
  , url = require('url')
  , Transform = require('stream').Transform
  , util = require('util')
  , mimemap = require('./mimemap')
  , cwd = process.cwd()
  , snippet_regex = /\s*<script src\=\"http:\/\/.*\:[0-9]+\/livereload\.js\?snipver\=1\"\><\/script>\s*/gi
  // FIX: hardcoded livereload port
  , snippet = "<script>document.write('<script src=\"http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1\"></' + 'script>')</script>"
  , current_url;

function AppendSnippet(options) {
  options || (options = {});
  Transform.call(this, options);
}

util.inherits(AppendSnippet, Transform);

AppendSnippet.prototype._transform = function(chunk, encoding, callback) {
  // remove any existing snippets
  chunk = chunk.replace(snippet_regex, '');
  // append snippet
  callback(null, chunk + snippet);
};

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

    stream = fs.createReadStream(file, {encoding: 'utf8'});

    stream.on('error', function (err) {
      res.statusCode = 500;
      res.end(String(err));
    });

    res.writeHead(200, {'Content-type': type});

    // append livereload snippet to html files
    if (ext === 'html') {
      stream = stream.pipe(new AppendSnippet({decodeStrings: false}));
    }

    stream.pipe(res);

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

function checkIndex(res, file) {
  var index_file = path.join(file, 'index.html');
  fs.exists(index_file, function (exists) {
    if (exists) {
      createStream(res, index_file);
    } else {
      listDirectory(res, file);
    }
  });
}

function checkFile(res, file) {
  fs.stat(file, function (err, stats) {
    if (err) {
      throw err;
    }
    if (stats.isDirectory()) {
      checkIndex(res, file);
    } else {
      createStream(res, file);
    }
  });
}

function requestListener(req, res) {
  var uri, file;

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

'use strict';

var http = require('http')
  , fs = require('fs')
  , path = require('path')
  , url = require('url')
  , Transform = require('stream').Transform
  , util = require('util')
  , zlib = require('zlib')
  , mimemap = require('./mimemap')
  , snippet = require('./snippet')
  , routes = require('./routes')
  , cwd = process.cwd()
  , acceptEncoding
  , isLive
  , current_url;

function addCacheHeaders(res, days) {
  var age;
  days = days && days > 1 ? days : 1

  if (res) {
    age = days * 24 * 60 * 60 * 1000;
    res.setHeader('Cache-Control', 'public, max-age=' + age);
    res.setHeader('Expires', new Date(Date.now() + age).toUTCString());
  }
}


function createStream(res, file) {
  var stream
    , pattern = /\.\w+$/
    , type
    , match
    , ext
    , lrport = process.env.LR_PORT || 35729;

  if (typeof file === 'string') {
    match = file.match(pattern);
    ext = match ? match.join('').replace(/\./g, '') : undefined;
    type = (!match) ? 'binary' : (mimemap(ext) || 'application/octet-stream');

    stream = fs.createReadStream(file);

    stream.on('error', function (err) {
      res.statusCode = err.statusCode || 500;
      res.end(String(err));
    });

    addCacheHeaders(res, 30);

    // TODO: cache before using gzip, but this works fine
    res.writeHead(200, {'Content-encoding': 'gzip', 'Content-type': type});
    stream.pipe(snippet.createSnippet(lrport)).pipe(zlib.createGzip()).pipe(res);

    // without gzip
    // res.writeHead(200, {'Content-type': type});
    // stream.pipe(snippet.createSnippet(lrport)).pipe(res);

    return stream;

  } else {
    // it's a buffer
    res.writeHead(200, {'content-type': 'text/html'});
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
    var location;
    if (exists) {
      location = path.normalize( [current_url, path.sep, path.basename(index_file)].join('') );

      res.statusCode = 302;
      res.setHeader('Location', location);
      res.end();
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


function sendReponse(res, data) {
  var key;

  if (res && data && data.body) {

    if (data.headers) {
      for (key in data.headers) {
        if (data.headers.hasOwnProperty(key)) {
          res.setHeader(key, data.headers[key]);
        }
      }
    } else {
      res.setHeader('Content-type', 'application/json');
    }

    // Add cache headers (30 days)
    addCacheHeaders(res, 30);

    res.statusCode = data.statusCode ? data.statusCode : 200;
    res.end(JSON.stringify(data.body));
  }
}


function requestListener(req, res) {
  var uri, file, data;

  current_url = req.url;

  uri = decodeURIComponent(url.parse(req.url).pathname);
  file = path.join(process.cwd(), uri);
  acceptEncoding = req.headers['accept-encoding'];
  data = routes.get(req.url);

  if (data) {
    sendReponse(res, data);
    return;
  }

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

module.exports = function tinyhttp(live) {

  isLive = live;

  var server = http.createServer(requestListener);
  server.stop = function () {
    server.close();
  };

  return server;
};

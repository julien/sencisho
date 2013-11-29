'use strict';

var http = require('http')
  , fs = require('fs')
  , path = require('path')
  , url = require('url')
  , mimemap = require('./mimemap')
  , cwd = process.cwd()
  , current_url
  , listing_path = cwd + path.sep + '.listing.html';

function createStream(res, file) {
  var stream
    , pattern = /\.\w+$/
    , type
    , match
    , ext;

  match = file.match(pattern);
  ext = match ? match.join('').replace(/\./g, '') : undefined;
  type = (!match) ? 'binary' : (mimemap(ext) || 'application/octet-stream');

  stream = fs.createReadStream(file);
  stream.on('error', function (err) {
    res.statusCode = 500;
    res.end(String(err));
  });

  // if (type) {
  res.writeHead(200, {'Content-type': type});
  // }

  stream.pipe(res);
  return stream;
}

function listDirectory(res, file) {

  var writeStream = fs.createWriteStream(listing_path);
  
  fs.readdir(file, function (err, files) {
    var i, l, file;
    if (err) {
      // TODO: shouldn't we just return?
      throw err;
    }
    writeStream.write('<ul>');
    l = files.length;
    for (i = 0; i < l; i += 1) {      
      file = files[i];
      if (!(/^\./.exec(file))) {
        writeStream.write('<li><a href="' + path.join(current_url, file) + '">' + file + '</a></li>');
      }
    }
    writeStream.end('</ul>');
    writeStream.on('finish', function () {
      createStream(res, writeStream.path);
    });
  });
}

function checkFile(res, file) {
  fs.stat(file, function (err, stats) {
    if (err) {
      throw err;
    }
    stats.isDirectory() ? listDirectory(res, file) : createStream(res, file);
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
    } else  {
      res.writeHead(404);
      res.end('Error: file not found.');
      return;
    }
  }); 
}

module.exports = function tinyhttp() {
  var server = http.createServer(requestListener);


  server.stop = function () {
    fs.unlink(listing_path, function (err) {});
    server.close();
  };

  return server;
}; 


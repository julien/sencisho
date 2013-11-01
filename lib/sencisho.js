var http = require('http')
  , fs = require('fs')
  , path = require('path')
  , url = require('url')
  , content_type = require('./mimemap').content_type
  , currUrl
  , createStream
  , checkFile
  , args
  , port;

args = process.argv.slice(2);
port = (!isNaN(parseInt(args[0], 10))) ?  parseInt(args[0], 10) : 8000;

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

listDir = function (res, file) {

  var writeStream = fs.createWriteStream('.listing.html');
  fs.readdir(file, function (err, files) {
    var i, l, file;
    if (err) {
      throw err;
    }
    writeStream.write('<ul>');
    l = files.length;
    for (i = 0; i < l; i += 1) {
      
      file = files[i];
      if (!(/^\./.exec(file))) {
        writeStream.write('<li><a href="' + path.join(currUrl, file) + '">' + file + '</a></li>');
      }
    }
    writeStream.end('</ul>');
    writeStream.on('finish', function () {
      createStream(res, writeStream.path);
    });
  });
};

checkFile = function (res, file) {

  var cmd;

  fs.stat(file, function (err, stats) {
    if (err) {
      throw err;
    }
    if (stats.isDirectory()) {
      listDir(res, file);
    } else {
      createStream(res, file);
    }
  });

};

http.createServer(function (req, res) {
  var uri, file, stream, index;

  currUrl = req.url;
  uri = url.parse(req.url).pathname;
  
  if (uri === '/') {
    uri = currUrl = '/index.html';
    index = 1;
  }

  file = path.join(process.cwd(), uri);
 
  fs.exists(file, function (exists) {
    if (exists) {
      checkFile(res, file);
    } else  {
      if (!index) {
        res.writeHead(404);
        res.end('Error: file not found.');
        return;
      } else {
        listDir(res, path.join(process.cwd()));
      }
    }
  });
}).listen(port);
console.log('Starting Http Server...on port %d', port);
console.log('  [ctrl-c] -> exit.');


process.on('uncaughtException', function (err) {
  console.log('ERROR: %s', err);
});

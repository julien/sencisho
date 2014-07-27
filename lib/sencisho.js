'use strict';

var http = require('http')
  , util = require('util')
  , os = require('os')
  , spawn = require('child_process').spawn
  , tinyhttp = require('./tinyhttp')
  , open = require('./open')
  , watch = require('gaze')
  , reload = require('./reload')
  , args = process.argv.slice(2)
  , server
  , port = 8000
  , live = false
  , paths
  , browser
  , reloader;

// parse options
while (args.length > 0) {
  var arg = args.shift();
  switch (arg) {
  case '--live':
  case '-l':
    live = true;
    break;
  case '--port':
  case '-p':
    var p = parseInt(args.shift(), 10);
    if (p) {
      port = p;
    }
    break;
  case '--browser':
  case '-b':
    browser = args.shift();
    break;
  case '--watch':
  case '-w':
    paths = args.slice();
    break;
  }
}

server = tinyhttp(live);

if (live) {
  reloader = reload();
}

process.on('uncaughtException', function (err) {
  console.log('%s ERROR: %s', os.EOL, err);
});

process.on('SIGINT', function () {
  server.stop();
  if (live) {
    reloader.stop();
  }
  process.exit(1);
});

server.on('close', function () {
  console.log('bye bye!');
});

server.on('error', function (err) {
  console.log('server error', err);
  if (err.code === 'EACCES' || err.code === 'EADDRINUSE') {
    console.log(os.EOL, '... Failed, starting server on port %d', port);
    console.log('... Retrying', os.EOL);

    port = (port < 3000) ? 3000 : port += 1;
    server.listen(port);
  }
});

server.on('listening', function () {
  console.log(os.EOL + '... Starting Http Server on port %d', port);
  console.log('  [ctrl-c] -> exit.', os.EOL);

  open('http://localhost:' + port, browser);
});

server.listen(port);

if (live) {
  reloader.start();
  
  if (paths) {
    paths = util.isArray(paths) ? paths : [paths];
  } else {
    paths = [];
  }
  paths.push('*.html');

  watch(paths, function (err, watcher) {
    watcher.on('changed', function (filepath) {
      reloader.notify(filepath);
    });
  });
}

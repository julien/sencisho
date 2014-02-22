'use strict';

var http = require('http')
  , tinylr = require('tiny-lr')
  , watchr = require('watchr')
  , baseDir
  , watches = []
  , active = 0
  , lr
  , port;

function add(src, elem) {
  var it = src.length;

  while ((it -= 1) >= 0) {
    if (src[it] === elem) {
      return false;
    }
  }
  src.push(elem);
  return true;
}

function notifyChange(path) {
  var url = [
    'http://localhost:',
    port,
    '/changed?files=',
    path  
  ].join('');

  http.get(url, function (res) {
    // console.log('... LiveReload response: ', res.statusCode);
    if (res.statusCode === 200) {
      console.log('... Reload: ', path);
    }
  }).on('error', function (err) {
    console.log('... LiveReload change error: ', err);
  });
}

function log(logLevel) {
  // console.log('LOG', logLevel);
}

function error(err) {
  console.log('... Watch error : ', err);
}

function watching(err, watcherInstance, isWatching) {
  if (err) {
    console.log('... Watch error: ', watcherInstance.path);
  }
}

function change(changeType, filePath, fileCurrentState, filePreviousStat) {
  // TODO: check all "changeType" values.
  // console.log('... Watch change:', changeType, filePath);
  
  if (changeType === 'update') {
    notifyChange(filePath.replace(baseDir, ''));
  }
}

function next(err, watchers) {
  if (err) {
    return console.log('... Watching everything failed ', err);
  } else {
    console.log('... Watch enabled');
  }
}

function setupWatch() {
  watchr.watch({
    paths: watches,
     listeners: {
      log: log,
      error: error,
      watching: watching,
      change: change
     },
     next: next
  });
}

function startWatchr(path) {
  if (!active) {
    active = 1;
    add(watches, path);
    setupWatch();
  }
}

function done() {
  console.log('... Livereload listening on port %s', port);
}

function changePort() {
  port = (port > 1000) ? port -= 1 : 35729;
  startServer();
}

function startServer() {
  var srv;
  port = port || 35729;

  if (!lr) {
    lr = tinylr();
    lr.server.on('error', function (err) {
      if (err && err.code === 'EADDRINUSE') {
        console.log('... Failed starting livereload server');
        console.log('... Retrying');
        lr = null;
        changePort();
      }
    });
    lr.listen(port, done);
  }
}
  
module.exports = function (path) {
  if (!!path) {
    baseDir = path;
    startWatchr(path);
    startServer();
  }
};

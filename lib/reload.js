'use strict';

var os = require('os')
  , EventEmitter = require('events').EventEmitter
  , path = require('path')
  , tinylr = require('tiny-lr')
  , emitter = new EventEmitter()
  , lr
  , port;

function notifyChange(filepath) {
  // we need to make it relative to the server root
  filepath = path.relative(__dirname, filepath);

  lr.changed({
    body: {
      files: [filepath]
    }
  });
}

function done() {
  console.log('... Livereload listening on port %s', port);
}

function changePort() {
  port = (port > 1000) ? port -= 1 : 35729;

  emitter.emit('reload:change:port', port);

  createServer().start();
}

function createServer() {
  port = port || 35729;

  if (!lr) {
    lr = tinylr();
    lr.server.on('error', function (err) {
      if (err && err.code === 'EADDRINUSE') {
        console.log('... Failed starting livereload server');
        console.log('... Retrying', os.EOL);
        lr = null;
        changePort();
      }
    });
  }

  return {
    notify: notifyChange,
    start: function () {
      lr.listen(port, done);
    },
    stop: function () {
      lr.close();
    },
    on: function (event, handler) {
      emitter.on(event, handler);
    },
    off: function (evenit, handler) {
      emitter.off(event, handler);
    }
  };
}

module.exports = createServer;

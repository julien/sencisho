'use strict';

var os = require('os')
  , path = require('path')
  , tinylr = require('tiny-lr')
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
    }
  };
}

module.exports = createServer;

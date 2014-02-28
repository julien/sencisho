'use strict';

var http = require('http')
  , os = require('os')
  , tinylr = require('tiny-lr')
  , lr
  , port;
  
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


function done() {
  console.log('... Livereload listening on port %s', port);
  console.log('Include this script in your HTML document');
  console.log('<script src="http://localhost:' + port + '/livereload.js?snipver=1"></script>');
}

function changePort() {
  port = (port > 1000) ? port -= 1 : 35729;
  startServer();
}

function startServer() {
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
    lr.listen(port, done);
  }

  return {
    notify: notifyChange,
    stop: function () {
      lr.close();
    }
  };
}
 
module.exports = function () {
  return startServer();
};

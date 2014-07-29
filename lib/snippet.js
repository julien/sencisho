'use strict';

var util = require('util')
  , Transform = require('stream').Transform
  , pattern = /\s*<script src\=\"http:\/\/.*\:[0-9]+\/livereload\.js\?snipver\=1\"\><\/script>\s*/gi
  , html = "<script>document.write('<script src=\"http://' + (location.host || 'localhost').split(':')[0] + ':$PORT/livereload.js?snipver=1\"></' + 'script>')</script>"
  , condition
  , port;

function generate(port) {
  port = port || 35729;
  return html.replace('\$PORT', port);
}


function Snippet(options) {
  options || (options = {});
  Transform.call(this, options);
}

util.inherits(Snippet, Transform);

Snippet.prototype._transform = function(chunk, encoding, callback) {
  var chunkStr = chunk.toString();
  
  if (pattern.exec(chunkStr) && condition) {
    chunkStr = chunkStr.replace(pattern, '');
    this.push(chunkStr);
    callback(null, generate(port));
  } else {
    callback(null, chunk);
  }
};

module.exports = {
  generate: generate,

  createSnippet: function (active, lrport) {
    condition = active || true;
    port = lrport;
    return new Snippet();
  }
};

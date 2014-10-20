'use strict';

var fs = require('fs')
  , reload = require('./reload')()
  , routes = {}
  , map;

exports.map = function (file) {
  var stream = fs.createReadStream(file)
    , buffer = [];

  stream.on('error', function (err) {  });

  stream.on('data', function (chunk) {
    buffer.push(chunk.toString());
  });

  stream.on('end', function (chunk) {
    var data;
    try {
      routes = JSON.parse(buffer.join(''));
    } catch (e) {
      return;
    }
  });

  return stream;
};

exports.get = function (url) {
  return routes[url];
};

exports.all = function (fn) {
  var i = 0, l = routes.length;

  for (; i < l; i++) {
    if (fn && typeof fn === 'function') {
      fn(route[i]);
    }
  }

  return routes;
};

exports.check = function (filepath, cb) {

 fs.exists(filepath, function (exists) {
  var res = exists ? filepath : exists;
  cb(res);
 });

};

reload.on('reload:change:file', function (filepath) {
  var match;
  routes = {};

  match = filepath.match(/\.\w+$/);
  if (match && match[0] === '.json') {
    exports.map(filepath);
  }

});

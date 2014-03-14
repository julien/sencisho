'use strict';

var http = require('http')
  , os = require('os')
  , events = require('events')
  , watchr = require('watchr')
  , util = require('util')
  , basePath
  , emitter;


function Emitter() {
  events.EventEmitter.call(this);
}
util.inherits(Emitter, events.EventEmitter);

function onLog(logLevel) {
  // console.log('LOG', logLevel);
}

function onError(err) {
  // console.log('... Watch error : ', err);
  emitter.emit('error', errr);
}

function onWatching(err, watcherInstance, isWatching) {
  if (err) {
    emitter.emit('error', watcherInstance.path);
  }
}

function onChange(changeType, filePath, fileCurrentState, filePreviousStat) {
  emitter.emit('change', {
    type: changeType,
    absPath: filePath, 
    relPath: filePath.replace(basePath, '')
  });
}

function onNext(err, watchers) {
  if (err) {
    return emitter.emit('error', err);
  } else {
    emitter.emit('start');
  }
}

function watch(path) {
  if (!emitter) {
    emitter = new Emitter();
    basePath = path;

    watchr.watch({
      paths: [basePath], 
      listeners: { log: onLog, error: onError, 
        watching: onWatching, change: onChange },
      next: onNext
    });
  }
  return emitter;
}

module.exports = function (path) {
  if (typeof path !== 'string') {
    throw new Error('Expecting string, got: ' + path);
  }

  return watch(path);
};

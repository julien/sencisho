'use strict';

var exec = require('child_process').exec;

function escape(s) {
  return s.replace(/"/g, '\\\"');
}

// open a file or uri using the default application for the file type
module.exports = function (target, appName) {
  var cmd = {
    darwin: 'open' + (appName ? ' -a ' : ''),
    win32: 'start ""'
  };

  var opener = cmd[process.platform] + (appName ? ' "' + escape(appName) + '"' : '');

  return exec(opener + ' "' + escape(target) + '"');
};

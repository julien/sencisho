var exec = require('child_process').exec
  , path = require('path');

// open a file or uri using the default application for the file type
function open(target, appName) {
  var opener;

  if (process.platform === 'darwin') {
    if (appName) {
      opener = 'open -a "' + escape(appName) + '"';
    } else {
      opener = 'open';
    }
  } else if (process.platform === 'win32') {
    // if the first parameter to start is quoted, it uses that as the title
    // so we pass a blank title so we can quote the file we are opening
    if (appName) {
      opener = 'start "" "' + escape(appName) + '"';
    } else {
      opener = 'start ""';
    }
  }

  return exec(opener + ' "' + escape(target) + '"');
}

function escape(s) {
  return s.replace(/"/g, '\\\"');
}

module.exports = open;

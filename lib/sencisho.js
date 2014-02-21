var http = require('http')
  , os = require('os')
  , tinyhttp = require('./tinyhttp')
  , open = require('./open')
  , server
  , args
  , port
  , appName;

args = process.argv.slice(2);
port = !!(parseInt(args[0], 10)) ?  parseInt(args[0], 10) : 8000;
appName = args[1] || args[0];

process.on('uncaughtException', function (err) {
  console.log('%s ERROR: %s', os.EOL, err);
});
process.on('SIGINT', function () {
  server.stop();
  process.exit(1);
});

server = tinyhttp().listen(port);
server.on('close', function () {
  console.log('die');
});
open('http://localhost:' + port, appName);
console.log('Starting Http Server...on port %d', port);
console.log('  [ctrl-c] -> exit.');


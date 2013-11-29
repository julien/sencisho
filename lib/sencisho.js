var http = require('http')
  , os = require('os')
  , tinyhttp = require('./tinyhttp')
  , server
  , args
  , port;

args = process.argv.slice(2);
port = !!(parseInt(args[0], 10)) ?  parseInt(args[0], 10) : 8000;

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
console.log('Starting Http Server...on port %d', port);
console.log('  [ctrl-c] -> exit.');


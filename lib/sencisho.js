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


function startServer(port) {
  server = tinyhttp().listen(port);
  server.on('close', function () {
    console.log('bye bye!');
  });
  console.log('Starting Http Server...on port %d', port);
  console.log('  [ctrl-c] -> exit.');

  open('http://localhost:' + port, appName);
}

function changePort() {
  port = (port < 3000) ? 3000 : port += 1;
}

process.on('uncaughtException', function (err) {

  if (err.code === 'EACCES' || err.code === 'EADDRINUSE') {

    console.log('Failed, starting server on port %d', port);
    console.log('Retrying ... %s', os.EOL);

    changePort();
    startServer(port);

    return;
  }
  console.log('%s ERROR: %s', os.EOL, err);
});

process.on('SIGINT', function () {
  server.stop();
  process.exit(1);
});

startServer(port);


var http = require('http')
  , os = require('os')
  , spawn = require('child_process').spawn
  , tinyhttp = require('./tinyhttp')
  , open = require('./open')
  , watch = require('./watch')
  , server
  , args
  , port
  , appName
  , watchExp
  , watchArg
  , watchProc
  , useWatch;

args = process.argv.slice(2);
port = !!(parseInt(args[0], 10)) ?  parseInt(args[0], 10) : 8000;
appName =  args[1] || args[0];

// check if we want to enable file watching
watchExp = /\-{2}live/g;
watchArg = args.join('').replace(/[^-]*/, '');
useWatch = !!watchExp.exec(watchArg);

function startServer(port) {
  server = tinyhttp().listen(port);
  server.on('close', function () {
    console.log('bye bye!');
  });

  console.log(os.EOL + '... Starting Http Server on port %d', port);
  console.log('  [ctrl-c] -> exit.', os.EOL);

  // only runs once?
  open('http://localhost:' + port, appName);
}

function startWatching(path) {
  watch(path); 
}

process.on('uncaughtException', function (err) {
  if (err.code === 'EACCES' || err.code === 'EADDRINUSE') {
    console.log(os.EOL, '... Failed, starting server on port %d', port);
    console.log('... Retrying', os.EOL);

    port = (port < 3000) ? 3000 : port += 1;
    startServer(port);
    return;
  }

  console.log('%s ERROR: %s', os.EOL, err);
});

process.on('SIGINT', function () {
  server.stop();

  // TODO: also kill watch and livereload server
  // in case exiting the main process won't kill them.
  process.exit(1);
});

startServer(port);
if (useWatch) {
  startWatching(process.cwd());
}


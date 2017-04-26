'use strict';

var assert = require('assert')
var http = require('http');
var tinyhttp = require('../lib/tinyhttp');

describe('tinyhttp', function () {

  var server;

  beforeEach(function () {
    server = tinyhttp(false);
    server.listen(8000);
  });

  afterEach(function () {
    server.stop();
    server = null;
  });

  it('should serve an index page', function (done) {

    http.request({
      host: 'localhost',
      port: 8000,
    }, function (res) {

      assert.deepEqual(res.statusCode, 200);

      var buf = new Buffer('');

      res.on('data', function (chunk) {
        buf = Buffer.concat([buf, new Buffer(chunk)]);
      }).on('end', function () {

        var s = buf.toString();

        assert.notDeepEqual(s, '');
        assert.notDeepEqual(s.length, 0);

        done();
      });

    }).end();

  });

  it('should not allow directory traversal', function (done) {

    http.request({
      host: 'localhost',
      port: 8000,
      path: '/..%2f..%2f..%2f..%2f..%2f..%2f..%2f..%2f..%2f..%2fetc/passwd'
    }, function (res) {

      assert.deepEqual(res.statusCode, 403);

      var buf = new Buffer('');

      res.on('data', function (chunk) {
        buf = Buffer.concat([buf, new Buffer(chunk)]);
      }).on('end', function () {

        var s = buf.toString();

        assert.deepEqual(s, 'Forbidden');
        assert.notDeepEqual(s.length, 0);

        done();
      });

    }).end();

  });

});

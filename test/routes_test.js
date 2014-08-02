'use strict';

var assert = require('assert')
  , routes = require('../lib/routes');

describe('routes', function () {

  it('should read a json file', function () {
    var all;
    routes.map('./test/api.json');

    all = routes.all();
    assert.notDeepEqual(all, undefined);
  });

  it('should contain the routes from the json file', function () {
    var all = routes.all();
    assert.notDeepEqual(all, undefined);
    assert.notDeepEqual(all['/test'], undefined);
  });

  it('should filter a route', function () {
    assert.notDeepEqual(routes.filter('/test'), undefined);
    assert.deepEqual(routes.filter('/non-existing'), undefined);
  });



});

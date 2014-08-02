'use strict';

var assert = require('assert')
  , routes = require('../lib/routes');

describe('routes', function () {

  it('should be loaded from a .json file', function () {
    var all;
    routes.map('./test/api.json');
    all = routes.all();
    assert.notDeepEqual(all, undefined);
  });

  it('should contain the routes from the .json file', function () {
    var all = routes.all();
    assert.notDeepEqual(all, undefined);
    assert.notDeepEqual(all['/api/test'], undefined);
  });

  it('should filter a route', function () {
    assert.notDeepEqual(routes.get('/api/test'), undefined);
    assert.deepEqual(routes.get('/non-existing'), undefined);
  });

});

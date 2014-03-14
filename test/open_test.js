'use strict';

var assert = require('assert')
  , open = require('../lib/open');

describe('open', function () {

  it('should create a child process object', function () {
    var child = open('http://google.com', 'foobar');
    assert.notDeepEqual(child, undefined);
    assert.notDeepEqual(child.kill(), false);
  });

}); 

'use strict';

var assert = require('assert')
  , snippet = require('../lib/snippet');

describe('snippet', function () {

  it('should generate a string', function () {
    var str = snippet.generate('8888');

    assert.notDeepEqual(str, undefined);
    assert.notDeepEqual(str.length, 0);

    assert.notDeepEqual(str.indexOf('8888'), -1);
    assert.notDeepEqual(str.match(/\b8888\b/), null);

  });

});

'use strict';

var assert = require('assert')
  , mimemap = require('../lib/mimemap');

describe('mimemap', function () {

  it('should return application/atom+xml', function () {
    assert.deepEqual(mimemap('atom'), 'application/atom+xml');
  });

  it('should return application/epub+zip', function () {
    assert.deepEqual(mimemap('epub'), 'application/epub+zip');
  });

  it('should return application/pdf', function () {
    assert.deepEqual(mimemap('pdf'), 'application/pdf');
  });

  it('should return application/javascript', function () {
    assert.deepEqual(mimemap('js'), 'application/javascript');
  });

  it('should return application/json', function () {
    assert.deepEqual(mimemap('json'), 'application/json');
  });

  it('should return image/bmp', function () {
    assert.deepEqual(mimemap('bmp'), 'image/bmp');
  });

  it('should return image/gif', function () {
    assert.deepEqual(mimemap('gif'), 'image/gif');
  });

  it('should return imgage/jpeg', function () {
    assert.deepEqual(mimemap('jpg'), 'image/jpeg');
  });

  it('should return imgage/png', function () {
    assert.deepEqual(mimemap('png'), 'image/png');
  });

  it('should return text/html', function () {
    assert.deepEqual(mimemap('html'), 'text/html');
  });
  
  it('should return application/x-font-ttf', function () {
    assert.deepEqual(mimemap('ttf'), 'application/x-font-ttf');
  });

  it('should return application/x-font-otf', function () {
    assert.deepEqual(mimemap('otf'), 'application/x-font-otf');
  });

  it('should return application/x-font-woff', function () {
    assert.deepEqual(mimemap('woff'), 'application/font-woff');
  });

  it('should return audio/mpeg', function () {
    assert.deepEqual(mimemap('mp3'), 'audio/mpeg');
  });

  it('should return audio/ogg', function () {
    assert.deepEqual(mimemap('ogg'), 'audio/ogg');
  });

  it('should return text/css', function () {
    assert.deepEqual(mimemap('css'), 'text/css');
  });

  it('should return undefined if nothing is specified', function () {
    assert.deepEqual(mimemap(), undefined);
  });

  it('should return undefined if nothing is found', function () {
    assert.deepEqual(mimemap('foobar'), undefined);
  });


}); 

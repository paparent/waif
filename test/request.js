/* global describe, it, before, beforeEach, after, afterEach */
var should = require('should');
var sinon = require('sinon');
var through = require('through');
var _ =  require('lodash');

var Waif = require('../');

var spy = sinon.spy(_middleware);

describe('request local service', function() {
  var waif = null;

  before(function() {
    waif = Waif.createInstance();
    this.service = waif('local')
      .use(_middleware)
      .listen();

    waif.start();
  });

  after(function() { waif.stop(); });

  afterEach(function() { spy.reset(); });

  it('request helper', function(doneFn) {
    var local = waif('local');

    local('/path/here', test);
    function test(err, resp, body) {
      should.not.exist(err);

      doneFn();
    }
  });

  it('pipe a file from a file hosting service', function(doneFn) {
    var local = waif('local');

    local('/filename.jpg')
      .pipe(through(pipeFn))
      .on('error', doneFn)
      .on('close', doneFn);

    function pipeFn(data) {
      this.queue(data);
    }
  });
});

//// Helpers

function _middleware(req, res, next) {
  res.send({msg: 'ok'});
}

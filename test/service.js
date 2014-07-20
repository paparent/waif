/* global describe, it, before, beforeEach, after, afterEach */
var should = require('should');
var Service = require('../state/service');

describe('Service state machine', function() {
  var service = null;

  before(function() {
    service = new Service('test');
  });

  it('is a state machine',  function() {
    should.exist(service.state);
    service.state.should.be.Function;
  });

  it('is in the root state', function() {
    service.state().name.should.equal('Initial');
  });
});

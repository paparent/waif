/* global describe, it, before, beforeEach, after, afterEach */
var should = require('should');

var state = require('state');

// Load the state machine definition
var smUri = require('../uri');

describe('URI state machine', function() {
  // plain javascript object
  var uri = {};

  // wrap the object with a state machine
  before(function() {
    state(uri, smUri);
  });

  it('makes objects stateful', function() {
    should.exist(uri.state);
    uri.state.should.be.Function;
  });

  it('should have Initial state', function() {
    uri.state().name.should.equal('Initial');
  });
});

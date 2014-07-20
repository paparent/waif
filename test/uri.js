/* global describe, it, before, beforeEach, after, afterEach */
var should = require('should');

var state = require('state');

// Load the state machine definition
var Uri = require('../state/uri');

describe('URI state machine', function() {
  // plain javascript object
  var uri = {};

  before(function() {
    uri = new Uri();
  });

  it('makes objects stateful', function() {
    should.exist(uri.state);
    uri.state.should.be.Function;
  });

  it('should have Initial state', function() {
    uri.state().name.should.equal('Initial');
  });

  it('should be able to change state', function() {
    // officially sanction method
    uri.state().change('Url');
    uri.state().name.should.equal('Url');

    // more convenient alias
    uri.state().go('Port');
    uri.state().name.should.equal('Port');

    // magic shorthand. not recommended
    uri.state('-> File');
    uri.state().name.should.equal('File');
  });
});

describe('change states with input', function() {
  var uri = null;

  // wrap the object with a state machine
  beforeEach(function() {
    uri = new Uri();
  });

  it('should handle ports', function() {
    uri.set(3000);
    uri.state().name.should.equal('Port');
  });


  it('should handle urls', function() {
    uri.set('http://api.example.com/v2');
    uri.state().name.should.equal('Url');
  });


  it('should handle filenames', function() {
    uri.set('/tmp/example.sock');
    uri.state().name.should.equal('File');
  });


  it('should consider no input a filename', function() {
    uri.set();
    uri.state().name.should.equal('File');
  });
});

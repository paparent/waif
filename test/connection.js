/* global describe, it, before, beforeEach, after, afterEach */
var should = require('should');

var state = require('state');

// Load the state machine definition
var smUri = require('../connection');

describe('URI state machine', function() {
  // plain javascript object
  var conn = {};

  // wrap the object with a state machine
  before(function() {
    state(conn, smUri);
  });

  it('makes objects stateful', function() {
    should.exist(conn.state);
    conn.state.should.be.Function;
  });

  it('should have Initial state', function() {
    conn.state().name.should.equal('Initial');
  });

  it('should be able to change state', function() {
    // officially sanction method
    conn.state().change('Url');
    conn.state().name.should.equal('Url');

    // more convenient alias
    conn.state().go('Port');
    conn.state().name.should.equal('Port');

    // magic shorthand. not recommended
    conn.state('-> File');
    conn.state().name.should.equal('File');
  });
});

describe('change states with input', function() {
  var conn = null;

  // wrap the object with a state machine
  beforeEach(function() {
    conn = {};
    state(conn, smUri);
  });

  it('should handle ports', function() {
    conn.set(3000);
    conn.state().name.should.equal('Port');
  });


  it('should handle urls', function() {
    conn.set('http://api.example.com/v2');
    conn.state().name.should.equal('Url');
  });


  it('should handle filenames', function() {
    conn.set('/tmp/example.sock');
    conn.state().name.should.equal('File');
  });


  it('should consider no input a filename', function() {
    conn.set();
    conn.state().name.should.equal('File');
  });
});

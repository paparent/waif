/* global describe, it, before, beforeEach, after, afterEach */
var should = require('should');
var Mode = require('../connection/mode');

describe('Connection mode state macine', function() {
  var mode = null;

  before(function() {
    mode = new Mode();
  });

  it('is a state machine',  function() {
    should.exist(mode.state);
    mode.state.should.be.Function;
  });

  it('is in the root state', function() {
    mode.state().name.should.equal('');
  });
});

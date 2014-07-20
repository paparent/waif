// State machine representing URI's
//
// Cleans up the logic of connecting via ports,
// urls or file sockets.

var state = require('state');
var isUrl = require('is-url');
var _ = require('lodash');

module.exports = state({
  // Possible states for the URI
  Initial: state('initial', {
    set: function(input) {
      this.input = input;
    },
    listen: function(input) {
      this.mode = 'listen';
      this.set(input);
    },
    forward: function(input) {
      this.mode = 'forward';
      this.set(input);
    }
  }),
  Url: state(),
  Port: state(),
  File: state(),

  // default for all
  get: function() {
    return this.input;
  },

  // noops in all but initial state.
  listen: function() {},
  forward: function() {}
});

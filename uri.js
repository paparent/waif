// State machine representing URI's
//
// Cleans up the logic of connecting via ports,
// urls or file sockets.

var state = require('state');

module.exports = state({
  // Possible states for the URI
  Initial: state('initial', {
    set: function(value) {
      this.input = value;
    }
  }),
  Url: state(),
  Port: state(),
  File: state(),

  // default for all
  get: function() {
    return this.input;
  }
});

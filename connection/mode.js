/**
* forwarding/listening state machine
*/

var state = require('state');

var Mode = function(options) {
  this.initialize();
  return this;
};

Mode.prototype.initialize = function() {
  // Applies an in-line state machine
  state(this, {
    Listening: state(),
    Forwarding: state()
  });
};

module.exports = Mode;

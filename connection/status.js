/**
* running/stopped state machine
*/

var state = require('state');

var Status = function(options) {
  this.initialize();
  return this;
};

Status.prototype.initialize = function() {
  // Applies an in-line state machine
  state(this, {
    Stopped: state('initial'),
    Running: state()
  });
};

module.exports = Status;

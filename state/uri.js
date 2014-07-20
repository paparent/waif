// State machine representing URI's
//
// Cleans up the logic of connecting via ports,
// urls or file sockets.

var state = require('state');
var isUrl = require('is-url');
var _ = require('lodash');


var Uri = function(options) {
  this.initialize();
  return this;
};

Uri.prototype.initialize = function() {
  state(this, {
    // Possible states for the URI
    Initial: state('initial', {

      // Change state based on input.
      set: function(input) {
        this.input = input;

        // format: 3000
        if (_.isNumber(input)) {
          this.state().go('Port');

          // format: 'http://api.example.com'
        } else if (isUrl(input)) {
          this.state().go('Url');

          // format: '/filename.sock' or undefined
        } else {
          this.state().go('File');
        }
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
};


module.exports = Uri;

// State machine representing URI's
//
// Cleans up the logic of connecting via ports,
// urls or file sockets.

var state = require('state');
var isUrl = require('is-url');
var _ = require('lodash');
var url = require('url');
var path = require('path');
var temp         = require('temp').track();

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

        // attempt each state in order.
        // guards will stop them.
        this.state().go('Port');
        this.state().go('Url');
        this.state().go('File');
      }
    }),
    Url: state({
      admit: { // format: 'http://api.example.com'
        Initial: function() { return isUrl(this.owner.input); }
      },
      arrive: function() {
        this.url = url.parse(this.input);
      }
    }),
    Port: state({
      admit: { // format: 3000
        Initial: function() { return _.isNumber(this.owner.input); }
      },
      arrive: function() {
        this.url = url.parse('http://127.0.0.1:' + this.input);
      }
    }),
    File: state({
      admit: { // format: '/filename.sock' or undefined
        Initial: function() { return true; }
      },
      arrive: function() {
        this.url = this.input || temp.path();
      } 
    }),

    // default for all
    get: function() {
      return this.url;
    },
  });
};


module.exports = Uri;

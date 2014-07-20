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

    Port: state({
      admit: { // format: 3000
        Initial: function() { return _.isNumber(this.owner.input); }
      },
      arrive: function() {
        this.url = url.parse('http://127.0.0.1:' + this.input);
      }
    }),

    Url: state({
      admit: { // format: 'http://api.example.com'
        Initial: function() { return isUrl(this.owner.input); }
      },
      arrive: function() {
        this.url = url.parse(this.input + '/');
      }
    }),

    File: state({
      admit: { // format: '/filename.sock' or undefined
        Initial: function() { return true; }
      },
      arrive: function() {
        this.filename = this.input || temp.path();
      },
      get: function() {
        return this.filename;
      },
      requestUrl: function(_path) {
        return 'unix:/' + path.join(this.filename, _path || '');
      },
      listenUrl: function() {
        return [this.filename];
      }
    }),

    // default for all
    get: function() {
      return this.url;
    },

    // append the request path.
    requestUrl: function(_path) {
      var _url = _.clone(this.url);
      var _path = (_path || '').replace(/^\//, '');
      _url.path = _url.pathname = url.resolve(_url.path, _path);
      return url.format(_url);
    },

    // always returns an array
    // due to http.listen(3000, '10.0.0.1');
    listenUrl: function() {
      return [url.port, url.hostname];
    }
  });
};


module.exports = Uri;

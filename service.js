
var assert       = require('assert');
var norma        = require('norma');
var debug        = require('debug')('waif:service');
var _            = require('lodash');

var Service      = require('./state/service');

// Each service is also an event emitter,
// to allow you to get notifications of
// start, stop and configure.

Service.createInstance = function(name) {
  var _service = new Service(name);

  // called directly
  var fn = function() {
    debug('request proxy on service: %s', name);
    return _service.request.apply(_service, arguments);
  };

  fn.instance = _service;

  var proxyMethods = [
    'request', 'forward', 'listen', 'use', 'start', 'stop', 'on', 'config'
  ];

  _(proxyMethods).each(function(method) {
    fn[method] = function() {
      _service[method].apply(_service, arguments);
      return fn;
    };
  });
  return fn;
};

module.exports = Service;



// stops listening on ports/sockets
// emits a stop event
Service.prototype.stop = function() {
  debug('stop on service: %s', this.name);
  this.emit('stop');
  this.running = false;
  if (this.type === 'listen') {
    this.app && this.app.close();
  }
  return this;
};

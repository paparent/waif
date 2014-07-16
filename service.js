var request = require('request');
var assert = require('assert');
var norma = require('norma');
var _ = require('lodash');


/**
* Service constructor.
*
* Instances will contain a map to all of the
* services that have been mounted onto the
* system.
*/
function Service(name) {
  assert(name, "service not supplied with name");

  this.name       = name;
  this.options    = {};
  this.middleware = [];
  this.type       = null;
  this.listenOn   = null;
  this.forwardTo  = null;
  this.running    = false;
  return this;
}

Service.createInstance = function(name) {
  var _service = new Service(name);

  // called directly
  var fn = function() {
    return _service.request.bind(_service);
  };

  fn.instance = _service;
  fn.request = _service.request.bind(_service);
  fn.forward = _service.forward.bind(_service);
  fn.listen  = _service.listen.bind(_service);
  fn.config  = _service.config.bind(_service);
  fn.use     = _service.use.bind(_service);
  fn.start   = _service.start.bind(_service);
  fn.stop    = _service.stop.bind(_service);
  return fn;
};

module.exports = Service;

// make a request against a service
Service.prototype.request = function() {
};

// mount services or paths
Service.prototype.use = function() {
  var args = norma('path:s? middleware:f', arguments);
  var options = args.options;
  this.middleware.push(options);
  return this;
};

// Mount a service on a unix domain socket.
Service.prototype.listen = function(listenOn) {
  assert.equal(this.type, null, 'service:'+this.name+' couldn\'t listen.');

  this.listenOn = listenOn;
  return this;
};

// Mount a service on a http server.
Service.prototype.forward = function(forwardTo) {
  assert.equal(this.type, null, 'service:'+this.name+' couldn\'t forward.');

  this.forwardTo = forwardTo;
  return this;
};

Service.prototype.config = function() {
  return this;
};

// builds an express app if needed
Service.prototype.start = function() {
  return this;
};

// stops listening on ports/sockets
Service.prototype.stop = function() {
  return this;
};



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
function Service() {
  this.options    = {};
  this.middleware = [];
  this.type       = null;
  this.listenOn   = null;
  this.forwardTo  = null;
  this.running    = false;
  return this;
}

Service.createInstance = function() {
  var _service = new Service();

  // called directly
  var fn = function() {
    console.trace();
    return _request.bind(_service);
  };

  fn.request = _request.bind(_service);
  fn.forward = _forward.bind(_service);
  fn.listen  = _listen.bind(_service);
  fn.config  = _config.bind(_service);
  fn.use     = _use.bind(_service);
  fn.start   = _start.bind(_service);
  fn.stop    = _stop.bind(_service);
  return fn;
};

module.exports = Service;

// make a request against a service
function _request() {
}

// mount services or paths
function _use() {
  var args = norma('path:s? middleware:o', arguments);
  var options = args.options();
  this.middleware.push(options);
}

// Mount a service on a unix domain socket.
function _listen(listenOn) {
  assert(this.type, 'service:'+this.name+' couldn\'t listen.');

  this.listenOn = listenOn;
}

// Mount a service on a http server.
function _forward(forwardTo) {
  assert(this.type, 'service:'+this.name+' couldn\'t forward.');

  this.forwardTo = forwardTo;
}

function _config() { }

// builds an express app if needed
function _start() { }

// stops listening on ports/sockets
function _stop() {}



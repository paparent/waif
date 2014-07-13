var request = require('request');
var norma = require('norma');
var _ = require('lodash');


/**
* Service constructor.
*
* Instances will contain a map to all of the
* services that have been useed onto the
* system.
*/
function Service(opts) {
  return this;
}

Service.prototype.args = _args;
Service.prototype.request = _request;
Service.prototype.listen = _listen;
Service.prototype.forward = _forward;
Service.prototype.config = _config;
Service.prototype.use = _use;

function _args(key, args) {
  var needs = {};

  return (needs[key]||_default)(args);
  function _default() { return arguments[0]; }
}

// Mounts a service and uses on a socket or port.
function _use() {
  // use app.use to ue an express app as midleware
}

// make a request against a service
function _request() {
  // wrap the request module
  // preload the path / host url / listenhost:port
  // append the path (if provided)
  // call the function (if given a path)
  // pass the callback (if provided)
}

// Mount a service on a unix domain socket.
function _listen() {
  // check for file in args
  // if file, open socket there
  // else create random file
  // open socket there or fail
}

// Mount a service on a http server.
function _forward() {
  // add server to service
}

// Configure a service.
function _config() { }


module.exports = Service;

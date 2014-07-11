var request = require('request');
var norma = require('norma');
var _ = require('lodash');


/**
* Service constructor.
*
* Instances will contain a map to all of the
* services that have been mounted onto the
* system.
*/
function Service(opts) {
  return this;
}

Service.prototype.args = _args;
Service.prototype.request = _request;
Service.prototype.local = _local;
Service.prototype.remote = _remote;
Service.prototype.config = _config;
Service.prototype.listen = _listen;
Service.prototype.use = _mount;

function _args(key, args) {
  var needs = {
    request:  norma.compile('s|o?, f?'),
    local: norma.compile('s|o?, s|o?, f?'),
    remote: norma.compile('s|o?, s|o?, f?'),
    listen: norma.compile('s|o?, s|o?, f?'),
    mount: norma.compile('s|o?, s|o?, f?'),
    config: norma.compile('s|o?, s|o?, f?')
  };

  return (needs[key]||_default)(args);

  function _default() { return arguments[0]; }
}

// make a request against a service
function _request() {
  // wrap the request module
  // preload the path / host url / localhost:port
  // append the path (if provided)
  // call the function (if given a path)
  // pass the callback (if provided)
}

// Mount a service on a unix domain socket.
function _local() {
  // check for file in args
  // if file, open socket there
  // else create random file
  // open socket there or fail
}

// Mount a service on a http server.
function _remote() {
  // add server to service
}

// Configure a service.
function _config() {
  // call app.configure on the mounted app
}

// Mounts a service and listens on a socket or port.
function _listen() {
  // listen on a port/socket, manually
}

// Mounts a service and uses on a socket or port.
function _mount() {
  // use app.use to ue an express app as midleware
}

module.exports = Service;

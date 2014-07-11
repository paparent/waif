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

function _args(key, args) {
  var needs = {
    request:  norma.compile('s|o?, f?'),
    local: norma.compile('s|o?, s|o?, f?'),
    remote: norma.compile('s|o?, s|o?, f?'),
    listen: norma.compile('s|o?, s|o?, f?'),
    config: norma.compile('s|o?, s|o?, f?')
  };

  var _default = [];
  return (needs[key]||_default)(args);
}

Service.prototype.request = _request;
function _request() {}

/**
* Mount a service on a unix domain socket.
*/
Service.prototype.local = _local;
function _local() {

}


/**
* Mount a service on a http server.
*/
Service.prototype.remote = _remote;
function _remote() {}

/**
* Mount a service on a http server.
*/
Service.prototype.config = _config;
function _config() {}

/**
* Mounts a service and listens on a socket or port.
*/
Service.prototype.listen = _listen;
function _listen() {

}

/**
* Mounts a service and uses on a socket or port.
*/
Service.prototype.use = _use;
function _use() {

}
module.exports = Service;

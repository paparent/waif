var request = require('request');
var norma = require('norma');
var _ = require('lodash');
var Service = require('./service');

/**
* Waif constructor.
*
* Instances will contain a map to all of the
* services that have been mounted onto the
* system.
*/
function Waif(opts) {
  this._services = {};
  return this.service.bind(this);
}

Waif.prototype.service = _service;
Waif.prototype.args = _args;
Waif.prototype.request = _request;

// retrieve or set a service
function _service() {
  var args = this.args('service', arguments);
  var name = args[0];
  if (!this._services[name]) {
    this._services[name] = new Service();
  }
  return this._services[name];
}

// Map needed arguments using norma
function _args(key, args) {
  var needs = {
    service: norma.compile('s'),
    request:  norma.compile('s?', 's|o?, f?'),
    config: norma.compile('s|o?, s|o?, f?')
  };

  var _default = [];
  return (needs[key]||_default)(args);
}

/**
*  Execute an HTTP request against a mounted microservice.
*
*  Get request object for any service that has been mounted,
*  which has been prepopulated with the right credentials
*  when when used.
*/
function _request() {
  // if not on service, and service arg
  //    make this a service request.
  // pass rest of args so service.request
  // if path
  //    makea request using service.request
}


module.exports = Waif;

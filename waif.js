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

Waif._instance = null;
Waif.getInstance = _getInstance;

module.exports = Waif._getInstance();



function _getInstance() {
  if(this.instance === null){
    this._instance = new Waif();
  }
  return this._instance;
}


// retrieve or set a service
function _service() {
  var args = _args('service', arguments);
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

var request = require('request');
var norma = require('norma');
var assert = require('assert');
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

// retrieve or set a service
Waif.prototype.service = function() {
  var args = norma('s', arguments);
  var name = args[0];

  if (!this._services[name]) {
    this._services[name] = Service.createInstance();
  }

  return this._services[name];
};

Waif.createInstance = function() {
  var _waif = new Waif();
  var fn = function() {
    var args = norma('s', arguments);
    var name = args[0];

    return _waif.service(name);
  };

  fn.createInstance = Waif.createInstance;

  return fn;
};

Waif._instance = null;
Waif.getInstance = _getInstance;

module.exports = Waif._getInstance();


function _getInstance() {
  if(this.instance === null){
    this._instance = Waif.createInstance();
  }
  return this._instance;
}



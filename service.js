var EventEmitter = require('events').EventEmitter;
var request      = require('request');
var assert       = require('assert');
var express      = require('express');
var logger       = require('morgan');
var norma        = require('norma');
var temp         = require('temp').track();
var isUrl        = require('is-url');
var util         = require('util');
var _            = require('lodash');

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

// Each service is also an event emitter,
// to allow you to get notifications of
// start, stop and configure.
util.inherits(Service, EventEmitter);

Service.createInstance = function(name) {
  var _service = new Service(name);

  // called directly
  var fn = function() {
    return _service.request.bind(_service);
  };

  fn.instance = _service;
  var proxyMethods = [
    'request', 'forward', 'listen', 'use',
    'start', 'stop', 'on', 'config'
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

// make a request against a service
Service.prototype.request = function() {
  assert.notEqual(this.type, null, 'service:'+this.name+' not mounted.');
  assert.notEqual(this.url, null, 'service:'+this.name+' has no url.');
  
  var args = norma('s, .*', arguments);
  args[0] = this.getUrl() + args[0];

  return request.apply(request, args);
};

// Get the URL to direct to.
Service.prototype.getUrl = function() {
  assert.notEqual(this.type, null, 'service:'+this.name+' not mounted.');
  return (this.type === 'listen') ? this.listenOn: this.forwardTo;
};

// Populate the target url.
Service.prototype.prepareUrl = function(url) {
  if (!url) {
    this.connType = 'file';
    return temp.path();
  } else if (_.isNumber(url)) {
    this.connType = 'port';
    return '127.0.0.1:'+url;
  } else if (isUrl(url)) {
    this.connType = 'url';
    return url;
  }
  return false;
};

// mount services or paths
Service.prototype.use = function() {
  var args = norma('{path:s? middleware:f}', arguments);
  this.middleware.push(args);
  return this;
};

// Mount a service on a unix domain socket.
Service.prototype.listen = function(listenOn) {
  assert.equal(this.type, null, 'service:'+this.name+' couldn\'t listen.');

  this.type = 'listen';
  this.url = this.prepareUrl(listenOn);
  return this;
};

// Mount a service on a http server.
Service.prototype.forward = function(forwardTo) {
  assert.equal(this.type, null, 'service:'+this.name+' couldn\'t forward.');

  this.type = 'forward';
  this.forwardTo = this.prepareUrl(forwardTo);
  return this;
};

// Set configuration. Emits an event to handle.
Service.prototype.config = function(options) {
  this.emit('config', options);
  return this;
};

// builds an express app if needed
// emits a start event
Service.prototype.start = function(server) {

  if (this.type === 'listen') {
    this.app = express();
    this.app.use(logger());
    _(this.middleware).each(function(mw) {
      console.log(mw);
      this.app.use(mw.middleware);
    }, this);
    this.app.listen(this.url);
    this.emit('start');
  }
  return this;
};

// stops listening on ports/sockets
// emits a stop event
Service.prototype.stop = function() {
  this.emit('stop');
  if (this.type === 'listen') {
    console.log(this.app);
    this.app && this.app.close();
  }
  return this;
};

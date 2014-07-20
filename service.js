var EventEmitter = require('events').EventEmitter;
var request      = require('request');
var assert       = require('assert');
var express      = require('express');
var norma        = require('norma');
var debug        = require('debug')('waif:service');
var temp         = require('temp').track();
var isUrl        = require('is-url');
var path         = require('path');
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

  debug('new service: %s', name);
  this.name       = name;
  this.options    = {};
  this.middleware = [];
  this.type       = null;
  this.connType   = null;
  this.url        = null;
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

// make a request against a service
Service.prototype.request = function() {
  assert.notEqual(this.type, null, 'service:'+this.name+' not mounted.');
  assert.notEqual(this.url, null, 'service:'+this.name+' has no url.');
  var args = norma('s, .*', arguments);

  var proto = (this.connType === 'socket') ? 'unix:/' : 'http://';
  var host = (this.connType === 'port') ? '127.0.0.1:' : '';

  args[0] = proto + host + path.join(this.url, args[0]);

  debug('request on service: %s, %o', this.name, args);
  return request.apply(request, args);
};

// Get the URL to direct to.
Service.prototype.getUrl = function() {
  
  assert.notEqual(this.type, null, 'service:'+this.name+' not mounted.');
  return (this.type === 'listen') ? this.listenOn: this.forwardTo;
};

// Populate the target url.
Service.prototype.prepareUrl = function(url) {
  debug('prepare url request on service: %s, %s', this.name, url);
  if (!url) {
    this.connType = 'socket';
    return temp.path();
  } else if (_.isNumber(url)) {
    this.connType = 'port';
    return url;
  } else if (isUrl(url)) {
    this.connType = 'url';
    return url;
  }
  return false;
};

// mount services or paths
Service.prototype.use = function() {
  var args = norma('s?, f}', arguments);
  this.middleware.push(_.compact(args));
  debug('use middlware on service: %s', this.name);
  return this;
};

// Mount a service on a unix domain socket.
Service.prototype.listen = function(listenOn) {
  debug('listen on service: %s', this.name);
  assert.equal(this.type, null, 'service:'+this.name+' couldn\'t listen.');

  this.type = 'listen';
  this.url = this.prepareUrl(listenOn);
  return this;
};

// Mount a service on a http server.
Service.prototype.forward = function(forwardTo) {
  debug('forward on service: %s', this.name);
  assert.equal(this.type, null, 'service:'+this.name+' couldn\'t forward.');

  this.type = 'forward';
  this.url = this.prepareUrl(forwardTo);
  return this;
};

// Set configuration. Emits an event to handle.
Service.prototype.config = function(options) {
  debug('config on service: %s', this.name);
  this.emit('config', options);
  return this;
};

// builds an express app if needed
// emits a start event
Service.prototype.start = function(server) {

  var name = this.name;
  var url = this.url;
  var app = null;

  if (this.type === 'listen') {
    debug('create app for service: %s', this.name);

    this.app = app = express();

    _(this.middleware).each(_use, this);

    app.listen(url, function(err) {
      debug('listen for service on url: %s, %s', name, url);
      assert.equal(err, null, 'service:'+name+' couldn\'t listen on '+url);
    });
  }

  debug('start on service: %s', this.name);
  this.running = true;
  this.emit('start');

  return this;

  function _use(mw) {
    app.use.apply(app, mw);
  }
};

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

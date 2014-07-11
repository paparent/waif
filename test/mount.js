/* global describe, it, before, beforeEach, after, afterEach */
var should = require('should');
var url = require('url');
var waif = require('waif')();
var service = require('./fixture/data-service');

describe('Mount', function() {
  describe('remote services', function() {
    var serviceUrl = 'http://service.example.com/'; 

    it('can be mounted as a url string', function() {
      waif.service('serviceName').remote(serviceUrl);
    });

    it('can be mounted as a parsed url object', function() {
      waif.service('serviceName').remote(url.parse(serviceUrl));
    });
  });

  describe('local services', function() {

    it('should create a random socket', function() {
      waif.service('serviceName').mount(service);
    });

    it('should allow you to specify a socket', function() {
      var filename = '/tmp/sockets/service-name';
      waif.service('serviceName')
          .local(filename)
          .mount(service);
    });

  });

  describe('listen services', function() {
    var service = express();

    waif.service('listenTest')
        .listen(3000)
        .mount(service);

    waif.service('listenTest')
        .listen('/path')
        .mount(service);
  });
});

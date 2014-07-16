/* global describe, it, before, beforeEach, after, afterEach */
var should = require('should');
var url = require('url');
var waif = require('../')();
var service = require('./fixture/data-service');

describe.skip('Mount', function() {
  beforeEach(function() {
    // make an instance
  });

  describe('remote services', function() {
    var serviceUrl = 'http://service.example.com/'; 

    it('can be mounted as a url string', function() {
      waif('serviceName').forward(serviceUrl);
    });

    it('can be mounted as a parsed url object', function() {
      waif('serviceName').forward(url.parse(serviceUrl));
    });
  });

  describe('local services', function() {

    it('should create a random socket', function() {
      waif('serviceName').use(service).listen();
    });

    it('should allow you to specify a socket', function() {
      var filename = '/tmp/sockets/service-name.socket';
      waif('serviceName')
        .mount(service)
        .listen(filename);
    });

  });

  describe('listen services', function() {
    before(function() {
      waif('listenTest')
        .use(service)
        .listen(3000);

      var filename = '/tmp/sockets/service-name.socket';
      waif('listenTest')
        .use(service)
        .listen(filename);
    });
  });
});

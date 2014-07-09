/* global describe, it, before, beforeEach, after, afterEach */
var should = require('should');

var Waif = require('waif');

describe('Mount', function() {
  describe('remote services', function() {

    var serviceUrl = 'http://service.example.com/'; 

    waif.mount('serviceName', serviceUrl);
    waif.mount('serviceName', url.parse(serviceUrl));
  });

  describe('local services', function() {
    var app = express();

    waif.mount('serviceName', app);

    var filename = '/tmp/sockets/service-name';
    waif.mount('serviceName', filename, app);
  });
  describe('expose services', function() {
    var app = express();

    waif.mount('serviceName', 3000, app);
  });
});

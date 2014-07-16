/* global describe, it, before, beforeEach, after, afterEach */
var should = require('should');


var Waif = require('../');

describe.skip('request service', function() {
  var waif = null;
  before(function() {
    waif = waif.createInstance();
  });

  it('request closure', function(doneFn) {
    waif('serviceName').request('/path/here', doneFn);
  });

  it('request via .appl', function(doneFn) {
    waif.request('serviceName', '/path/here', doneFn);
  });


  it('pipe a file from a file hosting service', function(doneFn) {
    /*var response = fs.createWriteStream('test');
    waif('file-service').request
      .get('/filename.jpg')
      .pipe(response);*/
  });
});

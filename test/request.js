/* global describe, it, before, beforeEach, after, afterEach */
var should = require('should');


var waif = require('waif');

describe('request service', function() {
  before(function() {

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

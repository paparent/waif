/* global describe, it, before, beforeEach, after, afterEach */
var should = require('should');
var sinon = require('sinon');
var data = require('./fixture/data-service');
var _ =  require('lodash');

var Waif = require('../');

var spy = sinon.spy(data);

describe('request local service', function() {
  var waif = null;

  before(function() {
    waif = Waif.createInstance();
    this.service = waif('local')
      .use(data)
      .listen();
    waif.start();
  });


  after(function() {
    waif.stop();
    spy.reset();
  });

  it('request helper', function(doneFn) {
    this.service('/path/here', test);

    function test(err, resp, body) {
      //spy.calledOnce;
      doneFn();
    }
  });

  it.skip('pipe a file from a file hosting service', function(doneFn) {
    /*var response = fs.createWriteStream('test');
    waif('file-service').request
      .get('/filename.jpg')
      .pipe(response);*/
  });
});

//// Helpers

function _middleware(req, res, next) {
  console.log(arguments);
  res.send({msg: 'ok'});
}

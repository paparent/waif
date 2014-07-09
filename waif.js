var request = require('request');
var norma = require('norma');
var _ = require('lodash');


/**
* Waif constructor.
*
* Instances will contain a map to all of the
* services that have been mounted onto the
* system.
*/
function Waif(opts) {
  this.services = {};
  return this;
}

/**
*  Execute an HTTP request against a mounted microservice.
*
*  Get request object for any service that has been mounted,
*  which has been prepopulated with the right credentials
*  when when used.
*/
Waif.prototype.request = _request;

function _request() {
  var args = this.requestNeeds(arguments);

  console.log(args);
}

Waif.prototype.requestNeeds = norma.compile('s, s|o?, f?');


/**
*  Mount a microservice onto Waif.
*
*  Each microservice is an connect-like http server,
*  that will get mounted on whichever path you specify.
*
*  @see tests/mount.js for examples
*/

Waif.prototype.mount = _mount;

function _mount() {
  var args = this.mountNeeds(arguments);
  console.log(args);
}

Waif.prototype.mountNeeds = norma.compile('s, s|i|o, o?, o?');



module.exports = Waif;

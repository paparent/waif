var request = require('request');
var norma = require('norma');

function Waif(opts) {
  this.services = {};
  return this;
}


Waif.prototype.requestNeeds = norma.compile('s, s|o?, f?');
Waif.prototype.mountNeeds = norma.compile('s, s|i|o, o?, o?');


/**
*  Execute an HTTP request against a mounted microservice.
*
*  Waif provides a simple wrapper around mikael's request
*  library, so that you don't end up with credentials in
*  your microservices.
*
*  Any service that has been mounted will have a request
*  object that has been prepopulated with the right credentials
*  when called.
* 
*    All services :
* 
*       waif.request('serviceName')('/path/here', callbackFn);
*       waif.request('serviceName', '/path/here', callbackFn);
*
*    Ex, to retrieve a file from a file hosting service :
*
*       waif.request('file-service')
*          .get('/filename.jpg')
*          .pipe(response);
*/

function _request() {
  var args = this.requestNeeds(arguments);
};
Waif.prototype.request = _request;





/**
*  Mount a microservice onto Waif.
*
*  Each microservice is an connect-like http server,
*  that will get mounted on whichever path you specify.
* 
*    Remote services :
* 
*       var serviceUrl = 'http://service.example.com/'; 
* 
*       waif.mount('serviceName', serviceUrl);
*       waif.mount('serviceName', url.parse(serviceUrl));
* 
*    Local services (unix domain sockets) :
* 
*      var app = express();
*    
*      waif.mount('serviceName', app);
*
*      var filename = '/tmp/sockets/service-name';
*      waif.mount('serviceName', filename, app);
*
*    Exposing service on a port :
*
*      var app = express();
*
*      waif.mount('serviceName', 3000, app);
*/

function _mount() {
  var args = this.mountNeeds(arguments);
};
Waif.prototype.mount = _mount;



module.exports = Waif;

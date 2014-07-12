__THIS LIBRARY IS IN THE FIRST STAGES OF DEVELOPMENT.  
DO NOT EXPECT IT TO WORK AT ALL YET.__

## Waif

Waif provides the smallest possible abstraction that would allow you to  
to write an express-based microservice that can be used as a local library  
or a remote instance.  

__Waif is developed by [Wayfinder](http://wayfinder.co) and is being used in production where we deploy our services using [Longshoreman](http://longshoreman.io)__

### How it works

Waif is a thin wrapper around express.js when we declare our  
services, and a thin wrapper around request when we call them.  

We make use of the fact that node's http server can also be mounted  
on a unix domain socket, avoiding the use of an open port.  

We also provide a simple utility to make requests to services  
you have registered with us, to avoid hardcoding any credentials  
in your services.

### Guidelines

These are things to keep in mind when developing microservices for use with Waif.  

#### Definition files keep the config out of services.

Each service may ship with zero or more service definition files.  

These files map out which services need to be made available, and allow  
you to assign names to each of these services.  

#### Avoid module.exports, define a REST API instead.

Services are just express apps that export the app instead of calling listen().  

By not opening a port, you gain the flexibility of being able to mount the server  
anywhere. This gives Waif the flexibility to mount services intended for the  
network, over unix domain sockets to use as an internal API.  

#### Doesn't matter where the service is running.

By using REST as the API layer, your services are no longer tied down.  

Whether you are calling your service via a socket attached to the same  
process, or a different process, or over tcp connecting to another machine,  
your service should be oblivious to it all.  

#### Doesn't matter where the service files are on the file system.

Each service may ship with zero or more services of their own.  

You could have as many services as you have include files, and they could  
be in relative included files, relatively included submodule directories or  
installed from npm. It's even valid to have a service that just has a definition  
file containing a map of other services (although unlikely).  

#### Consistent service names mean you can swap out implementations.

There may be multiple implementation for common service types.  

Store services are the one that come to mind here. By using a 'store' service  
to interact with our database, we gain the ability to swap out the mongodb  
store service, for a dummy implementation when writing tests.  

#### Write custom services when you need something more specific.

Services are not meant to be a generalized solution to all problems.  

If you have a custom listing that you need to generate from mongo, build a  
simple service to return the JSON for you. You can include it in the service  
you are building it for's codebase and just use it internally. You still  
benefit from increased testability, reduced complexity and the ability  
to scale it out when you finally need to one day.  

#### Populating credentials and configuration are out of scope.

This is a problem for the form of automated deployment you are using.  

Since running many services comes with an increase in deployment issues,  
you will need to figure out what works for service discovery for you.  

May I suggest [Longshoreman](http://longshoreman.io)  


### Example Service Definition File


```javascript
// filename: service.js

// Return a new instance of Waif.
var waif = require('waif')();

// Configuration.
var PORT = process.env.PORT || 3000;
var SOCKET = process.env.SOCKET || '/tmp/sockets/test-data.sock';
var MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/test";
var EVENT_URL = process.env.EVENT_URL || 'http://event.example.com';

// Declaring internally used service.
waif('store')                               // data access service.
  .use(require('waif-mongo-store'))         // uses mongo as a data store.
  .config({url: MONGO_URL})                 // mongo db configuration.
  .listen(SOCKET);                          // custom domain socket file.

// Same, but from a local include instead of npm.
waif('post-list')                           // custom data service.
  .use(require('./src/post-list'))          // uses a relative require.
  .config({url: MONGO_URL})                 // mongo db configuration.
  .listen();                                // random domain socket file.

// Declaring an external REST api.
waif('event')                               // event logging service.
  .config({ source: 'service:embed' })      // event source defaulted.
  .forward(EVENT_URL);                      // all requests directed here.

// Declaring a service to be mounted on another one.
// From a relative submodule, with it's own views.
// Note: the absence of forward() or listen()
waif('gallery')                             // photo gallery service.
  .use(require('./gallery'));               // relative submodule.


// Example application service
// Note how we .use() the waif('sandbox') service.
waif('example')                             // the example service itself.
  .use('/gallery', waif('sandbox'))         // mount the sandbox service.
  .use(require('./src/example'))            // mount the service' own app.
  .listen(PORT);                            // listen on a specific port.

// Start up the servers.
// Has a companion stop method which closes them all.
waif.start();
```

### Example Service

```javascript
// filename: src/example.js

// Get the waif instance.
var waif = require('waif')();

// Normal Express app.
var app = require('express')();

// Services are simple request wrappers.
var store = waif('store');
var postList = waif('postList');

// The REST is all up to you.
app.get('/post/:id', function(req, res, next) {
  store('/posts/' + req.param.id, _showBody('post');
});

app.get('/', function(req, res, next) {
  dataList('/', _showBody('list'));
});

// export app instead of listening on a porn
module.exports = app;

//// HELPERS

function _showBody(template) {
  return function(err, data) {
    if (err) { return next(err); }
    res.render('post', { body: data.body });
  };
}

```

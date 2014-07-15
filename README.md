__THIS LIBRARY IS IN THE FIRST STAGES OF DEVELOPMENT.  
DO NOT EXPECT IT TO WORK AT ALL YET.__

## Waif

Waif provides the smallest possible abstraction that would allow you to  
to write an express-based microservice that can be used as a local library  
or a remote instance.  

__Waif is developed by [Wayfinder](http://wayfinder.co) and is (almost) being  
used in production where we deploy our services using [Longshoreman](http://longshoreman.io).__

### How it works

Waif is a thin wrapper around express.js when we declare our  
services, and a thin wrapper around request when we call them.

It splits the declaration and configuration of the services,
from the implementation of them, into separate files.

Doing this allows you the greatest amount of flexibility
and scaleability, since you can run the service in many
environments.

#### Declaring a service

[Service Declaration Example](/example/service.js)

You always declare the services in a separate file from
where your implementation lists.

When you declare a service you:

1. Assign it a name (ie: 'event')
1. Provide the address to reach it. (remote or local)
1. Start a web server to host it. (optional, if local)
1. Providing configuration for it. (optional, service-specific)

If your service is remote :

```javascript
// The URL to _forward_ requests to this service to.
waif('event').forward('http://event.example.com');`
```

If you are hosting the service :

```javascript
// The middleware to _use_ to respond to this route
waif('example).use(require('./src/example'));

// Where to _listen_ for requests to this service
waif('example').listen(3000);

```

Waif will then keep track of the url you need
to provide to make a request against this service.

#### Using a service

In the services themselves, instead of having to use 
use the credentials directly, you just use
the service name.


Waif will use the credentials it was given in the service
declaration and provide you with a lightly wrapped request
function, with the details already included.


```javascript
     waif('event', '/path', opts, callbackFn);
```

#### Ways of hosting a service

Waif does not provide any hosting functionality above and
beyond the features of it's underlying technology.

It exposes some of this functionality to you via it's API
and keeps track of what you used so that it can tell the
service where to connect to.

When creating a webserver in Node.js, your listen method
supports several different formats.

```
// listen on port 3000
http.listen(3000);

// listen on port 3000, ip 127.0.0.1
http.listen('127.0.0.1:3000');

// listen on a random port
http.listen(0);

// listen on a unix domain socket
http.listen('/tmp/unix.socket');
```

Additionally, through the use of express middleware:
```javascript

// middleware compatible
app.use(expressApp);
app.use(expressRouter);
app.use(handlerFn);

// mounted on a specific path
app.use('/path', pathModule);



### About Service Configuration

Each repository may contain zero or more of
these entry points, which may represent one
or more environments.

These may map services differently depending
on how you need to access them.

How the configuration gets into Waif is entirely
up to the developer. It just provides the
API to declare them, in a way that the services
don't need to care about it.



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

May I suggest [Longshoreman](http://longshoreman.io)?   

### Example Service Definition File


```javascript
// filename: service.js
```

### Example Service

```javascript
// filename: src/example.js



```

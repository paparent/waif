Waif
====

Waif provides the smallest possible abstraction that would allow you to
to write an express-based microservice that can be used as a local library
or a remote instance.

We make use of the fact that node's http server can also be mounted
on a unix domain socket, avoiding the use of an open port.

We also provide a simple utility to make requests to services
you have registered with us, to avoid hardcoding any credentials
in your services.

__Waif is developed by [Wayfinder](http://wayfinder.co) and is being used in production where we deploy our services using [Longshoreman](http://longshoreman.io)__

Examples
--------

    var waif = require('waif')

    // register the event service as being hosted on an external server
    waif.mount('event', 'http://events.example.com');

    // register a service only used internally as being hosted on a unix socket.
    // this means it will not be exposed publicly, and you can still break it out later.
    waif.mount('fetch-results', require('fetch-results/src/app'));

    // register this service as being exposed on port 3000
    waif.mount('app', 3000, require('src/app'));

    // you can now make requests to any of these services using request.
    // This is a simple wrapper of Mikael's request module.
    waif.request('fetch-results', '/path/goes/here').then(callback);



/**
* Example Waif service.
*
* Waif services are standard express apps, but instead
* of listening to a connection on their own, they export
* the app object.
*
* These apps are going to be mounted in express, but
* they can actually be anything that conforms to the
* behavior of connect middleware.
*
* You can probably get away with just Express.Router
* most of the time.
*/

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

// export app instead of listening on a port
module.exports = app;

//// HELPERS

function _showBody(template) {
  return function(err, data) {
    if (err) { return next(err); }
    res.render('post', { body: data.body });
  };
}

// State machine representing URI's
//
// Cleans up the logic of connecting via ports,
// urls or file sockets.

var state = require('state');


module.exports = state({
  // Possible states for the URI
  Initial: state('initial'),
  Url: state(),
  Port: state(),
  File: state(),
});

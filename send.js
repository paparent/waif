// Waif send microservice
//
// This microservice does nothing but respond with the value

module.exports = function(value) {
  return function(req, res, send) {
    res.send(value);
  };
};

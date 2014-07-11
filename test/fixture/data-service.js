// services are just normal express routers
var express = require('express');
var router = express.Router();

var api = require('dummy-api');

router.get('/api/people', api.list);
router.get('/api/people/:id', api.get);
router.delete('/api/people/:id', api.delete);
router.put('/api/people/:id', api.update);
router.post('/api/people', api.add);

// export the router instead of listening.
module.exports = router;

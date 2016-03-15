var router = require('express').Router();

// Load the specific APIs
require('./api-artists.js')(router);
require('./api-artworks.js')(router);

module.exports = router;
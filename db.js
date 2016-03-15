// Application DB

// Load variables
var user = process.env.DB_USER;
var password = process.env.DB_PASSWORD;
var server = process.env.DB_HOST || 'localhost';
var port = process.env.DB_PORT || 27017;
var name = process.env.DB_NAME || 'tate';

// Generate the uri
var databaseURI = '';
if (user && password)
    databaseURI = user + ':' + password + '@';
databaseURI += server + ':' + port + '/' + name;

// Obtain and return the connection
var collections = ["artists", "artworks"];
var mongojs = require('mongojs');
var db = mongojs(databaseURI, collections);

module.exports = db;
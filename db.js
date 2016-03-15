// Application DB
var databaseURI = "localhost:27017/tate";
var collections = ["artists", "artworks"];
var mongojs = require('mongojs');
var db = mongojs(databaseURI, collections);

module.exports = db;
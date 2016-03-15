var fs = require('fs');
var db = require('./db');

/**
 * Read a JSON file
 *
 * @param filename
 */
function readJsonFile(filename) {
    var contents = fs.readFileSync(filename);
    return JSON.parse(contents);
}

/**
 * Import a JSON file to the DB
 *
 * @param db
 * @param collectionName
 * @param filename
 */
function importJsonFileToDb(collectionName, filename) {

    // Read the file
    var jsonObject = readJsonFile(filename);

    // Fix the id
    if (typeof jsonObject.id !== 'undefined') {
        var entityName = collectionName.replace(/s$/,'');
        jsonObject[entityName+'Id'] = jsonObject.id;
        delete jsonObject.id;
    }

    // Finally, import the file
    db[collectionName].insert(jsonObject);
}


// http://stackoverflow.com/a/2548133
String.prototype.endsWith = function (suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

/**
 * Based on https://gist.github.com/kethinov/6658166 Gisth by kethinov
 *
 * @param dir
 * @param extension
 * @param filelist
 * @returns {*|Array}
 */
// List all files in a directory in Node.js recursively in a synchronous fashion
var findFiles = function (dir, extension, filelist) {
    var files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function (file) {
        if (fs.statSync(dir + '/' + file).isDirectory()) {
            filelist = findFiles(dir + '/' + file, extension, filelist);
        }
        else {
            if (!extension || file.endsWith(extension))
                filelist.push(dir + "/" + file);
        }
    });
    return filelist;
};

/**
 * Import a collection to the DB
 *
 * @param db
 * @param baseDirectory
 * @param collectionName
 */
var importCollectionToDb = function (baseDirectory, collectionName) {
    console.log("- Importing collection " + collectionName + " from " + baseDirectory + "/" + collectionName);
    var files = findFiles(baseDirectory + "/" + collectionName, '.json');
    files.forEach(function (jsonObject) {
        importJsonFileToDb(collectionName, jsonObject);
    });
    console.log("-- " + files.length + " files successfully imported");
};

/**
 * Import function which will be exposed
 * @param baseDirectory
 */
var importDB = function (baseDirectory) {

    console.log("Importing files to the DB...");

    // Artists collection
    db.artists.remove({}, function() {
        importCollectionToDb(baseDirectory, 'artists');
        db.artists.createIndex( { mda: "text" } , function() {
            console.log ("- Artist index created on title");
        });
    });

    // Artworks collection
    db.artworks.remove({}, function() {
        importCollectionToDb(baseDirectory, 'artworks');
        db.artworks.createIndex( { title: "text" }, function() {
            console.log ("- Artist index created on artworks");
            console.log("DB imported successfully");
            process.exit(0);
        });
    });

};

// Import the files
importDB('tate-gallery');
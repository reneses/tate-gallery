var fs = require('fs');

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
function importJsonFileToDb(db, collectionName, filename) {

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
var importCollectionToDb = function (db, baseDirectory, collectionName) {
    console.log("- Importing collection " + collectionName + " from " + baseDirectory + "/" + collectionName);
    var files = findFiles(baseDirectory + "/" + collectionName, '.json');
    files.forEach(function (jsonObject) {
        importJsonFileToDb(db, collectionName, jsonObject);
    });
    console.log("-- " + files.length + " files successfully imported");
};

/**
 * Import the whole tate collection
 *
 * @param db
 * @param baseDirectory
 * @param collectionName
 */
var importTateCollection = function (db, baseDirectory, collectionName) {
    db[collectionName].findOne({},{}, function (err, doc) {
        if (doc)
            console.log('- The ' + collectionName + ' DB has already been imported');
        else
            importCollectionToDb(db, baseDirectory, collectionName);
    });
};

// Exposed function
exports.importTate = function (db, baseDirectory) {
    console.log("Checking if the DB has to be imported...");
    importTateCollection(db, baseDirectory, 'artists');
    importTateCollection(db, baseDirectory, 'artworks');
    db.artists.createIndex( { mda: "text" } );
    db.artworks.createIndex( { title: "text" } );
};
/**
 * Artists Service, wrapping all the operations related with the artists
 *
 * @param db
 */
var ArtistsService = function (db) {

    /**
     * Find an artist given its id
     *
     * @param id
     * @param callback
     */
    var findOne = function (id, callback) {
        db.artists.findOne({artistId: id}, function (e, docs) {
            callback(docs);
        });
    };

    /**
     * Get all the artists starting with the given initial
     *
     * @param initial
     * @param callback
     */
    var findByInitial = function (initial, callback) {
        db.artists
            .find({
                startLetter: initial.toUpperCase()
            })
            .sort({title: 1}, function (e, docs) {
                callback(docs);
            });
    };

    /**
     * Search among the name of artists
     *
     * @param term
     * @param callback
     */
    var search = function (term, callback) {
        db.artists
            .find({
                mda: {
                    $regex: new RegExp(term, 'i')
                }
            })
            .sort({title: 1}, function (e, docs) {
                callback(docs);
            });
    };

    // Expose the methods
    return {
        findOne: findOne,
        findByInitial: findByInitial,
        search: search
    }

};
module.exports = ArtistsService;
/**
 * Artworks Service, wrapping all the operations related with the artworks
 *
 * @param db
 */
var ArtworksService = function (db) {

    /**
     * Find one artwork given its ID
     *
     * @param id
     * @param callback
     */
    var findOne = function (id, callback) {
        db.artworks.findOne({artworkId: id}, function (e, docs) {
            callback(docs);
        });
    };

    /**
     * Get all the artworks
     *
     * The pagination object admits to parameters:
     * - page: default 1
     * - perPage: default 20
     *
     * @param pagination
     * @param callback
     */
    var find = function (pagination, callback) {
        var page = pagination.page || 1;
        var perPage = pagination.perPage || 20;
        db.artworks
            .find({
                thumbnailUrl: {
                    $exists: true,
                    $ne: null
                },
                title: {
                    $regex: /^[a-zA-Z]/,
                    $ne: null
                }
            })
            .sort({_id: 1})
            .skip((page - 1) * perPage)
            .limit(perPage,
                function (e, docs) {
                    callback(docs);
                });
    };

    /**
     * Count all the artworks in the DB
     *
     * If the parameter pagination.perPage is defined, it will return the number of pages
     * given the page size; otherwise, it will return the total number of items
     *
     * @param pagination
     * @param callback
     */
    var count = function (pagination, callback) {
        var perPage = pagination.perPage;
        db.artworks
            .count({
                thumbnailUrl: {
                    $exists: true,
                    $ne: null
                },
                title: {
                    $regex: /^[a-zA-Z]/,
                    $ne: null
                }
            }, function (e, n) {
                if (perPage)
                    n = Math.ceil(n / perPage);
                callback(n);
            });
    };

    /**
     * Search artworks given a term
     *
     * @param term
     * @param callback
     */
    var search = function (term, callback) {
        db.artworks
            .find({
                title: {$regex: new RegExp(term, 'i')}
            })
            .sort({title: 1}, function (e, docs) {
                callback(docs);
            });
    };

    /**
     * Find artworks given the artist id
     *
     * @param id
     * @param callback
     */
    var findByArtist = function (id, callback) {
        db.artworks
            .find({
                contributors: {
                    $elemMatch : {id: 38}
                }
            })
            .sort({title: 1}, function (e, docs) {
                callback(docs);
            });
    };

    // Expose the methods
    return {
        findOne: findOne,
        find: find,
        findByArtist: findByArtist,
        count: count,
        search: search
    }

};
module.exports = ArtworksService;
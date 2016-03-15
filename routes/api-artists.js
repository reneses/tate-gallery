/**
 * API for the operations related with the artists
 *
 * @param router
 * @constructor
 */
var ArtistsApi = function (router) {

    var artistsService = require('./../services/artists-service');

    /**
     * GET /artists
     *
     * If search parameter is defined, it will be performed regardless of the initial
     *
     * Params:
     * - search
     * - initial (default 'A')
     */
    router.get('/artists', function (req, res) {

        // Try to search
        var search = req.query.search;
        if (search) {
            artistsService(req.db).search(search, function (artists) {
                res.json(artists);
            });
        }

        // Otherwise, filter by initial
        else {
            var initial = req.query.initial || 'A';
            artistsService(req.db).findByInitial(initial, function (artists) {
                res.json(artists);
            });
        }

    });

    /**
     * GET /artists/{id}
     *
     * Get the artist with a given ID
     */
    router.get('/artists/:artist_id', function (req, res) {
        var id = parseInt(req.params.artist_id);
        artistsService(req.db).findOne(id, function (artist) {
            res.json(artist);
        });

    });

};
module.exports = ArtistsApi;
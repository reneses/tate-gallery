/**
 * API for the operations related with the artworks
 *
 * @param router
 * @constructor
 */
var ArtworksApi = function (router) {

    var artworksService = require('./../services/artworks-service');

    /**
     * GET /artworks
     *
     * If the search param is specified, the search will be performed regardless of the rest of params
     * Then, if the artist is specified, a search according to it will be performed
     *
     * Params:
     * - search
     * - artist
     * - page (default: 1)
     * - per_page (default: 20)
     */
    router.get('/artworks/', function (req, res) {

        // Try to search
        var search = req.query.search;
        if (search) {
            artworksService(req.db).search(search, function (artists) {
                res.json(artists);
            });
        }

        // Try to search by artist
        var artistId = req.query.artist;
        if (artistId) {
            artworksService(req.db).findByArtist(artistId, function (artists) {
                res.json(artists);
            });
        }

        // Obtain all the results paginated otherwise
        else {
            var page = req.query.page ? parseInt(req.query.page) : 1;
            var perPage = req.query.per_page ? parseInt(req.query.per_page) : 20;
            artworksService(req.db).find({page: page, perPage: perPage}, function (artists) {
                res.json(artists);
            });

        }
    });

    /**
     * GET /artworks/count
     *
     * If the parameter pagination.perPage is defined, it will return the number of pages
     * given the page size; otherwise, it will return the total number of items
     *
     * Params:
     * - per_page
     */
    router.get('/artworks/count', function (req, res) {
        var perPage = req.query.per_page ? parseInt(req.query.per_page) : null;
        artworksService(req.db).count({perPage: perPage}, function (number) {
            res.json(number);
        });
    });

    /**
     * GET /artworks/{id}
     *
     * Get a specific artwork
     */
    router.get('/artworks/:artwork_id', function (req, res) {
        var id = parseInt(req.params.artwork_id);
        var db = req.db;
        db.artworks.find({artworkId: id}, function (e, docs) {
            res.json(docs);
        });

    });


};
module.exports = ArtworksApi;
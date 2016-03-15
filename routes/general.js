var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Tate Museum'});
});


var artworksService = require('./../services/artworks-service');


router.get('/art/', function (req, res, next) {
    res.render('artworks', { title: 'Tate Museum' });
});
router.get('/art/:id', function (req, res, next) {
    var id = parseInt(req.params.id);
    artworksService(req.db).findOne(id, function (art) {
        console.log(art);
        res.render('artwork', {
            title: 'Tate Museum',
            art: art
        });
    });
});


var artistsService = require('./../services/artists-service');

router.get('/artists/', function (req, res, next) {
    res.render('artists', {title: 'Tate Museum'});
});

router.get('/artists/:id', function (req, res, next) {
    var id = parseInt(req.params.id);
    artistsService(req.db).findOne(id, function (artist) {
        artworksService(req.db).findByArtist(id, function(arts) {
            console.log(artist);
            res.render('artist', {
                title: 'Tate Museum',
                artist: artist,
                arts: arts
            });
        });
    });
});

module.exports = router;
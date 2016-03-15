var currentInitial;
var isSearching;

/**
 * Render the artists
 *
 * @param artists
 */
function renderArtists(artists) {
    var output = artists.reduce(function (out, artist) {
        return out + '<li><a class="artist" href="/artists/' + artist.artistId + '">' + artist.mda + '</a></li>';
    }, '');
    $('#artists-wrapper').html(output);
}

/**
 * Refresh the artists
 *
 * @param initial
 */
function refreshArtists(initial) {
    $.getJSON('/api/artists', {'initial': initial.toUpperCase()})
        .done(function (data) {
            renderArtists(data);
        })
        .fail(function (err) {
            console.log(err)
        });
}

/**
 * Event listener if the initial has been changed
 */
function initialChangedListener() {

    if (isSearching) {
        isSearching = false;
        return;
    }

    // Retrieve the hash
    var hash = location.hash;

    // If there is there is a search param, try to perform a search
    if (hash && hash.substring(0, 4) === '#/s/') {
        var term = hash.substring(4);
        if (term) {
            search(term);
            return;
        }
    }

    // If no initial is selected, choose 'A', otherwise load it
    var newInitial;
    if (!location.hash)
        newInitial = 'A';
    else
        newInitial = location.hash.replace(/#/g, '').toUpperCase();

    // Change backgrounds
    $('.initial-' + newInitial).addClass('selected');
    if (currentInitial)
        $('.initial-' + currentInitial).removeClass('selected');

    // Reload the data
    refreshArtists(newInitial);

    // Update the last initial
    currentInitial = newInitial;
}


/**
 * Perform a search by term
 *
 * @param term
 */
function search(term) {

    $.getJSON('/api/artists', {'search': term})
        .done(function (data) {
            if (data.length)
                renderArtists(data);
            else
                $('#artists-wrapper').html('<li style="padding: 100px 0; text-align: center"><span>No matches!</span></li>');
        })
        .fail(function (err) {
            console.log(err)
        });
}

/**
 * Search listener, triggered when the user searches
 *
 * @param e
 */
function searchListener(e) {
    e.preventDefault();
    var term = $('#search-form > input').val();
    location.hash = '/s/' + term;
    isSearching = true;
    $('.initial-' + currentInitial).removeClass('selected');
    currentInitial = null;
    search(term);
}

// Bind the changed listener
$(window).bind('hashchange', initialChangedListener);

// Bind the search listener
$('#search-form').submit(searchListener);

// Manually init the artists
initialChangedListener();
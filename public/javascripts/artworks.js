var numberOfPages;
var isSearching;
var currentPage;

// Hide and show the loading element
/**
 * Hide the loading animation
 */
function hideLoading() {
    $('#loading').addClass('no-displayed');
}
/**
 * Show the loading animation
 */
function showLoading() {
    $('#artworks-wrapper').html('');
    $('#loading').removeClass('no-displayed');
}

// API and artworks
/**
 * Render a collection of artworks
 *
 * @param artworks
 */
function renderArtworks(artworks) {
    var output = artworks.reduce(function (out, art) {
        var title = art.title;
        if (title.length > 110) // Truncate the title if necesary
            title = title.substr(0, 100) + ' (...)';
        return out +
            '<li style="background-image: url(\'' + art.thumbnailUrl + '\')">' +
            '<a href="/art/' + art.artworkId + '"><span>' + title + '</span></a>' +
            '</li>';
    }, '');
    $('#artworks-wrapper').html(output);
}

/**
 * Refresh current page of the artworks
 *
 * This function will be called everytime the page changes or needs tobe reloaded
 */
function refreshArtworks() {
    var page = currentPage || 1;
    $.getJSON('/api/artworks', {
            per_page: 20,
            page: page
        })
        .done(function (data) {
            console.log(data);
            renderArtworks(data);
            hideLoading();
        })
        .fail(function (err) {
            console.log(err)
        });
}

/**
 * Detect change in the pagination
 */
function paginationChangedListener() {

    // If we are currently searching, do not enter in a loop of changes
    if (isSearching) {
        isSearching = false;
        return;
    }

    // Show 'loading'
    showLoading();

    // Retrieve the hash
    var hash = location.hash;

    // If there is there is a search param, try to perform a search
    if (hash && hash.substring(0, 4) === '#/s/') {
        var term = hash.substring(4);
        if (term) {
            renderNavigation();
            search(term);
            return;
        }
    }

    // Otherwise, retrieve the page
    var page = location.hash.split('/').pop();
    if (!page || isNaN(page))
        currentPage = 1;
    else
        currentPage = parseInt(page);

    // Render the navigation bar and the artworks
    renderNavigation();
    refreshArtworks();
}

/**
 * Render the navigation bar
 */
function renderNavigation() {

    var current = currentPage || 1;
    var visible = [];
    var page = current - 2;

    // Fix minimum
    if (page < 1)
        page = 1;

    // Fix maximum
    else if (current == numberOfPages)
        page -= 2;
    else if (current == numberOfPages - 1)
        page -= 1;

    // Fill the arrays
    var times;
    for (times = 0; times < 5; times++)
        visible.push(page++);

    // Render output
    var output = '';

    // Beginning
    if (current > 1) {
        output = '<li><a href="#/p/1">&laquo;</a></li>' +
            '<li><a href="#/p/' + (current - 1) + '">&lsaquo;</a></li>';
    }
    else {
        output = '<li class="no-selectable"><a href="javascript:void(0)">&nbsp;</a></li>' +
            '<li class="no-selectable"><a href="javascript:void(0)">&nbsp;</a></li>';
    }

    // Numbers
    output += visible.reduce(function (out, v) {
        if (currentPage && v == current)
            return out + '<li class="selected"><a href="#/p/' + v + '">' + v + '</a></li>';
        return out + '<li><a href="#/p/' + v + '">' + v + '</a></li>';
    }, '');

    // End
    if (current < numberOfPages) {
        output += '<li><a href="#/p/' + (current + 1) + '">&rsaquo;</a></li>' +
            '<li><a href="#/p/' + numberOfPages + '">&raquo;</a></li>';
    }
    else {
        output += '<li class="no-selectable"><a href="javascript:void(0)">&nbsp;</a></li>' +
            '<li class="no-selectable"><a href="javascript:void(0)">&nbsp;</a></li>';
    }

    // Random
    var randomPage = Math.floor((Math.random() * numberOfPages) + 1);
    output += '<li class="no-selectable"><a href="javascript:void(0)">&nbsp;</a></li>'
        + '<li><a href="#/p/' + randomPage + '"><i class="fa fa-random"></i></a></li>';


    // Render the output
    $('.page-navigation').html(output);
}

/**
 * Search
 *
 * @param term
 */
function search(term) {
    $.getJSON('/api/artworks', {'search': term})
        .done(function (data) {
            if (data.length)
                renderArtworks(data);
            else
                $('#artworks-wrapper').html('<li style="padding: 100px 0; text-align: center"><span>No matches!</span></li>');
            hideLoading();
        })
        .fail(function (err) {
            console.log(err)
        });
}

/**
 * Search event triggered when the user press search
 *
 * @param e
 */
function searchEvent(e) {
    e.preventDefault();
    showLoading();
    var term = $('#search-form > input').val();
    location.hash = '/s/' + term;
    isSearching = true;
    currentPage = null;
    search(term);
}

/**
 * Init the page
 *
 * This function is responsible of obtaining the number of pages and rendering the first page
 */
function init() {
    $.getJSON('/api/artworks/count', {per_page: 20})
        .done(function (n) {
            numberOfPages = n;
            paginationChangedListener();
        })
        .fail(function (err) {
            console.log(err)
        });
}

// Bind the search event
$('#search-form').submit(searchEvent);

// Bind the pagination listener to the url
$(window).bind('hashchange', paginationChangedListener);

// Init the page
init();
const sinhalasub = require('sinhalasub.lk');

async function searchMovie(movieName) {
    return await sinhalasub.searchMovie(movieName);
}

async function getMovieDetails(movieTitle) {
    return await sinhalasub.getMovieDetails(movieTitle);
}

async function getDownloadLink(movieTitle, quality) {
    return await sinhalasub.getDownloadLink(movieTitle, quality);
}

module.exports = {
    searchMovie,
    getMovieDetails,
    getDownloadLink
};

const MoviesControlles = require("../controlles/movies")
const router = require("express").Router()
const { ApiEndpoints } = require("../common/apiEndpoints"); 

// get Movies links
router.get(ApiEndpoints.Movies.getMovieslinks , MoviesControlles.getMovieslinks)

// get Movie
router.get(ApiEndpoints.Movies.getAllMovieslinks , MoviesControlles.getAllMovieslinks)

// get All Movies links
router.get(ApiEndpoints.Movies.getMovie , MoviesControlles.getMovie)

// get All Movies
router.get(ApiEndpoints.Movies.getAllMovies , MoviesControlles.getAllMovies)

// More Actors Btn
router.get(ApiEndpoints.Movies.MoreActorsBtn , MoviesControlles.MoreActorsBtn)

module.exports = router
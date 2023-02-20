const MoviesServices = require("../services/movies")
const codes = require("../common/codes")


// get Movies links
const getMovieslinks = (req, res) => {
    const {index} = req.params ;

    MoviesServices.getMovieslinks(index).then(result => {
        res.status(codes.ok).json({err: false, msg : result})
    }).catch(err => {
        res.status(codes.badRequest).json({err: true, msg : err})
    })
}

// get All Movies links
const getAllMovieslinks = (req, res) => {
    const {limit} = req.params ;

    MoviesServices.getAllMovieslinks(limit).then(result => {
        res.status(codes.ok).json({err: false, msg : result})
    }).catch(err => {
        res.status(codes.badRequest).json({err: true, msg : err})
    })
}



// get Movie
const getMovie = (req, res) => {
    const {url , title , year} = req.params ;

    MoviesServices.getMovie(title  , year , url).then(result => {
        res.status(codes.ok).json({err: false, msg : result})
    }).catch(err => {
        res.status(codes.badRequest).json({err: true, msg : err})
    })
}



// get All Movies
const getAllMovies = (req, res) => {
    const {limit} = req.params ;

    MoviesServices.getAllMovies(limit).then(result => {
        res.status(codes.ok).json({err: false, msg : result})
    }).catch(err => {
        res.status(codes.badRequest).json({err: true, msg : err})
    })
}



// More Actors Btn
const MoreActorsBtn = (req, res) => {
    const {postId , cookie} = req.params ;

    MoviesServices.MoreActorsBtn(postId , cookie).then(result => {
        res.status(codes.ok).json({err: false, msg : result})
    }).catch(err => {
        res.status(codes.badRequest).json({err: true, msg : err})
    })
}


module.exports = { getMovieslinks , getAllMovieslinks , getMovie ,  getAllMovies , MoreActorsBtn }
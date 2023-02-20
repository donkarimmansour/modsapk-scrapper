const EpisodesServices = require("../services/episodes")
const codes = require("../common/codes")



// get Episode
const getEpisode = (req, res) => {
    const {url , title} = req.params ;

    EpisodesServices.getEpisode(title  , url).then(result => {
        res.status(codes.ok).json({err: false, msg : result})
    }).catch(err => {
        res.status(codes.badRequest).json({err: true, msg : err})
    })
}



// get All Episodes
const getAllEpisodes = (req, res) => {

    EpisodesServices.getAllEpisodes().then(result => {
        res.status(codes.ok).json({err: false, msg : result})
    }).catch(err => {
        res.status(codes.badRequest).json({err: true, msg : err})
    })
}




module.exports = { getEpisode ,  getAllEpisodes }
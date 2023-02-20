const EpisodesControlles = require("../controlles/episodes")
const router = require("express").Router()
const { ApiEndpoints } = require("../common/apiEndpoints"); 


// get All Episodes links
router.get(ApiEndpoints.Episodes.getEpisode , EpisodesControlles.getEpisode)

// get All Episodes
router.get(ApiEndpoints.Episodes.getAllEpisodes , EpisodesControlles.getAllEpisodes)


module.exports = router
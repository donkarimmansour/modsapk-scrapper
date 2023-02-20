const SeriesServices = require("../services/series")
const codes = require("../common/codes")


// get Series links
const getSerieslinks = (req, res) => {
    const {index} = req.params ;

    SeriesServices.getSerieslinks(index).then(result => {
        res.status(codes.ok).json({err: false, msg : result})
    }).catch(err => {
        res.status(codes.badRequest).json({err: true, msg : err})
    })
}

// get All Series links
const getAllSerieslinks = (req, res) => {
    const {limit} = req.params ;

    SeriesServices.getAllSerieslinks(limit).then(result => {
        res.status(codes.ok).json({err: false, msg : result})
    }).catch(err => {
        res.status(codes.badRequest).json({err: true, msg : err})
    })
}



// get Serie
const getSerie = (req, res) => {
    const {url , title , year} = req.params ;

    SeriesServices.getSerie(title  , year , url).then(result => {
        res.status(codes.ok).json({err: false, msg : result})
    }).catch(err => {
        res.status(codes.badRequest).json({err: true, msg : err})
    })
}



// get All Series
const getAllSeries = (req, res) => {
    const {limit} = req.params ;

    SeriesServices.getAllSeries(limit).then(result => {
        res.status(codes.ok).json({err: false, msg : result})
    }).catch(err => {
        res.status(codes.badRequest).json({err: true, msg : err})
    })
}


module.exports = { getSerieslinks , getAllSerieslinks , getSerie ,  getAllSeries }
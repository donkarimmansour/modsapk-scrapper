const SeriesControlles = require("../controlles/series")
const router = require("express").Router()
const { ApiEndpoints } = require("../common/apiEndpoints"); 

// get Series links
router.get(ApiEndpoints.Series.getSerieslinks , SeriesControlles.getSerieslinks)

// get Serie
router.get(ApiEndpoints.Series.getAllSerieslinks , SeriesControlles.getAllSerieslinks)

// get All Series links
router.get(ApiEndpoints.Series.getSerie , SeriesControlles.getSerie)

// get All Series
router.get(ApiEndpoints.Series.getAllSeries , SeriesControlles.getAllSeries)


module.exports = router
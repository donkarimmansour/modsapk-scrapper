const SessionsControlles = require("../controlles/sessions")
const router = require("express").Router()
const { ApiEndpoints } = require("../common/apiEndpoints"); 

// get All Sessions links
router.get(ApiEndpoints.Sessions.getSession , SessionsControlles.getSession)

// get All Sessions
router.get(ApiEndpoints.Sessions.getAllSessions , SessionsControlles.getAllSessions)
         

module.exports = router
const SessionsServices = require("../services/sessions")
const codes = require("../common/codes")



// get Session
const getSession = (req, res) => {
    const {url , title} = req.params ;

    SessionsServices.getSession(title  , url).then(result => {
        res.status(codes.ok).json({err: false, msg : result})
    }).catch(err => {
        res.status(codes.badRequest).json({err: true, msg : err})
    })
}



// get All Sessions
const getAllSessions = (req, res) => {

    SessionsServices.getAllSessions().then(result => {
        res.status(codes.ok).json({err: false, msg : result})
    }).catch(err => {
        res.status(codes.badRequest).json({err: true, msg : err})
    })
}




module.exports = { getSession ,  getAllSessions }
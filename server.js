
const express = require("express")
const app = express()
const morgan = require("morgan")
const DB = require("./database/db")
const cors = require("cors");
const { Host } = require("./common/apiEndpoints")

//env file
require("dotenv").config()

//database initialize
//DB();

//development
if (app.get("env") == "development") {
    app.use(morgan("dev"))
}


//decoded data
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use( cors() );


module.exports = {app }
